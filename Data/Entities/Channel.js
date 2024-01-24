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
  name: {
    type: DataTypes.STRING(100)
  },

  guest_current: {
    type: DataTypes.INTEGER(4),
    defaultValue: 0,
    allowNull: false
  },
  guest_penalties: DataTypes.TEXT,
  guest_mkc_url: DataTypes.STRING(256),
  guest_tag: DataTypes.STRING(7),
  guest_name: DataTypes.STRING(255),
  guest_img: DataTypes.STRING(255),

  home_current: {
    type: DataTypes.INTEGER(4),
    defaultValue: 0,
    allowNull: false
  },
  home_penalties: DataTypes.TEXT,
  home_mkc_url: DataTypes.STRING(256),
  home_tag: DataTypes.STRING(7),
  home_name: DataTypes.STRING(255),
  home_img: DataTypes.STRING(255)
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
