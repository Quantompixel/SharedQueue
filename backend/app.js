const express = require('express');
const app = express();
const { createTables, connectToDatabase } = require('./database');

const db = connectToDatabase();

createTables();

app.use(express.json());

//Routes
app.use('/', require('./routes/login'));

app.listen(4111, () => console.log("Server has started at port 4111"))

module.exports = db;