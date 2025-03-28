const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Hello from the server");
});
app.use("/hello", (req, res) => {
  res.send("Hello page");
});
app.use("/", (req, res) => {
  res.send("This is the landing page");
});
app.listen(7777, () => {
  console.log("Listening on port 3k");
});
