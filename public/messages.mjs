//variabler
const chat = document.querySelector(".chat");
const errorObject = {
    userName: "MrSmith",
    userColor: "lightgreen",
    userId: "smith",
    message: "The chat reloaded due to a glitch in the Matrix",
    time: "2199 AD"
  };

//lägger till chat-meddelanden i DOMen
export function printMessage(messageObject) { 
    const li = document.createElement("li");
    li.id = messageObject.userId;
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

//lägger till anslutnings-meddelanden i DOMen
export function printConnectionMessage(info) {
    const li = document.createElement("li");
    if (info.connected) {
      li.classList.add("connectMsg");
    } else {
      li.classList.add("disconnectMsg");
    }
    li.textContent = info.userName + info.message + info.time;
    chat.appendChild(li);
}

//kollar om det finns felmeddelande sparat i sessionstorage och skriver ut
export function printErrorMessage() {
    let errorMessage = sessionStorage.getItem("error");
    if (errorMessage) //om det blivit fel och ett meddelande ska visas
    {
      sessionStorage.removeItem("error");
      printMessage(errorObject);
    } else //om det blivit fel utan meddelande eller om det ej blivit fel
    {
      sessionStorage.removeItem("error");
    }
  }