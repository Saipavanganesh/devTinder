const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");


userRouter.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch {
    res.status(500).send("Something went wrong");
  }
});

userRouter.get("/feed", async (req, res) => {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        res.status(404).send("Users not found");
      } else {
        res.send(users);
      }
    } catch {
      res.status(500).send("Something went wrong");
    }
  });
  
  userRouter.delete("/user", async (req, res) => {
    try {
      const userId = req.body.userId;
      const users = await User.findByIdAndDelete(userId);
      res.send("user deleted");
    } catch {
      res.status(500).send("Something went wrong");
    }
  });
  
  userRouter.get("/oneUser", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
      const users = await User.findOne({ emailId: userEmail });
      if (!users) {
        res.status(404).send("User not found");
      } else {
        res.send(users);
      }
    } catch (err) {
      res.status(500).send(`Something went wrong ${err.message}`);
    }
  });
  
module.exports = userRouter;
  