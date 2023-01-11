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
  command: DataTypes.STRING(256),
  status: DataTypes.STRING(256),
  details: DataTypes.TEXT,
  message: DataTypes.TEXT
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
    return LogDMEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
