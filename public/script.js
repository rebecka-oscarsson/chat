const socket = io();
const form = document.querySelector("form");
const chat = document.querySelector(".chat");
const input = document.querySelector("input");
const userList = document.querySelector(".userList");

function sendUserName() {
  let userParams = new URLSearchParams(window.location.search);
  let color = userParams.getAll("color").toString();
  let food = userParams.getAll("food").toString();
  if (!food) {
    food = "turnip"
  }
  if (!color) {
    color = "anonymous"
  }
  let name = color.charAt(0).toUpperCase() + color.slice(1) + food.charAt(0).toUpperCase() + food.slice(1);
  socket.emit("connected", name)
}

sendUserName(); //körs när man kommer in i chatten, då skickas namnet till backend

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chatMessage",
      input.value
    )
  } //skickar meddelandet till servern
  input.value = ""; //tömmer input
});

socket.on("error", () => {
    window.location.replace(window.location.href);
})

socket.on("formatedMessage", (messageObject) => {
  // if (messageObject.time == "3021 AD") {
  //   window.location.replace(window.location.href);
  //   (printMessage(messageObject));
  // } else {
    printMessage(messageObject);
  // }
  chat.scrollTop = chat.scrollHeight - chat.clientHeight;
})

function printMessage(messageObject) {
  const li = document.createElement("li");
  const timeElement = document.createElement("div");
  const nameElement = document.createElement("div");
  timeElement.textContent = messageObject.time;
  timeElement.classList.add("time");
  nameElement.classList.add("name");
  nameElement.textContent = messageObject.userName + " says: ";
  const msg = document.createTextNode(messageObject.message);
  li.append(nameElement, msg, timeElement);
  li.style.backgroundColor = messageObject.userColor;
  chat.appendChild(li);
}

socket.on("userConnected", (messageInfo) => { //tar emot från servern
  const li = document.createElement("li");
  li.textContent = messageInfo.userName + " has arrived, " + messageInfo.time;
  li.classList.add("connectMsg");
  chat.appendChild(li);
})

socket.on("userDisconnected", (logoutObject) => { //tar emot från servern
  const li = document.createElement("li");
  li.textContent = logoutObject.userName + " is out of here, " + logoutObject.time;
  li.classList.add("disconnectMsg");
  chat.appendChild(li);
})

socket.on("userList", (users) => {
  userList.innerHTML = "";
  const heading = document.createElement("li");
  heading.textContent = "Who is here?";
  heading.id = "usersHeading"
  userList.appendChild(heading);
  for (user in users) {
    const li = document.createElement("li");
    li.classList.add("hidden")
    li.classList.add("userNames")
    const userName = document.createTextNode(users[user].userName);
    li.appendChild(userName);
    userList.appendChild(li);
  }
  userList.addEventListener("click", (e) => {
    e.preventDefault;
    toggleUsers()
  })
})

function toggleUsers() {
  let users = document.querySelectorAll(".userNames");
  for (let index = 0; index < users.length; index++) {
    users[index].classList.toggle("hidden")
  };
}