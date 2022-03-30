const activeUsers = []

function addUserToList(id, username, roomname) {
    const user = {id, username, roomname};
    activeUsers.push(user);
    return user;
}

function getAllUsersForRoom(room) {
    return activeUsers.filter(user => user.roomname === room)
}

function getTypingUser(id) {
    return activeUsers.find(user => user.id === id);
}

module.exports = {
    addUserToList,
    getTypingUser,
    getAllUsersForRoom
}