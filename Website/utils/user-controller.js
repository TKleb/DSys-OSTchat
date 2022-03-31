const activeUsers = []

function hashCode(nameToHash) {
    let hash = 0
    for (let i = 0, h = 0; i < nameToHash.length; i++)
        hash = Math.imul(31, h) + nameToHash.charCodeAt(i) | 0;
    return hash;
}

function prepareUserForDatabase(username) {
    const id = hashCode(username);
    return [id, username]
}

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
    prepareUserForDatabase,
    addUserToList,
    getTypingUser,
    getAllUsersForRoom
}