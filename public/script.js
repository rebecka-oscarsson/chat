//importer
import {
  printMessage,
  printConnectionMessage,
  printErrorMessage
} from './messages.mjs';
import {
  sendUserName,
  printUserList
} from './users.mjs';

//variabler
const socket = io();
const form = document.querySelector("form");
const chat = document.querySelector(".chat");
const input = document.querySelector("input");

//körs när sidan laddas
sendUserName(socket);
printErrorMessage();

//skickar chatmeddelande till backend
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("messageSent", input.value)
  }
  input.value = "";
});

//vid fel i backend sparas info om felmeddelande i sessionStorage och sidan laddas om
socket.on("error", (errorMessage) => {
  sessionStorage.setItem("error", errorMessage);
  window.location.replace(window.location.href);
})

//skriver ut två typer av meddelanden
socket.on("displayMessage", (messageObject) => {
  if (messageObject.userId) {
    printMessage(messageObject);
  } else {
    printConnectionMessage(messageObject)
  }
  chat.scrollTop = chat.scrollHeight - chat.clientHeight;
})

//skriver ut listan på anslutna användare
socket.on("userList", (users) => {
  printUserList(users)
})