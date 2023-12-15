import mysql from "mysql2"

const pool = mysql.createPool({
    host: 'localhost',
    user: 'sam',
    password:"1234",
    database: 'darkVolumes'
  });
  
  export default pool;