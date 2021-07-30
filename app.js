var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { createMessageObject, getTime } = require('./messages')
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

io.on("connection", (socket) => {
    socket.on("connected", (enteredName) => {
        let userObject = createUserObject(enteredName, socket.id);
        app.locals.users.push(userObject);
        io.emit("userConnected", {
            userName: userObject.userName, time: getTime()
        });
        socket.emit("userList", app.locals.users);
        console.log(userObject.userName + " ansluten " + getTime());
    })
    
    socket.on("disconnect", () => {  
        let userObject = app.locals.users.find(userObject => userObject.userId === socket.id);
        io.emit("userDisconnected", {
            userName: userObject.userName, time: getTime()
        });
        app.locals.users.pop(userObject);
        console.log(userObject.userName + " frånkopplad " + getTime());
    })

    socket.on("chatMessage", (message) => {
        let userObject = app.locals.users.find(userObject => userObject.userId === socket.id)
        let messageObject = createMessageObject(message, userObject);
        console.log(messageObject.userName + " skrev: " + messageObject.message)
        io.emit("formatedMessage", messageObject //skickar tillbaka till frontenden
        );
    })
})

module.exports = {
    app: app,
    server: server
} //exportera både app och server!