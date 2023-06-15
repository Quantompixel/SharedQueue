const express = require('express');
const app = express();
const { createTables, connectToDatabase } = require('./database');

const db = connectToDatabase();

createTables();

app.use(express.json());

// Routes
app.use('/', require('./routes/login'));

// Middleware
app.use((err, req, res, next) => {
    res.status(err.httpStatusCode);
    res.json({
        error: err.message,
        status: err.httpStatusCode
    });
});

app.listen(4111, () => console.log("Server has started at port 4111"))

module.exports = db;