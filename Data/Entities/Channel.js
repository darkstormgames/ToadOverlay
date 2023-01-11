const db = require('../SQLBase');
const { DataTypes } = require('sequelize');
// const { Guild } = require('./Guild');

const ChannelEntity = db.connection.define('Channel', {
  id: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  // guild_id: {
  //   type: DataTypes.BIGINT(20),
  //   allowNull: false,
  //   references: {
  //     model: Guild,
  //     key: 'id'
  //   }
  // },
  name: {
    type: DataTypes.STRING(100)
  }
},
{
  tableName: 'channel',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  Channel: ChannelEntity,
  sync: () => {
    return ChannelEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
