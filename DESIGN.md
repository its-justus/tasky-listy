# Design Doc

## Database
- db name = task_app
- Table "tasks"
    - id - int auto generated primary key
    - task - text required
    - created - date auto generated default now()
    - due - date optional
    - completed - date default null auto generated
    - deleted - bool auto generated default false
    - color - int optional
- Procedures [STRETCH]
    - mark_complete (id) - sets completed date of task(id) to now()
    - unmark_complete (id) - sets completed date of task(id) to null
    - mark_deleted (id) - sets deleted bool of task(id) to true


## Backend 
- server.js
    - static route for root
    - router for tasks (/tasks)
- tasks.js router
    - GET /
    - POST /
    - PUT /:id
    - DELETE /:id
    - pool from pool.js
    - validation [STRETCH]
- pool.js pgdb connection
    - pool connected to task_app db
    - max 10 connections


## Frontend
- index.html
    - implemented with boostrap [STRETCH]
    - head
        - jquery script
        - client.js script
        - bootstrap.css style [STRETCH]
    - body
        - title header
        - add task form id=formAddTask
            - text box id=task
            - date box id=due [STRETCH]
            - color dropdown id=color val=int [STRETCH] 
            - submit button id=buttonAddTask
        - task list id=taskList
            - task container data-task = task object
            - ordered by due [STRETCH]
            - ordered by created, complete tasks at bottom
            - completed checkbox class=checkboxTaskComplete
            - text task class=textTask
            - button delete class=buttonDeleteTask
            - task colored
- client.js
    - docSetup() called on doc.ready
        - sets up click handlers
        - refreshTasks()
    - addTask() [HANDLER=click] id=buttonAddTask
        - creates new task object from form data
        - ajax POST /tasks/
            - .then refreshTasks()
            - .catch alert err
    - deleteTask() [HANDLER=click] taskList child selector class=buttonDeleteTask
        - ajax DELETE /tasks/:id
    - editSetup() [HANDLER=dblclick] taskList child selector class=textTask [STRETCH]
        - replace textTask with text box class=textEditTask
        - add color box [STRETCH^2]
        - task container add class=editing
    - editTask() [HANDLER=focusout] taskList child selector class=editing [STRETCH]
        - new task object from task 
        - ajax PUT /tasks/:id
            - .then refreshTasks()
            - .catch alert err
    - refreshTasks()
        - ajax GET /tasks/
            - .then updates taskList with results
            - .catch alert err
    - toggleComplete() [HANDLER=change] taskList child selector class=checkboxTaskComplete
        - ajax PUT /tasks/:id
            - .then refreshTasks()
            - .catch alert err
