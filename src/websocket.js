const socketio = require('socket.io');

const connections = [];

exports.setupWebSocket = (server) => {
    const io = socketio(server);

    io.on('connection', socket => {
        const {latitude, longitude, techs} = socket.handshake.query;
        const techArray = techs.split(`,`).map( tech => tech.trim());

        connections.push({
            id: socket.id,
            coordinates:{
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs:techArray
        })

        console.log(socket.id);
        console.log(socket.handshake.query);


     })

};