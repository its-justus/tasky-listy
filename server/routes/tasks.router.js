// using fancy import statements cause we are real backend programmers 
const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();

// get columnNames. columnNames is used in the POST query builder to avoid 
// sending invalid columns to the database.
const columnNames = [];
pool.query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = 'tasks';")
    .then((result) => {
        for(let column of result.rows) {
            columnNames.push(column.column_name);
        }
    }) // end then

// __________ ROUTING __________
// delete task
router.delete('/:id', deleteTask);

// get tasks
router.get('/', getTasks);

// post task
router.post('/', postTask);

// update task
router.put('/:id', updateTask);

// __________ END ROUTING __________


// __________ ROUTER FUNCTIONS __________
// Router functions are below, ordered alphabetically including HTTP verb

/**
 * deleteTask handles DELETE /tasks/:id routes. submits a pg query to the database.
 * 
 * @param req - the request object containing request details received by the router
 * @param res - the response object by which to send a reply to the client
 * @returns null
 */
function deleteTask(req, res){
    
}// end deleteTask


/**
 * getTasks handles GET /tasks/ routes. queries database for all tasks.
 * 
 * @param req - the request object containing request details received by the router
 * @param res - responds with a status code and the requested rows
 * @returns null
 */
function getTasks(req, res){
    console.log("ROUTE: GET /tasks/");

    // define query text
    // FROM must query get_all_tasks() function, not tasks table. get_all_tasks ignores "deleted" tasks
    const queryText = "SELECT * FROM get_all_tasks();"
    console.log("\tQUERY:", queryText);

    // query the pool
    pool.query(queryText)
        .then((result) => { // successful query, respond with rows
            console.log("\tQUERY: Success! rowCount:", result.rowCount);
            res.status(200).send(result.rows);
        })// end then
        .catch((error) => { // error caught, respond with error message
            console.log("\tQUERY: Failure:", error);
            res.status(500).send(error);
        });// end catch
}// end getTasks


/**
 * postTask handles POST /tasks/ routes. adds a new task to the database. compares
 * the given task item with a list of known column names, discarding any irrelevant keys.
 * NOTE: falsy values for known columns are not included in the query. any boolean
 * columns are defaulted to false to prevent null values. This might bite me in the butt
 * later...
 * 
 * @param req - the request object containing request details received by the router
 * @param res - the response object by which to send a reply to the client
 * @returns null
 */
function postTask(req, res){
    console.log('ROUTE: POST /tasks/');
    let task = req.body;

    // define columns and values strings
    let columns = ''; // columns string to be inserted into the query
    let values = ''; // values string to be inserted into the query
    let valNum = 1; // number iterator to be used in generating the values string
    let queryValues = []; // values array to be used in the pool.query call

    // loop through keys in the received task
    for(let key in task) {
        let value = task[key];
        // if value is falsy or the key name is not in columnNames
        if(value == false || columnNames.includes(key) === false){
            console.log('\tWARNING: unrecognized key submitted:', key);
            continue; // skip this key
        }

        // if the column string is not empty, add a comma to columns and values
        if (columns !== ''){ 
            columns = columns + ", ";
            values = values + ", ";
        } // end if

        // add the key to the columns string
        columns = columns + key;
        // and "$valNum" to the values string, then iterate currentValue
        values = values + `$${valNum++}`;

        if(isNaN(Number(task[key]))){ // if the value of task[key] is not a number
            queryValues.push(task[key]); // add as a string
        } else { // if it is a number
            queryValues.push(Number(task[key])); // add as a number
        } // end if
    }

    // if we've reached this point we should be good to build the query
    let queryText = `INSERT INTO tasks (${columns}) VALUES (${values});`;
    console.log('\tQUERY:', queryText);
    console.log('\tVALUES:', queryValues);

    // time to make the actual pg query
    pool.query(queryText, queryValues)
        .then((result) => { // successful query, respond with rows
            console.log("\tQUERY: Success! rowCount:", result.rowCount);
            res.sendStatus(201);
        })// end then
        .catch((error) => { // error caught, respond with error message
            console.log("\tQUERY: Failure:", error);
            res.status(500).send("Ouch, don't do that please!");
        });// end catch
}// end postTask

/**
 * updateTask updates a given task's attributes to the provided attributes in req.body. 
 * 
 * @param req - the request object containing request details received by the router
 * @param res - the response object by which to send a reply to the client
 * @returns null
 */
function updateTask(req, res){
    console.log('ROUTE: PUT /tasks/:id');
    let task = req.body;
    task.id = req.params.id;

    // define columns and values strings
    let columns = ''; // columns string to be inserted into the query
    let values = ''; // values string to be inserted into the query
    let valNum = 1; // number iterator to be used in generating the values string
    let queryValues = []; // values array to be used in the pool.query call

    // loop through keys in the received task
    for(let key in task) {
        let value = task[key];
        // if value is falsy or the key name is not in columnNames
        if(value == false || columnNames.includes(key) === false){
            console.log('\tWARNING: unrecognized key submitted:', key);
            continue; // skip this key
        }
        if(key === 'completed_at' || key === 'id') { // skip completed_at and id keys. that is handled by the db
            continue;
        }

        // if the column string is not empty, add a comma to columns and values
        if (columns !== ''){ 
            columns = columns + ", ";
            values = values + ", ";
        } // end if

        // add the key to the columns string
        columns = columns + key;
        // and "$valNum" to the values string, then iterate currentValue
        values = values + `$${valNum++}`;

        if(isNaN(Number(task[key]))){ // if the value of task[key] is not a number
            queryValues.push(task[key]); // add as a string
        } else { // if it is a number
            queryValues.push(Number(task[key])); // add as a number
        } // end if
    }
    // add id as the last val in values
    queryValues.push(Number(task.id));

    // if we've reached this point we should be good to build the query
    let queryText = `UPDATE tasks SET (${columns}) = (${values}) WHERE id=$${valNum};`;
    console.log('\tQUERY:', queryText);
    console.log('\tVALUES:', queryValues);

    // time to make the actual pg query
    pool.query(queryText, queryValues)
        .then((result) => { // successful query, respond with rows
            console.log("\tQUERY: Success! rowCount:", result.rowCount);
            res.sendStatus(202);
        })// end then
        .catch((error) => { // error caught, respond with error message
            console.log("\tQUERY: Failure:", error);
            res.status(500).send("Ouch, don't do that please!");
        });// end catch
}// end POST root

// __________ END ROUTER FUNCTIONS __________

module.exports = router;