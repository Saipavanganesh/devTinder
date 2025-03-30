const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Kartikeya Murali Krishna",
    lastName: "Mallampalli",
    emailId: "kmk@gmail.com",
    password: "Kmk@123",
  });

  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("Error in saving user: ", err.message);
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
