// imports
const pg = require('pg'); // postgres db driver

// establish db connection
const Pool = pg.Pool;
const pool = new Pool({
    database: "task_app",
    host: "localhost",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});

// log connections to the database
pool.on('connect', () => {
    console.log("DB: New connection to task_app");
});

// log db errors
pool.on('error', (error) => {
    console.log("ERROR: Postgres pool:", error);
});

console.log("DB: pool established");

// fancy schmancy export statment
module.exports = pool;