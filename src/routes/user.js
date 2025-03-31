const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

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
  
  userRouter.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
      const ALLOWED_UPDATES = ["photoUrl", "age", "about", "gender", "skills"];
      const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
      );
      if (!isUpdateAllowed) {
        throw new Error("Update not allowed");
      }
      if (data?.skills?.length > 10) {
        throw new Error("Skills cannot be more than 10");
      }
      await User.findByIdAndUpdate(userId, data, {
        returnDocument: "after",
        runValidators: true,
      });
      res.send("User Updated");
    } catch (err) {
      res.status(500).send(`Something went wrong while updating ${err.message}`);
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
  