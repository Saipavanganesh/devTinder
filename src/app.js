const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
//Handle Auth middleware requsest for all methods for "/admin" routes
app.use("/admin", adminAuth);

//Response handler
app.get("/admin/", (req, res) => {
  res.send("All Admin Data Sent");
});
//Response handler
app.delete("/admin/", (req, res) => {
  res.send("All Admin Data Deleted");
});

app.post("/user/", (req, res) => {
  res.send("User logged in Succesfully");
});
app.get("/user/", userAuth, (req, res) => {
  res.send("All User Data Sent");
});
app.listen(7777, () => {
  console.log("Listening on port 3k");
});
