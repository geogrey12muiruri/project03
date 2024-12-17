const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const insuranceRouter = require("./routes/insurance"); // Import insurance routes

const app = express();

//! Connect to mongodb
mongoose
  .connect(process.env.MONGO_URI) // Corrected environment variable name
  .then(() => console.log("Db connected successfully"))
  .catch((e) => console.log(e));

//! Middlewares
app.use(cors()); // Use cors middleware
app.use(express.json()); //pass incoming json data from the user

//!Routes
app.use("/", router);
app.use("/insurance", insuranceRouter); // Use insurance routes

//!error handler
app.use(errorHandler);

//! Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is up and running on port ${PORT}`));
