const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const UserChannelEntity = db.connection.define('UserChannel', {
  auth: {
    type: DataTypes.INTEGER(9),
    allowNull: false
  },
  isActive: DataTypes.BOOLEAN
},
{
  tableName: 'user_channel',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  UserChannel: UserChannelEntity,
  sync: () => {
    return UserChannelEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
