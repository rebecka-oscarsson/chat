//express template

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
const server = require("http").Server(app); //ändrat i express-template här
const io = require("socket.io")(server); //och här
//en middleware på servern som ska logga allt som sker i mina sockets

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

//importer
const {
    createMessageObject,
    getTime,
    saveMessages
} = require('./messages')

const createUserObject = require('./users');

//variabler
app.locals.users = [];
app.locals.messages = [];
const disconnectMsgs = [" is out of here, ", " has left the building, ", " spontaneously combusted, "];
const connectMsgs = [" materialized, ", " entered the stage, ", " waltzed in, ", " appeared, "];

//vid connect skickas ett meddelande till frontend och användare läggs till i listan
io.on("connection", (socket) => {
    socket.on("connected", (enteredName) => {
        let userObject = createUserObject(enteredName, socket.id);
        app.locals.users.push(userObject);
        if (app.locals.messages) {
            for (let index = 0; index < app.locals.messages.length; index++) {
                socket.emit("displayMessage", app.locals.messages[index] //skickar gamla meddelanden till den nyss anslutna
                );
            }
        }
        let connectInfo = {
            userName: userObject.userName,
            time: getTime(),
            connected: true,
            message: connectMsgs[Math.floor(Math.random() * connectMsgs.length)]
        }
        io.emit("displayMessage", connectInfo);
        saveMessages(app.locals.messages, connectInfo); //sparar anslutningsmeddelande
        io.emit("userList", app.locals.users); //skickar lista på anslutna användare
        console.log(userObject.userName + " ansluten " + getTime());
    })

    //vid disconnect skickas ett meddelande till frontend och användare tas bort ur listan
    socket.on("disconnect", () => {
        let userObject = app.locals.users.find(userObject => userObject.userId === socket.id);
        if (userObject) { //för att undvika krasch om userObject inte går att hämta
            let index = app.locals.users.indexOf(userObject);
            let disconnectInfo = {
                userName: userObject.userName,
                time: getTime(),
                connected: false,
                message: disconnectMsgs[Math.floor(Math.random() * disconnectMsgs.length)]
            }
            io.emit("displayMessage", disconnectInfo);
            saveMessages(app.locals.messages, disconnectInfo);
            app.locals.users.splice(index, 1); //tar bort användare
            io.emit("userList", app.locals.users); //skickar lista på anslutna användare
            console.log(userObject.userName + " frånkopplad " + getTime());
        }
        else {
            console.log("fel vid utloggning");
            socket.emit("error", false); //false innebär visa ej felmeddelande
        }
    })

    //när chatmeddelande kommer från en användare
    socket.on("messageSent", (message) => {
        let userObject = app.locals.users.find(userObject => userObject.userId === socket.id); //hitta användaren som skickat
        if (userObject) { //för att undvika krasch om userObject inte går att hämta
            let messageObject = createMessageObject(message, userObject);
            console.log(messageObject.userName + " skrev: " + messageObject.message);
            saveMessages(app.locals.messages, messageObject) //sparar senaste två meddelanden för att visa vid inlogg
            io.emit("displayMessage", messageObject //skickar tillbaka till frontenden
            );
        }
        else {
            console.log("fel vid chattmeddelande");
            socket.emit("error", true); //true innebär att felmeddelande ska visas
        } 
    })
})

module.exports = {
    app: app,
    server: server
} //exportera både app och server!