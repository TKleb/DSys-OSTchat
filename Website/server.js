const path = require('path');
const { Pool } = require('pg')
const http = require('http');
const express = require('express');
const { Server } = require('socket.io')
const { addUserToList, getTypingUser, getAllUsersForRoom } = require("./utils/user-controller");
const { messageFormat, currentDate } = require("./utils/message-controller");

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
    socket.on('userJoin', ({ username, room }) => {
        client.query("SELECT * FROM add_user($1)", [username], (err, result) => {
            if (err) {
                console.log('Error executing query', err.stack)
            }
            if (result.rowCount === 1) {
                const userid = result.rows[0].user_id
                const user = addUserToList(userid, username, room);
                const roomName = room;
                socket.join(user.roomname);
                console.log('User joined:', user);
                io.to(user.roomname).emit('currentUsers',
                    {
                        room: user.roomname,
                        users: getAllUsersForRoom(user.roomname)
                    }
                )
            } else {
                console.log('Unexpected reply from database. User was expected.', result);
            }
        })

    })

    socket.on('userMessage', message => {
        const user = getTypingUser(socket.id);
        const currentTime = currentDate()
        client.query("INSERT INTO messages (username, text, sent) VALUES ($1, $2, $3)", [user.username, message, currentTime])
        io.to(user.roomname).emit('chatMessage', messageFormat(user.username, message))
    })
})