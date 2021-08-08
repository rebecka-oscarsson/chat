//variabler
const userList = document.querySelector(".userList");

//hämtar användarnamn från url-parametrar, skickar till backend
export function sendUserName(socket) {
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

//döljer och visar listan i mobilläget
export function toggleUsers() {
  let users = document.querySelectorAll(".userNames");
  for (let index = 0; index < users.length; index++) {
    users[index].classList.toggle("hidden")
  };
}

export function printUserList(users) {userList.innerHTML = "";
const heading = document.createElement("li");
heading.textContent = "Who is here?";
heading.id = "usersHeading"
userList.appendChild(heading);
for (let user in users) {
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
})}