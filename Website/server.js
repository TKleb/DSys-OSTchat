import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import http from 'http';
import express from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import {chatRoutes} from "./router/chat-routes.js";
import { addUserToList, removeUserFromList, getTypingUser, getAllUsersForRoom } from "./controller/user-controller.js";
import { messageFormat } from "./controller/message-controller.js";

const PORT = 3030;
const HOSTNAME = '0.0.0.0'

const app = express();
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: "default",
    helpers: {
        section: function(name, options) { 
          if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this); 
            return null;
          }
      } 
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.resolve('views'));

const server = http.createServer(app).listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`)
});

const adminAccount = 'OST Admin'
const io = new Server(server)

app.use(express.static(path.resolve("public")));

app.use("/", chatRoutes);

const client = new Pool({
    user: "backend",
    host: "ostchat-database",
    database: "ostchat",
    password: "password",
    port: "5432"
})

let roomList = []
let allMessages = new Map();

function getRoomLists() {
    let roomList = client.query("SELECT * FROM get_rooms()", []);
    return roomList;
}

function getMessages(roomId) {
    return client.query("SELECT * FROM get_messages($1)", [roomId]);
}

function getMessagesAfter(roomId, messageId) {
    return client.query("SELECT * FROM get_messages_after($1, $2)", [roomId, messageId]);
}

function updateMessageMap() {
    const roomIds = [...allMessages.keys()];
    let promises = [];
    roomIds.forEach((roomId) => {
        const messagesOfRoom = allMessages.get(roomId);
        let newestMessage = -1;
        if (messagesOfRoom.length > 0) {
            newestMessage = messagesOfRoom[messagesOfRoom.length - 1].id;
        }
        promises.push(
            getMessagesAfter(roomId, newestMessage).then((result) => {
                const messages = result.rows;
                return { roomId, messages };
            }));
        })
    Promise.all(promises).then((result) => {
        result.forEach((entry) => {
            const roomId = entry.roomId;
            const messages = entry.messages;
            allMessages.set(roomId,
                allMessages.get(roomId).concat(messages));
        })
    })
}

getRoomLists().then((result) => {
    roomList = result.rows
    let promises = []
    roomList.forEach((room) => {
        const roomId = room.id;
        promises.push(
            getMessages(roomId).then((result) => {
                const messages = result.rows;
                return { roomId, messages };
            })
        )
    });
    Promise.all(promises).then((result) => {
        result.forEach((entry) => {
            const roomId = entry.roomId;
            const messages = entry.messages;
            allMessages.set(roomId, messages);
        })
        setInterval(() => updateMessageMap(), 500);
        socketFunction();
    });
})

function socketFunction() {
    io.on('connection', socket => {
        console.log("connection worked")
        socket.on('userJoin', ({ username, room }) => {
            if (!username){
                console.log('Error!');
                return;
            }
            client.query("SELECT * FROM get_or_add_user($1)", [username], (err, result) => {
                if (err) {
                    console.log('Error executing query:', err.stack)
                    return;
                }
                else if (result.rowCount === 1) {
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
                    const currentRoomElement = roomList.find(element => element.room_name === user.roomname);
                    const currentRoomId = currentRoomElement.id;
                    const currentRoomMessages = allMessages.get(currentRoomId);
                    currentRoomMessages.forEach((msg) => {
                        // TODO: ensure only joining user receives these messages
                        socket.emit('chatMessage', messageFormat(msg.sender_name, msg.content, msg.tmstmp))
                    })
                } else {
                    console.log('Unexpected reply from database. User was expected.', result);
                }
            })
        })

        socket.on('userLeave', ({ username, room }) => {
            try {
                removeUserFromList(username);
                socket.leave(room);
                socket.to(room).emit('user left', socket.id)
            } catch(e) {
                console.log("ERROR with LOGOUT", e)
                socket.emit('error', 'couldnt perform requested action')
            }
        })

        socket.on('userMessage', message => {
            const user = getTypingUser(socket.id);
            const currentTime = new Date();
            const currentRoomElement = roomList.find(element => element.room_name === user.roomname)
            const currentRoomId = currentRoomElement.id
            client.query("SELECT * FROM post_message($1, $2, $3)", [user.id, currentRoomId, message])
            io.to(user.roomname).emit('chatMessage', messageFormat(user.username, message, currentTime))
        })
    })
}
