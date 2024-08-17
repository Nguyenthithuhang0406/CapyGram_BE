require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoute = require("./src/routes/user.route");
const { connectDB } = require("./src/utils/db");

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});