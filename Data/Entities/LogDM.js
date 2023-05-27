const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const LogDMEntity = db.connection.define('LogDM', {
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
  tableName: 'log_dm',
  timestamps: true,
  createdAt: 'created',
  updatedAt: false
});

module.exports = {
  LogDM: LogDMEntity,
  sync: () => {
    return LogDMEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}