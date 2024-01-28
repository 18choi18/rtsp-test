module.exports = {
  apps: [
    {
      name: "api-server",
      script: "app.js",
      watch: ".",
      ignore_watch: ["node_modules", "public/*"],
      env: {
        TZ: "Asia/Seoul",
      },
    },
  ],
};
