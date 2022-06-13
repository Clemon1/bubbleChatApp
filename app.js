const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 6000;
const cors = require("cors");
const path = require("path");
const { log } = require("console");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log("Error connectiong to database"));
db.once("open", () => console.log("ChatApp database connected"));
const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/", userRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
