const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const {setupWebSocket} = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

const db = "mongodb+srv://lineup:lineup4321@cluster0-qfiut.gcp.mongodb.net/week10?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;

mongoose.connect(db,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

//process.on('unhandledRejection', up => { throw up })
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(8080);
