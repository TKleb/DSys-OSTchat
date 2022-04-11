const path = require('path');
const { Pool } = require('pg')
const http = require('http');
const express = require('express');
const { Server } = require('socket.io')
const {prepareUserForDatabase, addUserToList, getTypingUser, getAllUsersForRoom} = require("./utils/user-controller");
const {messageFormat, currentDate} = require("./utils/message-controller");

const PORT = 3030;
const HOSTNAME = '0.0.0.0'

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

const client = new Pool({
    user: "backend",
    host: "ostchat-database",
    database: "ostchat",
    password: "password",
    port: "5432"
})

io.on('connection', socket => {
    console.log("connection worked")
    socket.on('userJoin', ({username, room}) => {
        const user = addUserToList(socket.id, username, room);
        const userdb = prepareUserForDatabase(username);
        client.query("INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userdb[0], userdb[1]])
        const roomName = room;
        socket.join(user.roomname);

        io.to(user.roomname).emit('currentUsers', {
            room: user.roomname,
            users: getAllUsersForRoom(user.roomname)
        })
    })

    socket.on('userMessage', message => {
        const user = getTypingUser(socket.id);
        const currentTime = currentDate()
        client.query("INSERT INTO messages (username, text, sent) VALUES ($1, $2, $3)", [user.username, message, currentTime])
        io.to(user.roomname).emit('chatMessage', messageFormat(user.username, message))
    })
})