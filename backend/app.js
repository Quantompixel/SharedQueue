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
app.use((err, req, res, next) => {
    res.status(err.httpStatusCode);
    res.json({
        error: err.message,
        status: err.httpStatusCode
    });
});

const server = app.listen(process.env.PORT, () => console.log("Server has started at " + process.env.PORT))

// const wss = new WebSocket.Server({server: server, path: '/ws'});
const wss = new WebSocket.Server({noServer: true});

// WebSocket server runs on the same port as the express server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});

let clients = [];

wss.on('connection', (ws, req) => {
    const sessionKey = url.parse(req.url, true).query.session_key;

    userRepository.verifySessionKey(sessionKey)
        .then(() => {
            console.log("Client " + sessionKey + " connected.");
            clients[sessionKey] = ws;
        })
        .catch(() => ws.close());

    // fires if client sends message, checks if session key is valid and responds
    ws.on('message', (data) => {
        for (const [sessionKey, client] of Object.entries(clients)) {
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

    // When a socket closes, or disconnects, remove it from the array.
    ws.on('close', () => {
        delete clients[sessionKey];
        console.log("Client " + sessionKey + " disconnected.");
    });
});

module.exports = db;