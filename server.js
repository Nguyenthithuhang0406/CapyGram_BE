require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoute = require("./src/routes/user.route");
const { connectDB } = require("./src/utils/db");
const postRoute = require("./src/routes/post.route");
const graphRoute = require("./src/routes/graph.route");
const commentRoute = require("./src/routes/comment.route");

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/graph", graphRoute);
app.use("/api/comment", commentRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});