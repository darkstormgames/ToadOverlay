const db = require('../SQLBase');
const { DataTypes } = require('sequelize');
// const { Channel } = require('./Channel');

const ChannelDataEntity = db.connection.define('ChannelData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  // channel_id: {
  //     type: DataTypes.BIGINT(20),
  //     allowNull: false,
  //     unique: true,
  //     references: {
  //         model: Channel,
  //         key: 'id'
  //     }
  // },
  home_current: {
    type: DataTypes.INTEGER(4),
    defaultValue: 0,
    allowNull: false
  },
  home_penalties: DataTypes.TEXT,
  home_mkc_url: DataTypes.STRING(256),
  home_tag: DataTypes.STRING(7),
  home_name: DataTypes.STRING(255),
  home_img: DataTypes.STRING(255),
  guest_current: {
    type: DataTypes.INTEGER(4),
    defaultValue: 0,
    allowNull: false
  },
  guest_penalties: DataTypes.TEXT,
  guest_mkc_url: DataTypes.STRING(256),
  guest_tag: DataTypes.STRING(7),
  guest_name: DataTypes.STRING(255),
  guest_img: DataTypes.STRING(255)
}, 
{
  tableName: 'channel_data',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  ChannelData: ChannelDataEntity,
  sync: () => {
    return ChannelDataEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
