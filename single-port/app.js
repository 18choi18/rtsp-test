const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const rtsp = require("rtsp-ffmpeg");

const cams = [
  "rtsp://210.99.70.120:1935/live/cctv001.stream",
  "rtsp://210.99.70.120:1935/live/cctv002.stream",
];
const streams = cams.map((uri) => {
  return new rtsp.FFMpeg({
    input: uri,
    arguments: ["-rtsp_transport", "tcp"],
    resolution: "400x300", // fit to the cctv
    rate: 5, // default 10
    quality: 2, // default 3
  });
});

// "/cam" + i namespace
streams.forEach((stream, i) => {
  const ns = io.of("/cam" + i);
  ns.on("connection", (socket) => {
    console.log("connected to /cam" + i);
    function pipeStream(data) {
      socket.emit("data", data);
    }
    stream.on("data", pipeStream);

    socket.on("disconnect", function () {
      stream.removeListener("data", pipeStream);
    });
  });
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/assets/index-single.html");
});

server.listen(3000, function () {
  console.log("Listening on localhost:3000");
});
