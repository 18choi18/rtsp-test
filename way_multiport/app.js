const express = require("express");
const http = require("http");
const Stream = require("node-rtsp-stream");

const cams = [
  { uri: "rtsp://210.99.70.120:1935/live/cctv001.stream", port: 9999 },
  { uri: "rtsp://210.99.70.120:1935/live/cctv002.stream", port: 10000 },
];

const streams = cams.map((cam, index) => {
  return new Stream({
    name: index,
    streamUrl: cam.uri,
    wsPort: cam.port,
  });
});
console.log(
  "🚀 ~ file: app.js:17 ~ streams ~ streams:",
  streams.map((s) => s.pipe)
);

const app = express();
const server = http.createServer(app);

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
node_modules\node-rtsp-stream\mpeg1muxer.js 수정이 필요하다.

this.spawnOptions = [
    // "-i",
    // this.url,
    // '-f',
    // 'mpegts',
    // '-codec:v',
    // 'mpeg1video',
    // // additional ffmpeg options go here
    // ...this.additionalFlags,
    // '-'
    "-rtsp_transport", "tcp", "-i",
    this.url,
    '-f',
    'mpeg1video',
    '-b:v', '1000k',
    '-maxrate', '1000k',
    '-bufsize', '1000k',
     '-an', '-r', '24',
    // additional ffmpeg options go here
    ...this.additionalFlags,
    '-'
]
*/
