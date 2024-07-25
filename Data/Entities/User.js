const db = require('../SQLBase');
const { DataTypes } = require('sequelize');

const UserEntity = db.connection.define('User', {
  id: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  name: DataTypes.STRING(100),
  discriminator: DataTypes.STRING(4),
  fc_switch: DataTypes.STRING(17),

  // Note: absolutely useless, because sequelize does this stuff by itself...
  //       but a really good learning experience on how you can handle this stuff :)
  // channels: {
  //   type: DataTypes.VIRTUAL,
  //   async get() {
  //     if (this.sequelize.isDefined('Channel')) {
  //       let tempSQL = `SELECT channel_id from ${process.env.SQL_NAME}.user_channel WHERE user_id = ${this.getDataValue('id')}`;
  //       return await this.sequelize.model('Channel').findAll({
  //         where: {
  //           id: {
  //             [Op.in]: this.sequelize.literal(`(${tempSQL})`)
  //           }
  //         }
  //       });
  //     } else { throw new Error('UNDEFINED: Model is not yet defined. (user->channel)'); }
  //   },
  //   set() { throw new Error('FORBIDDEN: Cannot set references. (user->channel)'); }
  // }
},
{
  tableName: 'user',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = {
  User: UserEntity,
  sync: () => {
    return UserEntity.sync({ alter: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : true) });
  }
}
