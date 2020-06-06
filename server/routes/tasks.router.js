// using fancy import statements cause we are real backend programmers 
const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();

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
 * postTask handles POST /tasks/ routes. adds a new task to the database
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
    let currentKey = ''; // current key of task, used for error messages

    // keys in body are expected to match the column names in the tasks table
    try {
        for (let key in task){ // loop through each key in task
            currentKey = key; // set currentKey to key for error messaging
            
            if (!task[key]){ // if the value of task[key] is not truthy, skip this key 
                continue;
            } // end if

            if (columns !== ''){ // if the column string is not empty, add a comma to columns and values
                columns = columns + ", ";
                values = values + ", ";
            } // end if
            
            // add the key to the columns string
            columns = columns + key;
            // and "$valNum" to the values string, then iterate currentValue
            values = values + `$${valNum++}`;
            
            // add the actual value to the values array
            if(isNaN(Number(task[key]))){ // if the value of task[key] is not a number
                queryValues.push(task[key]); // add as a string
            } else { // if it is a number
                queryValues.push(Number(task[key])); // add as a number
            } // end if
        } // end for loop
    } // end try 
    catch (error) {
        res.status(400).send(`Error cause by key "${currentKey}":`, error);
        return null;
    } // end catch

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

// PUT /books/:id updates the status of a book. the body must contain a status key with the 
// new status
function updateTask(req, res){
    
}// end POST root

// __________ END ROUTER FUNCTIONS __________

module.exports = router;