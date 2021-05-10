var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = require("http").Server(app); //ändrat här
const io = require("socket.io")(server); //och här

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);




//en middleware på servern som ska logga allt som sker i mina sockets
io.on("connection", function (socket) {
    function randomVal(min, max) {
        return Math.floor(Math.random() * (max - min) + 1) + min;
    }
    var randomColor = 'hsl(' + randomVal(0, 360) + ', ' + randomVal(50, 100) + '%,  ' + randomVal(70, 100) + '%)';
    //hue mellan 0-360, saturation 0-100, lightness 0-100

    console.log("användare uppkopplad!");
    socket.on("disconnect", () => {
        console.log("användare avkopplad")
    })
    socket.on("meddelande", (msg) => {
        console.log(randomColor);
        io.emit("meddelande", {msg, farg: randomColor});
        //skickar tillbaka till frontenden
    })
})

module.exports = {
    app: app,
    server: server
} //exportera både app och server!