const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

//! Connect to mongodb
mongoose
  .connect("mongodb+srv://greggambugua:tgTb3Hjy3Qt329M1@cluster0.nximx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Db connected successfully"))
  .catch((e) => console.log(e));

//! Middlewares
app.use(cors()); // Use cors middleware
app.use(express.json()); //pass incoming json data from the user

//!Routes
app.use("/", router);

//!error handler
app.use(errorHandler);

//! Start the server
const PORT = 8000;
app.listen(PORT, console.log(`Server is up and running`));
