require('dotenv').config();
const mysql = require('mysql2/promise');
const dbPool=mysql.createPool({
  host:process.env.HOST,
  port:process.env.PORT,
  user:process.env.DB_USER,
  password:'',
  database:'skripsi_dashboard'
});

const connectToMySQL = async () => {
  try {
      await dbPool.getConnection();
      console.log('MySQL database connected!');
  } catch (err) {
      console.log('MySQL database connection error!');

      process.exit(1);
  }
};

connectToMySQL().then();

module.exports = dbPool;   