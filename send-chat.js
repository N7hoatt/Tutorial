const name = prompt("What your name?");
const socket = io();
const chatForm = document.querySelector("#chat-form");
const chatMes = document.querySelector("#chat-message");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatMes.value;
  socket.emit("chat-sent", {
    name,
    message,
  });
  chatMes.value = "";
});

const messages = document.querySelector("#messages");
socket.on("user-chat", (message) => {
  const chatName = document.createElement("span");
  const chatMessage = document.createElement("span");
  chatName.setAttribute("class", "Username");
  chatMessage.setAttribute("class", "message");
  chatName.textContent = message.name;
  chatMessage.textContent = message.message;
  const hr = document.createElement("hr");
  messages.appendChild(chatName);
  messages.append(" : ");
  messages.appendChild(chatMessage);
  messages.append(hr);
});
