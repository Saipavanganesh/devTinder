const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send(`Error in saving user: ${err.message}`);
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
