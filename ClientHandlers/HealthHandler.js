const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const malfunctionLevels = ['ERROR', 'FATAL'];
const malfunctionStatuses = ['FAILED', 'ERROR', 'DB_ERROR'];

const toSqliteDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

const startOfUtcDay = (date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const getMonthKeysBetween = (start, end) => {
  const months = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));

  while (cursor <= last) {
    months.push(`${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
};

const mergeBucketRows = (rows, bucketKey, outputKey) => {
  const buckets = new Map();

  rows.forEach((row) => {
    const bucketValue = row[bucketKey];
    if (!bucketValue) return;

    if (!buckets.has(bucketValue)) {
      buckets.set(bucketValue, {
        [outputKey]: bucketValue,
        count: 0,
        sources: {},
        levels: {},
        statuses: {}
      });
    }

    const bucket = buckets.get(bucketValue);
    const count = Number(row.count) || 0;
    const source = row.source || 'Unknown';
    const level = row.level || 'NONE';
    const status = row.status || 'NONE';

    bucket.count += count;
    bucket.sources[source] = (bucket.sources[source] || 0) + count;
    bucket.levels[level] = (bucket.levels[level] || 0) + count;
    bucket.statuses[status] = (bucket.statuses[status] || 0) + count;
  });

  return Array.from(buckets.values()).map((bucket) => ({
    ...bucket,
    sources: Object.entries(bucket.sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source)),
    levels: Object.entries(bucket.levels)
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => b.count - a.count || a.level.localeCompare(b.level)),
    statuses: Object.entries(bucket.statuses)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count || a.status.localeCompare(b.status))
  }));
};

const getApplicationErrorHistory = (appDb) => {
  const Database = require('better-sqlite3');
  const now = new Date();
  const hourlyStart = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const dailyStart = startOfUtcDay(new Date(now.getTime() - (13 * 24 * 60 * 60 * 1000)));
  const queryStart = hourlyStart < dailyStart ? hourlyStart : dailyStart;
  const monthKeys = getMonthKeysBetween(queryStart, now);
  const hourlyRows = [];
  const dailyRows = [];

  monthKeys.forEach((monthKey) => {
    const dbPath = path.join(appDb, 'logs', 'application', `${monthKey}.db`);
    if (!fs.existsSync(dbPath)) return;

    const db = new Database(dbPath, { readonly: true, fileMustExist: true, timeout: 5000 });
    try {
      const where = `
        created >= ?
        AND created <= ?
        AND (
          level IN (${malfunctionLevels.map(() => '?').join(', ')})
          OR status IN (${malfunctionStatuses.map(() => '?').join(', ')})
        )
      `;
      const params = (start) => [
        toSqliteDate(start),
        toSqliteDate(now),
        ...malfunctionLevels,
        ...malfunctionStatuses
      ];

      hourlyRows.push(...db.prepare(`
        SELECT
          strftime('%Y-%m-%dT%H:00:00.000Z', created) AS hour,
          COALESCE(NULLIF(source, ''), 'Unknown') AS source,
          COALESCE(NULLIF(level, ''), 'NONE') AS level,
          COALESCE(NULLIF(status, ''), 'NONE') AS status,
          COUNT(*) AS count
        FROM log_application
        WHERE ${where}
        GROUP BY hour, source, level, status
        ORDER BY hour ASC
      `).all(...params(hourlyStart)));

      dailyRows.push(...db.prepare(`
        SELECT
          strftime('%Y-%m-%d', created) AS day,
          COALESCE(NULLIF(source, ''), 'Unknown') AS source,
          COALESCE(NULLIF(level, ''), 'NONE') AS level,
          COALESCE(NULLIF(status, ''), 'NONE') AS status,
          COUNT(*) AS count
        FROM log_application
        WHERE ${where}
        GROUP BY day, source, level, status
        ORDER BY day ASC
      `).all(...params(dailyStart)));
    } finally {
      db.close();
    }
  });

  return {
    criteria: {
      levels: malfunctionLevels,
      statuses: malfunctionStatuses
    },
    last24Hours: mergeBucketRows(hourlyRows, 'hour', 'time'),
    last14Days: mergeBucketRows(dailyRows, 'day', 'date')
  };
};

const getSafeApplicationErrorHistory = (appDb, startupLog) => {
  try {
    return getApplicationErrorHistory(appDb);
  } catch (error) {
    startupLog('Unable to read application error history', error);
    return {
      criteria: {
        levels: malfunctionLevels,
        statuses: malfunctionStatuses
      },
      last24Hours: [],
      last14Days: [],
      unavailable: true
    };
  }
};

const startHealthKeepalive = ({ healthPort, startupLog }) => {
  if (process.env.KEEPALIVE_ENABLED === 'false') {
    startupLog('Health keepalive disabled');
    return;
  }

  const keepaliveIntervalMs = Number.parseInt(process.env.KEEPALIVE_INTERVAL_MS || '240000', 10);
  const keepaliveUrl = process.env.KEEPALIVE_URL;

  if (!keepaliveUrl && process.env.PORT) {
    startupLog('Health keepalive not started: set KEEPALIVE_URL to the public /health URL when running under Passenger');
    return;
  }

  if (!Number.isFinite(keepaliveIntervalMs) || keepaliveIntervalMs < 10000) {
    startupLog(`Health keepalive not started: invalid interval "${process.env.KEEPALIVE_INTERVAL_MS}"`);
    return;
  }

  let url;
  try {
    url = new URL(keepaliveUrl || `http://127.0.0.1:${healthPort}/health`);
  } catch (error) {
    startupLog(`Health keepalive not started: invalid URL "${keepaliveUrl}"`, error);
    return;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    startupLog(`Health keepalive not started: unsupported URL protocol "${url.protocol}"`);
    return;
  }

  let consecutiveFailures = 0;

  const callHealthEndpoint = () => {
    const transport = url.protocol === 'https:' ? https : http;
    const req = transport.get(url, { timeout: 10000 }, (res) => {
      res.resume();
      if (res.statusCode >= 500) {
        consecutiveFailures++;
        startupLog(`Health keepalive returned HTTP ${res.statusCode}`);
      } else if (consecutiveFailures > 0) {
        startupLog('Health keepalive recovered');
        consecutiveFailures = 0;
      }
    });

    req.on('timeout', () => {
      req.destroy(new Error('Health keepalive timed out'));
    });

    req.on('error', (error) => {
      consecutiveFailures++;
      if (consecutiveFailures === 1 || consecutiveFailures % 5 === 0) {
        startupLog(`Health keepalive failed for ${url.href}`, error);
      }
    });
  };

  setInterval(callHealthEndpoint, keepaliveIntervalMs);
  setTimeout(callHealthEndpoint, 5000);
  startupLog(`Health keepalive started for ${url.href} every ${keepaliveIntervalMs}ms`);
};

const startHealthServer = ({
  appDb,
  getBotStatus,
  getClient,
  getStartupError,
  healthPort,
  setBotStatus,
  setStartupError,
  startTime,
  startupLog
}) => {
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
      const startupError = getStartupError();
      const client = getClient();
      const statusCode = startupError ? 503 : 200;

      res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        status: startupError ? 'error' : 'ok',
        bot: getBotStatus(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
        discord: client?.isReady() ? 'connected' : 'connecting',
        startupLog: 'app_data/logs/startup.log',
        error: startupError,
        errorHistory: getSafeApplicationErrorHistory(appDb, startupLog),
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(healthPort, () => {
    startupLog(`Health server listening on ${healthPort}`);
  }).on('error', (error) => {
    setStartupError(`Health server failed to listen on ${healthPort}`);
    setBotStatus('error');
    startupLog(getStartupError(), error);
  });

  return server;
};

module.exports = {
  startHealthKeepalive,
  startHealthServer
};
