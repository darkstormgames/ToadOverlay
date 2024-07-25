const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const GuildEntity = db.connection.define('Guild', {
  id: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  name: DataTypes.STRING(100)
},
{
  tableName: 'guild',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  Guild: GuildEntity,
  sync: () => {
    return GuildEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}
