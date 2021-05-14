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

function randomVal(min, max) { //ger slumpsiffror till färggenerering
    return Math.floor(Math.random() * (max - min) + 1) + min;
}

function getTime() {
    var myDate = new Date();
    var myDay = myDate.getDay();

    // Array of days.
    var weekday = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    // get hour value.
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var myTime = weekday[myDay] + " " + hours + " : " + minutes;
    return myTime
}

//en middleware på servern som ska logga allt som sker i mina sockets
io.on("connection", function (socket) {
    const randomColor = 'hsl(' + randomVal(0, 360) + ', ' + randomVal(60, 80) + '%,  ' + randomVal(70, 90) + '%)';
    //hue mellan 0-360, saturation 0-100, lightness 0-100

    let username = "AnonymousTurnip";

    socket.on("namn", (name) => {
        console.log(name)
        if(name!=null)
        {username = name};
        io.emit("uppkopplad", {
            anvandare: username,
            tid: getTime()
        });
    })



    console.log("användare uppkopplad!");
    socket.on("disconnect", () => {
        console.log("användare nedkopplad");
        io.emit("nedkopplad", {
            anvandare: username
        });
    })
    socket.on("meddelande", (msg) => {
        io.emit("meddelande", {
            msg,
            farg: randomColor,
            user: username
        });
        //skickar tillbaka till frontenden
    })
})

module.exports = {
    app: app,
    server: server
} //exportera både app och server!