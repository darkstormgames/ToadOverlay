const db = require('../SQLBase');

const ChannelProfileEntity = db.connection.define('ChannelProfile', {
    // Can stay empty, because the sequelize-generated fields while connecting are enough to make it work
}, 
{
  tableName: 'channel_profile',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  ChannelProfile: ChannelProfileEntity,
  sync: () => {
    return ChannelProfileEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}
