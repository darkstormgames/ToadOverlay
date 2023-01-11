const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const LogCommandEntity = db.connection.define('LogCommand', {
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
  tableName: 'log_command',
  timestamps: true,
  createdAt: 'created',
  updatedAt: false
});

module.exports = {
  LogCommand: LogCommandEntity,
  sync: () => {
    return LogCommandEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
