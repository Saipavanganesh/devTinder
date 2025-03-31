const express = require("express");
const reqeustRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

reqeustRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(`${user.firstName} Sent Connection Request`);
    } catch (err) {
      res.status(500).send(`Something went wrong while updating ${err.message}`);
    }
  });

module.exports = reqeustRouter;