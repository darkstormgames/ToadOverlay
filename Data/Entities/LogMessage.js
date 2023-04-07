const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const LogMessageEntity = db.connection.define('LogMessage', {
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
  content: DataTypes.TEXT,
},
{
  tableName: 'log_message',
  timestamps: true,
  createdAt: 'created',
  updatedAt: false
});

module.exports = {
  LogMessage: LogMessageEntity,
  sync: () => {
    return LogMessageEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}