const cron = require('node-cron');
const moment = require('moment');
const Appointment = require('./model/appointment.model');
const User = require('./model/User');
const { sendPushNotification } = require('./service/notificationService');

// Schedule a job to run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    console.log('Running scheduled job to check for upcoming appointments');

    try {
        const now = moment().utc();
        const oneHourLater = moment().utc().add(1, 'hour');

        // Find appointments that are scheduled within the next hour and haven't been notified yet
        const appointments = await Appointment.find({
            date: {
                $gte: now.toDate(),
                $lt: oneHourLater.toDate()
            },
            status: 'confirmed',
            notificationSent: { $ne: true } // Ensure notifications are only sent once
        });

        for (const appointment of appointments) {
            // Retrieve the user associated with the appointment
            const user = await User.findById(appointment.userId);

            if (user && user.expoPushToken) {
                await sendPushNotification([user.expoPushToken], {
                    body: `You have an upcoming appointment at ${moment(appointment.date).format('HH:mm')}.`,
                    data: { appointmentId: appointment._id },
                });

                // Mark the appointment as notified
                appointment.notificationSent = true;
                await appointment.save();
            }
        }
    } catch (error) {
        console.error('Error checking for upcoming appointments:', error);
    }
});