const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:O3lSg5nQsPtLxpVJ@namastenode.fucqiit.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
