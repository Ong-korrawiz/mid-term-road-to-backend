import mysql, { ConnectionOptions } from 'mysql2'
import dotnev from 'dotenv'

dotnev.config()
// connecttion ondifg for mysql
const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const conn = mysql.createConnection(dbConfig);

export default conn;