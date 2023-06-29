const express = require('express');
const WebSocket = require('ws');
const url = require('url');
const app = express();
const cors = require('cors');
require('dotenv').config()
const {createTables, connectToDatabase} = require('./database');
const userRepository = require('./repository/userRepository');
const {reorderRequest, getQueueRequest} = require('./controllers/reorderController');

const db = connectToDatabase();

createTables();

app.use(cors());

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

            // Store the sessionKey as a property on the WebSocket object
            ws.sessionKey = sessionKey;
        })
        .catch(() => ws.close());

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());

            if (!Object.keys(message).includes("command")) {
                throw new Error("wrong format");
            }

            const params = message["params"];

            /*
            {
                "command": "reorder",
                "params": {
                    "song": 10,
                    "reference": 11,
                    "before": false
                }
            }
             */
            if (message["command"] === "reorder") {
                let updatedQueue = reorderRequest(params.song, params.reference, params.before);

                const messageData = {
                    type: "response",
                    command: "reorder",
                    data: updatedQueue
                }

                ws.send(JSON.stringify(messageData));
            }
            if (message["command"] === "getQueue") {
                const messageData = {
                    type: "response",
                    command: "getQueue",
                    data: getQueueRequest()
                }
                ws.send(JSON.stringify(messageData));
            }
        } catch (err) {
            ws.send("Error: Commands have to be in the right JSON format.");
        }
    });

    ws.on('close', () => {
        delete clients[ws.sessionKey];
        console.log("Client " + ws.sessionKey + " disconnected.");
    });
});

module.exports = db;