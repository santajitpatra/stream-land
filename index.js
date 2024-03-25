import http from "http";
import express from "express";
import path from "path";
import { Server as socketIO } from "socket.io";
import { spawn} from "child_process";

const youtubeKey = ""


const app = express();
const server = http.createServer(app);
const io = new socketIO(server);


const options = [
  "-i",
  "-",
  "-c:v",
  "libx264",
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-r",
  `${25}`,
  "-g",
  `${25 * 2}`,
  "-keyint_min",
  25,
  "-crf",
  "25",
  "-pix_fmt",
  "yuv420p",
  "-sc_threshold",
  "0",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-ar",
  128000 / 4,
  "-f",
  "flv",
  `rtmp://a.rtmp.youtube.com/live2/${youtubeKey}`,
];

const ffmpegProcess = spawn("ffmpeg", options);

ffmpegProcess.stdout.on("data", (data) => {
  console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on("data", (data) => {
  console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on("close", (code) => {
  console.log(`ffmpeg process exited with code ${code}`);
});


app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on("binarystream", (data) => {
    console.log("Binary Stream Received", data);
    ffmpegProcess.stdin.write(data, (err) => {
        console.error("Error writing to ffmpeg stdin", err);
    });
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
