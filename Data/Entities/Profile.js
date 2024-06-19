const db = require('../SQLBase');
const { DataTypes } = require('sequelize');
const { User } = require('./User');

const ProfileEntity = db.connection.define('Profile', {
  id: {
    type: DataTypes.STRING(36),
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: DataTypes.STRING(100),
  bg_url: {
    type: DataTypes.STRING(256),
    defaultValue: 'empty',
  },
  css: {
    type: DataTypes.TEXT,
    defaultValue: 'empty',
  },
  html: {
    type: DataTypes.TEXT,
    defaultValue: 'empty',
  },
  update_span: {
    type: DataTypes.INTEGER(4),
    defaultValue: 1000,
  },
},
{
  tableName: 'profile',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  Profile: ProfileEntity,
  sync: () => {
    return ProfileEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : true) });
  }
}
