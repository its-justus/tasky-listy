// using fancy import statements cause we are real backend programmers 
import pool from '../modules/pool';
import express from 'express';

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


// get root of /books returns all of the books in the table
function getRoot(req, res){
    
}// end GET root


// POST root of /books adds a book to the table
function postRoot(req, res){
    
}// end POST root

// PUT /books/:id updates the status of a book. the body must contain a status key with the 
// new status
function updateBook(req, res){
    
}// end POST root

// __________ END ROUTER FUNCTIONS __________

module.exports = router;