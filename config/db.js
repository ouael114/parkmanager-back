const mysql = require('mysql2');

const connection = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
});

module.exports = connection
