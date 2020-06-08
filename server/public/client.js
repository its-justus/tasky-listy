// taskTemplate is a template div used to add new tasks to the various lists
// task rows are created with jQuery on this string and then modified with further jQuery functions
const taskTemplate = `
<div class="row task-row">
    <span class="col-12 py-2 px-3 border d-flex flex-row justify-content-between align-items-center">
        <input type="checkbox" class="task-complete d-inline-flex"/>
        <span class="p task-text d-inline-flex"></span>
        <button type="button" class="task-delete btn btn-outline-danger d-inline-flex">X</button>
    </span>
</div>`;

$('document').ready(() => {
    // get and populate task lists
    refreshTasks();

    // click handlers
    $('#modalAddTaskSubmit').on('click', addTask);
    $('.task-list').on('click', '.task-delete', deleteTask);
    $('.task-list').on('click', '.task-complete', toggleComplete);
})


/**
 * addTask creates a task object from form data and sends an ajax
 * request to the server. it then reloads the task lists
 * 
 * @param event - the event that called this function. not used
 * @returns null
 */
function addTask(event){
    console.log("In addTask");

    // create task object
    let task = {
        task: $('#task').val(),
        due: $('#due').val()
    }
    console.log(task);

    // alert the user if they haven't entered a task yet and exit this function
    if(task.task === ""){
        $('#alertAddTask').removeClass('d-none');
        setTimeout(() => {
            $('#alertAddTask').addClass('d-none');
        }, 3500);
        return null;
    }

    // send ajax request to POST /tasks/
    $.ajax({
        method: 'POST',
        url: '/tasks/',
        data: task,
        }).then((response) => {
            // POST successful, refresh the task lists
            console.log('SUCCESS POST route: /tasks/', response);
            refreshTasks();
        }).catch((response) => {
            // error, notify the user
            alert('Request failed. Try again later.');
        }
    );
}

/**
 * deleteTask sends an ajax DELETE request to the server,
 * then updates the task lists if successful
 * 
 * @param event - event that triggered the function call, used to determine which task to delete
 * @returns null
 */
function deleteTask(event) {
    // get task, which is stored in the data-task of the task-row
    let task = $(event.target).closest('.task-row').data('task');
    console.log(task);

    // make an ajax request to DELETE /tasks/:id
    $.ajax({
        method: 'DELETE',
        url: `/tasks/${task.id}`,
        }).then((response) => { // DELETE successful.
            console.log(`SUCCESS DELETE route: /tasks/${task.id}`);
            // refresh the task lists
            refreshTasks();
        }).catch((response) => {
            // error, notify the user
            alert('Request failed. Try again later.');
        }
    );
}


function toggleComplete(event) {
    // get task from event task-row parent
    let task = $(event.target).closest('.task-row').data('task');
    console.log(task);

    // toggle task.complete
    task.complete = !task.complete;

    // send the ajax PUT request
    $.ajax({
        method: 'PUT',
        url: `/tasks/${task.id}`,
        data: task,
        }).then((response) => {
            console.log('SUCCESS PUT route: /tasks/${task.id}', response);
            refreshTasks();
        }).catch((response) => {
            // error, notify the user:,
            alert('Request failed. Try again later.');
        }
    );
}


/**
 * refreshTasks submits an ajax request to GET /tasks/ and then
 * populates the task lists with the response.
 * 
 * @returns null
 */
function refreshTasks() {

    $.ajax({
        method: 'GET',
        url: '/tasks/',
        }).then((response) => {
            console.log('SUCCESS GET route: /path', response);
            // clear all existing tasks
            $('.task-row').remove();

            // loop through all tasks in response
            for(let task of response){
                // create the task element from the template string
                let taskRow = $(taskTemplate);
                // set the task text to the task data
                taskRow.find('.task-text').append(task.task);
                // store the raw task object in the element data
                taskRow.data('task', task);

                // set attributes of the task row depending on if the task is complete
                if(task.complete === false){
                    // append to currentTasks list
                    $('#currentTasks').append(taskRow);
                } else {
                    // set the checkbox to checked
                    taskRow.find('.task-complete').prop('checked', true);
                    // append to completedTasks list
                    $('#completedTasks').append(taskRow);
                }
            }
        }).catch((response) => {
            // error, notify the user:,
            alert('Request failed. Try again later.');
        }
    );
}