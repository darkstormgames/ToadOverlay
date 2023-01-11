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
  command: DataTypes.STRING(256),
  status: DataTypes.STRING(256),
  details: DataTypes.TEXT
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
    return LogApplicationEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
