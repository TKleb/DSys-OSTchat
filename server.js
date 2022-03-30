const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io')
const {addUserToList, getTypingUser, getAllUsersForRoom} = require("./utils/user-controller");
const messageFormat = require("./utils/message-controller");

const PORT = 3030;
const HOSTNAME = '127.0.0.1'

const app = express();
const server = http.createServer(app).listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`)
});

const adminAccount = 'OST Admin'
const io = new Server(server)

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + "/public/login.html")
})

io.on('connection', socket => {
    console.log("connection worked")
    socket.on('userJoin', ({username, room}) => {
        const user = addUserToList(socket.id, username, room);
        const roomName = room;
        socket.join(user.roomname);

        io.to(user.roomname).emit('currentUsers', {
            room: user.roomname,
            users: getAllUsersForRoom(user.roomname)
        })
    })

    socket.on('userMessage', message => {
        const user = getTypingUser(socket.id);
        io.to(user.roomname).emit('chatMessage', messageFormat(user.username, message))
    })
})