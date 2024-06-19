const { Sequelize } = require('sequelize');

const connection = new Sequelize(
  process.env.SQL_NAME,
  process.env.SQL_USER,
  process.env.SQL_PASS,
  {
    host: process.env.SQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_general_ci'
      }
    },
    logging: (process.env.ENVIRONMENT == 'PRODUCTIVE' ? false : console.log),
    retry: {
      match: [/(?:Deadlock)|(?:DatabaseError)|(?:ContraintError)/i],
      max: 7
    },
    port: 3306
  }
);

connection.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(2);
  })

module.exports = {
  connection: connection
}