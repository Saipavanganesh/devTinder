const express = require("express");
const app = express();

//read from url => /user?userId=101&name="ganesh"
app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({ firstname: "Sai Pavan Ganesh", lastname: "Mallampalli" });
});


//read from url =>/user/101/ganesh/testPassword
app.get("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
    res.send({ firstname: "Sai Pavan Ganesh", lastname: "Mallampalli" });
  });





app.use("/test", (req, res) => {
  res.send("Hello from the server");
});
app.use("/hello", (req, res) => {
  res.send("Hello page");
});
app.use("/testing", (req, res) => {
  res.send("This is the testing page");
});
app.use("/", (req, res) => {
  res.send("This is the landing page");
});
app.listen(7777, () => {
  console.log("Listening on port 3k");
});
