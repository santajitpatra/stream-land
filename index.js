import http from "http";
import express from "express";
import path from "path";
import { Server as socketIO } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new socketIO(server);

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on("binarystream", (data) => {
    console.log("Binary Stream Received", data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
