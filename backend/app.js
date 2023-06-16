const express = require('express');
const WebSocket = require('ws');
const url = require('url');
const app = express();
require('dotenv').config()
const {createTables, connectToDatabase} = require('./database');
const userRepository = require('./repository/userRepository');

const db = connectToDatabase();

createTables();

app.use(express.json());

// Routes
app.use('/', require('./routes/login'));

// Middleware
app.use((err, req, res) => {
    res.status(err.httpStatusCode);
    res.json({
        error: err.message,
        status: err.httpStatusCode
    });
});

const server = app.listen(process.env.PORT, () => console.log("Server has started at port 4111"))

// const wss = new WebSocket.Server({server: server, path: '/ws'});
const wss = new WebSocket.Server({noServer: true});

// WebSocket server runs on the same port as the express server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});

let wsClients = [];

wss.on('connection', (ws, req) => {
    const sessionKey = url.parse(req.url, true).query.session_key;

    userRepository.verifySessionKey(sessionKey)
        .then(() => {
            wsClients[sessionKey] = ws;
        })
        .catch(() => ws.close());

    // Handle the WebSocket `message` event. If any of the clients has a session key
    // that is no longer valid, send an error message and close the client's
    // connection.
    ws.on('message', (data) => {
        for (const [sessionKey, client] of Object.entries(wsClients)) {
            userRepository.verifySessionKey(sessionKey)
                .then(user => {
                    client.send("Hallo " + user.username + "!");
                    client.send(data);
                })
                .catch(() => {
                    client.send("Error: Your token is no longer valid. Please reauthenticate.");
                    client.close();
                });
        }
    });
});

module.exports = db;