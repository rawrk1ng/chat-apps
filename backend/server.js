const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const auth = require('./src/auth');
const files = require('./src/files');
const settings = require('./src/settings');
const voice = require('./src/voice');
const { initDB } = require('./src/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

initDB();

app.use('/auth', auth);
app.use('/files', files);
app.use('/settings', settings);

io.on('connection', (socket) => {
    socket.on('message', (msg) => io.emit('message', msg));
});

voice(io);

server.listen(3000, () => console.log("SERVER STARTED"));