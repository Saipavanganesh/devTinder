const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

//POST signup user
app.post("/signup", async (req, res) => {
  try {
    //validate user data
    validateSignUpData(req);
    const {firstName, lastName, emailId, password } = req.body;
    //Encrypt password using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    //Create instance of user model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send(`Error in creating user: ${err.message}`);
  }
});

//GET user by email
app.get("/user", async (req, res) => {
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
//GET one user by email
app.get("/oneUser", async (req, res) => {
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

//GET all users
app.get("/feed", async (req, res) => {
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
//DELETE user by id
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const users = await User.findByIdAndDelete(userId);
    res.send("user deleted");
  } catch {
    res.status(500).send("Something went wrong");
  }
});

//PATCH user by id
app.patch("/user/:userId", async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Listening on port 7777");
    });
  })
  .catch(() => {
    console.log("Database connection failed");
  });
