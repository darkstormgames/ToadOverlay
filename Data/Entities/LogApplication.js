const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const LogApplicationEntity = db.connection.define('LogApplication', {
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
  stack: DataTypes.TEXT
},
{
  tableName: 'log_application',
  timestamps: true,
  createdAt: 'created',
  updatedAt: false
});

module.exports = {
  LogApplication: LogApplicationEntity,
  sync: () => {
    return LogApplicationEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}
