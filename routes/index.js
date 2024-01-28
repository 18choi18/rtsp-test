const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middlewares/auth");

module.exports = (pool) => {
  router.use("/public", require("./public")(pool));
  //   router.use(authMiddleware);
  //   router.use("/requests", require("./requests")(pool));

  return router;
};
