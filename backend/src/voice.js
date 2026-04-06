module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('voice-signal', (data) => {
            socket.broadcast.emit('voice-signal', data);
        });
    });
};