// imports
const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: { rejectUnauthorized: false },
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
} else {
    config = {
        host: 'localhost', // Server hosting the postgres database
        port: 5432, // env var: PGPORT
        database: 'task_app', // CHANGE THIS LINE! env var: PGDATABASE, this is likely the one thing you need to change to get up and running
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
}

const pool = new pg.Pool(config);

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