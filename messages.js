const moment = require('moment');

//skapar objekt med info om användare samt chatmeddelande
function createMessageObject(message, userObject) {
    let messageObject = userObject;
    messageObject.message = message;
    messageObject.time = getTime();
    return messageObject;
}

//hämtar aktuell tid
function getTime() {
    return moment().format('dddd H:mm')
}

//sparar meddelanden
function saveMessages(messageArray, messageObject) {
    if (messageArray.length > 2) {
        messageArray.shift();
    }
    let messageToSave = {
        ...messageObject
    } //måste använda spread operator här annars ändras alla föregående
    messageArray.push(messageToSave);
}

module.exports = {createMessageObject, getTime, saveMessages}