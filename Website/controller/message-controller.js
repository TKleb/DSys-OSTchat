function dateConversion(isoTime) {
    const date = new Date(isoTime);
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return date.getHours() + ":" + minutes;
}

function messageFormat(username, text, isoTime) {
    return {
        username,
        text,
        time: dateConversion(isoTime)
    }
}

export {
    messageFormat
};
