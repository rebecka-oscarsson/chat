const socket = io();
const form = document.querySelector("form");
const chat = document.querySelector(".chat");
const input = document.querySelector("input");
const userList = document.querySelector(".userList");

function sendUserName() {
  let userParams = new URLSearchParams(window.location.search);
  let color = userParams.getAll("color").toString();
  let vegetable = userParams.getAll("vegetable").toString();
  if (!vegetable) {
    vegetable = "turnip"
  }
  if (!color) {
    color = "anonymous"
  }
  let name = color.charAt(0).toUpperCase() + color.slice(1) + vegetable.charAt(0).toUpperCase() + vegetable.slice(1);
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

socket.on("formatedMessage", (messageObject) => { //tar emot från servern
  const nameElement = document.createElement("div")
  nameElement.classList.add("name");
  nameElement.textContent = messageObject.userName + " says: ";
  const li = document.createElement("li");
  const msg = document.createTextNode(messageObject.message);
  li.append(nameElement, msg);
  li.style.backgroundColor = messageObject.userColor;
  chat.appendChild(li)
  chat.scrollTop = chat.scrollHeight - chat.clientHeight;
})

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
  userList.addEventListener("click", (e)=> {e.preventDefault; toggleUsers()})
})



function toggleUsers() {
  let users = document.querySelectorAll(".userNames");
  console.log(users)
  for (let index = 0; index < users.length; index++) {
    users[index].classList.toggle("hidden")
  };
}