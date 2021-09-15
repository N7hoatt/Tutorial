const express = require("express");
const app = express();

const http = require("http");
const sever = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(sever);

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat-sent", (data) => {
    io.emit("user-chat", data);
  });
});

sever.listen(4000, () => {
  console.log("sever listen 4000");
});
