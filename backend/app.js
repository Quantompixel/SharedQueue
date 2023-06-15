const express = require('express');
const app = express();
const { connectToDatabase } = require('./database');

const db = connectToDatabase();

app.use(express.json());

//Routes
app.use('/', require('./routes/login'));

app.listen(4111, () => console.log("Server has started at port 4111"))

module.exports = db;