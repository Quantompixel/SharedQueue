const express = require('express');
const ws = require('ws');
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

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => console.log(message));
});

const server = app.listen(4111, () => console.log("Server has started at port 4111"))

// WebSocket server runs on the same port as the express server
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});

module.exports = db;