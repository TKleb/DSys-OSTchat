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

let roomList = []

function getRoomLists() {
    let roomList = client.query("SELECT * FROM get_rooms()", [])
    return roomList
}

getRoomLists().then((result) => {
    roomList = result.rows
    socketFunction()
})

function socketFunction() {
    io.on('connection', socket => {
        console.log("connection worked")
        socket.on('userJoin', ({ username, room }) => {
            console.log(roomList);
            client.query("SELECT * FROM add_user($1)", [username], (err, result) => {
                if (err) {
                    console.log('Error executing query', err.stack)
                }
                if (result.rowCount === 1) {
                    const userid = result.rows[0].id
                    const user = addUserToList(userid, username, room, socket.id);
                    socket.join(user.roomname);
                    console.log('User joined:', user);
                    io.to(user.roomname).emit('currentUsers',
                        {
                            room: user.roomname,
                            users: getAllUsersForRoom(user.roomname)
                        }
                    )
                    client.query("SELECT * FROM get_messages(1)", [], (err, result) => {
                        if (err) {
                            console.log('Error executing query', err.stack)
                        } else {
                            const previousMessages = result.rows;
                            for (msg of previousMessages) {
                                // TODO: ensure only joining user receives these messages
                                io.to(user.roomname).emit('chatMessage', messageFormat(msg.sender_name, msg.content))
                            }
                        }
                    })
                } else {
                    console.log('Unexpected reply from database. User was expected.', result);
                }
            })
        })

        socket.on('userMessage', message => {
            const user = getTypingUser(socket.id);
            const currentTime = currentDate()
            // fuck this shit room id hardcoded to be 1
            // todo dont do this shit
            client.query("SELECT * FROM post_message($1, 1, $2, $3)", [user.id, message, currentTime])
            io.to(user.roomname).emit('chatMessage', messageFormat(user.username, message))
        })
    })
}