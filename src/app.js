const express = require("express");
const app = express();

app.get("/user/", (req, res) => {
  throw new Error("ldfjkjflkdfljad");
  res.send("All User Data Sent...");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Listening on port 3k");
});
