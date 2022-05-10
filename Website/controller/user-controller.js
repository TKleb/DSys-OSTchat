const activeUsers = []

function addUserToList(id, username, room_name, socketid) {
    const user = { id, username, room_name, socketid };
    activeUsers.push(user);
    return user;
}

function removeUserFromList(username) {
    const index = activeUsers.findIndex(user => {
        return user.username === username
    });
    activeUsers.splice(index, 1);
}

// TODO: room_name -> roomid
function getAllUsersForRoom(room) {
    return activeUsers.filter(user => user.room_name === room)
}

function getTypingUser(id) {
    return activeUsers.find(user => user.socketid === id);
}

export {
    activeUsers,
    removeUserFromList,
    addUserToList,
    getTypingUser,
    getAllUsersForRoom
}
