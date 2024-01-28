const express = require("express");
const sql = require("mssql");
const router = express.Router();
// const sendFCM = require("../../services/firebase-service");

module.exports = (pool) => {
  router.post("/notification/send", async (req, res, next) => {
    const req_id = req.body.req_id; //
    const req_gb = req.body.req_gb; // MAINT_REQ
    const key = req.body.key; // target id
    const title = req.body.title;
    const message = req.body.message;
    try {
      const request = pool.request();
      request.input("req_id", sql.NVarChar, req_id);
      request.input("req_gb", sql.NVarChar, req_gb);
      const { recordset = [] } = await pool
        .request()
        .input("req_id", req_id)
        .input("req_gb", req_gb)
        .execute("up_GetNotifyTarget");

      if (recordset.length === 0) return res.send();
      const tokens = recordset.map((record) => record.google_id);
      // await sendFCM(
      //   tokens,
      //   { title, body: message },
      //   { landingScreen: createLandingUrl(req_gb), key: String(key) }
      // );
      return res.send();
    } catch (err) {
      next(err);
    }
  });

  function createLandingUrl(req_gb) {
    switch (req_gb) {
      case "NOTICE":
        return "Notices";
      default:
        return "";
    }
  }

  return router;
};
