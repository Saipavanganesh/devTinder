const express = require("express");
const connectDB = require("./config/database");
const app = express();
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const http = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials:true,
}));

app.options('*', cors()); // Handle preflight OPTIONS requests

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);



connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(7777, () => {
      console.log("Listening on port 7777");
    });
  })
  .catch(() => {
    console.log("Database connection failed");
  });
