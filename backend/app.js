const express = require('express');
const app = express();

app.use(express.json());

//Routes
app.use('/', require('./routes/login'));

app.listen(4111, () => console.log("Server has started at port "))