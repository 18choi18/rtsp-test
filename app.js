const express = require("express");
const http = require("http");
const Stream = require("node-rtsp-stream");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const sql = require("mssql");

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

const configInfo = require("./config/config.json");
const config = {
  user: configInfo.user,
  password: configInfo.password,
  server: configInfo.server,
  database: configInfo.database,

  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};
const pool = new sql.ConnectionPool(config);
pool.connect(async (err) => {
  if (err) {
    return console.log("🚀 ~ pool.connect ~ err:", err);
  }

  try {
    // const request = pool.request();
    // let query = `select * from cams`;
    // const cams = await request.query(query);
    // const streams = cams.map((cam, index) => {
    //   return new Stream({
    //     name: index,
    //     streamUrl: cam.uri,
    //     wsPort: cam.port,
    //   });
    // });
  } catch (err) {
    console.log("🚀 ~ pool.connect streams ~ err:", err);
  }
});

const app = express();

// app.set("jwt-secret", configInfo["jwt-secret"]);
app.use(cors());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "assets")));

const apiRoutes = require("./routes")(pool);
app.use("/api", apiRoutes);

app.use(function (err, req, res, next) {
  console.error("🚀 err:", err.originalError);
  console.error("~ req.url", req.method, req.url);
  console.error("~ req.body", req.body);
  console.error("~ req.date", new Date().toLocaleString());
  console.error("~ userId", req.decoded?.user_id);
  res.status(err.status || 500);
  res.send(err);
});

// Start the server
const server = http.createServer(app);
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
