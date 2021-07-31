var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {
    createMessageObject,
    getTime,
    saveMessages
} = require('./messages')

const createUserObject = require('./users');

var indexRouter = require('./routes/index');

var app = express();
const server = require("http").Server(app); //ändrat i express-template här
const io = require("socket.io")(server); //och här

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
//en middleware på servern som ska logga allt som sker i mina sockets

app.locals.users = [];
app.locals.messages = [];

function handleError(socket) {
    console.log("crasch bang boom");
    messageObject = {
        userName: "MrSmith",
        userColor: "lightgreen",
        userId: "smith",
        message: "The chat had to be reloaded due to a glitch in the Matrix",
        time: "3021 AD"
    };
    saveMessages(app.locals.messages, messageObject);
    socket.emit("error");
}

io.on("connection", (socket) => {
    socket.on("connected", (enteredName) => {
        let userObject = createUserObject(enteredName, socket.id);
        app.locals.users.push(userObject);
        if (app.locals.messages) {
            for (let index = 0; index < app.locals.messages.length; index++) {
                socket.emit("formatedMessage", app.locals.messages[index] //skickar gamla meddelanden till den nyss anslutna
                );
            }
        }
        io.emit("userConnected", {
            userName: userObject.userName,
            time: getTime()
        });
        io.emit("userList", app.locals.users);
        console.log(userObject.userName + " ansluten " + getTime());
    })

    socket.on("disconnect", () => {
        let userObject = app.locals.users.find(userObject => userObject.userId === socket.id);
        if (userObject) { //för att undvika krasch om userObject inte går att hämta
            let index = app.locals.users.indexOf(userObject);
            io.emit("userDisconnected", {
                userName: userObject.userName,
                time: getTime()
            });
            app.locals.users.splice(index, 1);
            io.emit("userList", app.locals.users);
            console.log(userObject.userName + " frånkopplad " + getTime());
        }
        else {
            socket.emit("error");
        }
    })

    socket.on("chatMessage", (message) => {
        let userObject = app.locals.users.find(userObject => userObject.userId === socket.id);
        if (userObject) { //för att undvika krasch om userObject inte går att hämta
            let messageObject = createMessageObject(message, userObject);
            console.log(messageObject.userName + " skrev: " + messageObject.message);
            saveMessages(app.locals.messages, messageObject) //sparar senaste två meddelanden för att visa vid inlogg
            io.emit("formatedMessage", messageObject //skickar tillbaka till frontenden
            );
        }
        else {
            handleError(socket);
        } 
    })
})

module.exports = {
    app: app,
    server: server
} //exportera både app och server!