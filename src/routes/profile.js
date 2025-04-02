const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} Profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    console.log(req.body);
    const newPassword = req.body.password;
    const isPasswordValid = validator.isStrongPassword(newPassword);
    if (!isPasswordValid) {
      throw new Error("Enter a strong password");
    }
    const loggedInUser = req.user;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} Password updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

module.exports = profileRouter;
