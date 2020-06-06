// imports
import Pool from 'pg'; // postgres db driver

// establish db connection
const pool = new Pool({
    database: "task_app",
    host: "localhost",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});

// log connections to the database
pool.on('connect', () => {
    console.log("New connection to task_app");
});

// log db errors
pool.on('error', (error) => {
    console.log("ERROR: Postgres pool:", error);
});

console.log("pg pool: Finished loading");

// fancy schmancy export statment
export default pool;