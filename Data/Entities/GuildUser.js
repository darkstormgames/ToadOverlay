const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const GuildUserEntity = db.connection.define('GuildUser', {
  displayname: DataTypes.STRING(100)
},
{
  tableName: 'guild_user',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  GuildUser: GuildUserEntity,
  sync: () => {
    return GuildUserEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}
