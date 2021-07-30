function createMessageObject(message, userObject) {
    {let messageObject = userObject;
    messageObject.message = message;
    messageObject.time = getTime();
    return messageObject}
}

function getTime() {
    var myDate = new Date();
    var myDay = myDate.getDay();
    var weekday = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var myTime = weekday[myDay] + " " + hours + ":" + minutes;
    return myTime
}

module.exports = {createMessageObject, getTime}