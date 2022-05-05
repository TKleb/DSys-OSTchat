import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import http from 'http';
import express from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import {chatRoutes} from "./router/chat-routes.js";
import { addUserToList, getTypingUser, getAllUsersForRoom } from "./controller/user-controller.js";
import { messageFormat, currentDate } from "./controller/message-controller.js";

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
            if (!username){
                console.log('Error!');
                return;
            }
            client.query("SELECT * FROM add_user($1)", [username], (err, result) => {
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
                    const currentRoomElement = roomList.find(element => element.room_name === user.roomname)
                    const currentRoomId = currentRoomElement.id
                    client.query("SELECT * FROM get_messages($1)", [currentRoomId], (err, result) => {
                        if (err) {
                            console.log('Error executing query', err.stack);
                            return;
                        } else {
                            const previousMessages = result.rows;
                            previousMessages.forEach((msg) => {
                                // TODO: ensure only joining user receives these messages
                                io.to(user.roomname).emit('chatMessage', messageFormat(msg.sender_name, msg.content))
                            }) 
                        }
                    })
                } else {
                    console.log('Unexpected reply from database. User was expected.', result);
                }
            })
        })

        socket.on('userMessage', message => {
            console.log(socket.id)
            const user = getTypingUser(socket.id);
            const currentTime = currentDate()
            const currentRoomElement = roomList.find(element => element.room_name === user.roomname)
            const currentRoomId = currentRoomElement.id
            // fuck this shit room id hardcoded to be 1
            // todo dont do this shit
            client.query("SELECT * FROM post_message($1, $4, $2, $3)", [user.id, message, currentTime, currentRoomId])
            io.to(user.roomname).emit('chatMessage', messageFormat(user.username, message))
        })
    })
}
