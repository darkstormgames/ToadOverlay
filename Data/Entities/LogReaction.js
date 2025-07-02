const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const LogReactionEntity = db.connection.define('LogReaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  level: DataTypes.STRING(256),
  status: DataTypes.STRING(256),
  source: DataTypes.STRING(256),
  message: DataTypes.TEXT,
  emoji: DataTypes.STRING(256),
  message_id: DataTypes.STRING(256),
  user_id: DataTypes.BIGINT(20),
  channel_id: {
    type: DataTypes.BIGINT(20),
    allowNull: true  // DM reactions don't have a channel_id in the database
  },
  guild_id: {
    type: DataTypes.BIGINT(20),
    allowNull: true   // DM reactions don't have a guild_id
  }
},
{
  tableName: 'log_reaction',
  timestamps: true,
  createdAt: 'created',
  updatedAt: false
});

module.exports = {
  LogReaction: LogReactionEntity,
  sync: () => {
    return LogReactionEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}
