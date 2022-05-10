const activeUsers = []

function addUserToList(id, username, roomname, socketid) {
    const user = { id, username, roomname, socketid };
    activeUsers.push(user);
    return user;
}

function removeUserFromList(username) {
    const index = activeUsers.findIndex(user => {
        return user.username === username
    });
    activeUsers.splice(index, 1);
}

// TODO: roomname -> roomid
function getAllUsersForRoom(room) {
    return activeUsers.filter(user => user.roomname === room)
}

function getTypingUser(id) {
    return activeUsers.find(user => user.socketid === id);
}

export {
    removeUserFromList,
    addUserToList,
    getTypingUser,
    getAllUsersForRoom
}
