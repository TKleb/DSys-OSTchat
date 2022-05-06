const messageForm = document.getElementById('chat-form');
const roomList = document.getElementById('room-name');
const currentUser = document.getElementById('currentUser');
const userList = document.getElementById('users');
const chatMessages = document.querySelector('.message-display');

function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]).replace('+',' ');
        }
    }
    console.log('Query variable %s not found', variable);
}

const username = getQueryVariable("username");
const room = getQueryVariable("chatroom-selection")

// Socket Stuff
let socket = io();

socket.emit('userJoin', { username, room });

socket.on('chatMessage', (message) => {
    console.log(message)
    displayMessage(message)

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('currentUsers', ({ room, users }) => {
    displayActiveInfo(room, users);
})

// UI Stuff
function displayRoomName(room) {
    roomList.innerText = room;
}


function displayActiveInfo(room, users) {
    roomList.innerText = room;
    currentUser.innerText = username
    userList.innerHTML = '';
    users.forEach((user) => {
        const listElement = document.createElement('li');
        listElement.innerText = user.username;
        userList.appendChild(listElement);
    })
}

function displayMessage(message) {
    let senderUsername = message.username;
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    if (senderUsername === username) {
        messageContainer.classList.add('right')
    } else {
        messageContainer.classList.add('left')
    }
    const messageInfo = document.createElement('p')
    messageInfo.classList.add('message-info');
    messageInfo.innerText = senderUsername;
    messageInfo.innerHTML += `: <span>${message.time}</span>`;
    messageContainer.appendChild(messageInfo);
    const messageText = document.createElement('p');
    messageText.classList.add('text');
    messageText.innerText = message.text;
    messageContainer.appendChild(messageText);
    document.querySelector('.message-display').appendChild(messageContainer)
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let message = e.target.elements.message.value;

    socket.emit('userMessage', message);

    e.target.elements.message.value = '';
    e.target.elements.message.focus();
})
