const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const insuranceRouter = require("./routes/insurance"); // Import insurance routes
const admin = require('firebase-admin'); // Import firebase-admin
const User = require("./model/User"); // Import User model
const { Expo } = require('expo-server-sdk'); // Import Expo SDK
const notificationScheduler = require('./notificationScheduler'); // Import notification scheduler

const firebaseConfig = require('./config/firebaseConfig'); // Import firebaseConfig

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});

let expo = new Expo(); // Create a new Expo SDK client

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
        // Store the token in the database
        await User.findByIdAndUpdate(userId, { fcmToken: token });

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

    if (!token || !title || !body) {
        return res.status(400).send('Missing required fields: token, title or body');
    }

    // Create the message
    let messages = [];
    if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        return res.status(400).send('Invalid Expo push token');
    }

    messages.push({
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { title, body },
    });

    // Send the message
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    try {
        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        console.log('Successfully sent message:', tickets);
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.log('Error sending message:', error);
        res.status(500).send('Error sending notification');
    }
});

// Importing notificationScheduler starts the scheduled job
//! Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is up and running on port ${PORT}`));
