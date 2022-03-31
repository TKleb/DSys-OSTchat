
function currentDate() {
    const now = new Date();
    let minutes = now.getMinutes();
    if ( minutes < 10) {
        minutes = "0" + minutes;
    }
    return now.getHours() + ":" + minutes;
}
function messageFormat(username, text) {
    return {
        username,
        text,
        time: currentDate()
    }
}

module.exports = {
    messageFormat,
    currentDate
};