import mysql from "mysql2";

const db = mysql
  .createPool({
    host: "localhost",
    port: 3307,
    user: "admin",
    password: "admin",
    database: "pos",
  })
  .promise();

export default db;
