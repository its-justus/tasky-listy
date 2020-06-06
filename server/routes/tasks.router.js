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
 * @param res - the response object by which to send a reply to the client
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


// POST root of /books adds a book to the table
function postTask(req, res){
    
}// end POST root

// PUT /books/:id updates the status of a book. the body must contain a status key with the 
// new status
function updateTask(req, res){
    
}// end POST root

// __________ END ROUTER FUNCTIONS __________

module.exports = router;