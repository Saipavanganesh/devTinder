const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

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

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName","photoUrl"]);
    res.json({
      message: "Connection requests fetched",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({
      message: "Connection requests fetched",
      data: data,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((r) => {
      hideUsersFromFeed.add(r.fromUserId.toString());
      hideUsersFromFeed.add(r.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = userRouter;
