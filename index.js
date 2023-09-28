const express = require("express");
const { AllRoutes } = require("./Routes/AllRoutes");
const cors = require("cors");
const { connection } = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());

const port = process.env.PORT;
app.use(express.json());
app.use("/api", AllRoutes);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("server is running on Port 4000");
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
});
