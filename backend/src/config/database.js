const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'sqlite') {
  const storagePath = process.env.DB_STORAGE 
    ? path.resolve(process.cwd(), process.env.DB_STORAGE)
    : path.resolve(process.cwd(), 'database', 'environmental_network.sqlite');
    
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
  console.log(`[Database] Using SQLite storage at: ${storagePath}`);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'environmental_network',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
  console.log(`[Database] Configured for MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}

module.exports = sequelize;
