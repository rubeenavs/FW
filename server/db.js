const { Pool } = require('pg');
require('dotenv').config(); 


const pool = new Pool({
  user: process.env.DB_USER,       
  host: process.env.DB_HOST,       
  database: process.env.DB_NAME,   
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,       
});


pool.query('SELECT 1')
  .then(() => {
      console.log("Database connection successful");
  })
  .catch(err => {
      console.error("Database connection failed:", err.stack);
  });

module.exports = pool; 
