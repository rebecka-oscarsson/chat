const socket = io();
const form = document.querySelector("form");
const chat = document.querySelector("ul");
const input = document.querySelector("input");

function generateUsername()
{let color = prompt("what is the color of your toothbrush?");
let veggie = prompt("what is your favourite vegetable?");
if (!veggie) {veggie = "turnip"}
if (!color) {color = "anonymous"}
let name = color.charAt(0).toUpperCase() + color.slice(1) + veggie.charAt(0).toUpperCase() + veggie.slice(1);
console.log(name)
socket.emit("namn", name)
}

generateUsername();

//generell funktion som hämtar data och kör en callbackfunktion med datan som parameter
// function getData(url, callbackFunction) {
//   fetch(url)
//       .then(response => response.json())
//       .then(data => {
//           if (callbackFunction) {
//               callbackFunction(data)
//           }
//       })
//       .catch(function(err) {
//           console.log('Något gick fel', err);
//       });
// }

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("meddelande",
      input.value
    )
  } //skickar meddelandet till servern
  input.value = ""; //tömmer input
});

socket.on("meddelande", (object) => { //tar emot från servern
  console.log(object)
  const li = document.createElement("li");
  li.innerHTML = `<strong>${object.user}:</strong><br>${object.msg}`;
  li.style.backgroundColor = object.farg;
  chat.prepend(li)
})

socket.on("uppkopplad", (object) => { //tar emot från servern
  console.log(object)
  const li = document.createElement("li");
  li.textContent = object.anvandare + " has entered " + object.tid;
  li.classList.add("connectMsg");
  chat.prepend(li)
})

socket.on("nedkopplad", (object) => { //tar emot från servern
  console.log(object)
  const li = document.createElement("li");
  li.textContent = object.anvandare + " is out of here";
  li.classList.add("disconnectMsg");
  chat.prepend(li)
})