$('document').ready(() => {
    
    // click handlers
    $('#modalAddTaskSubmit').on('click', addTask);
})


/**
 * addTask creates a task object from form data and sends an ajax
 * request to the server. it then reloads the task lists
 * 
 * @param params
 * @returns returns
 */
function