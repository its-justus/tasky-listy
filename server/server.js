// import modules
const express = require('express');
const bodyParser = require('body-parser');

//import routers
const tasks = require('./routes/tasks.router');

// express setup
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

// __________ ROUTING __________
// root
app.use(express.static('server/public'));

// tasks router
app.use('/tasks', tasks);

// __________ END ROUTING __________

// start listening on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("SERVER: Listening on port", PORT);
})
