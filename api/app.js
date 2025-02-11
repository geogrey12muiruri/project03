const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const insuranceRouter = require("./routes/insurance"); // Import insurance routes
const admin = require('firebase-admin'); // Import firebase-admin

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
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

// New route to store FCM token
app.post('/store-token', async (req, res) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        return res.status(400).send('Missing required fields: userId or token');
    }

    try {
        // Store the token in the database (pseudo code, replace with actual implementation)
        // await TokenModel.create({ userId, token });

        console.log(`Token for user ${userId} stored successfully`);
        res.status(200).send('Token stored successfully');
    } catch (error) {
        console.log('Error storing token:', error);
        res.status(500).send('Error storing token');
    }
});

//!error handler
app.use(errorHandler);


app.post('/send-notification', async (req, res) => {
    const { token, title, body } = req.body;

if(!token || !title || !body) {
    return res.status(400).send('Missing required fields: token, title or body');
}

const message = {
    notification:{
        title: title,
        body: body
    },
    token: token
}
try{
  const response = await admin.messaging().send(message);
  console.log('Successfully sent message:', response);
  res.status(200).send('Notification sent successfully');
} catch (error) {
    console.log('Error sending message:', error);
    res.status(500).send('Error sending notification');
}

});


//! Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is up and running on port ${PORT}`));
