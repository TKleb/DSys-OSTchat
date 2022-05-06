function currentDate() {
    const now = new Date();
    let minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return (now.getHours() + (2)) + ":" + minutes;
}

function messageFormat(username, text) {
    return {
        username,
        text,
        time: currentDate()
    }
}

export {
    messageFormat,
    currentDate
};