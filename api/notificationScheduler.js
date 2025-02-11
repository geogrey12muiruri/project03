const cron = require('node-cron');
const moment = require('moment');
const Appointment = require('./models/appointment.model');
const User = require('./models/user.model');
const { sendPushNotification } = require('./service/notificationService');

// Schedule a job to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job to check for upcoming appointments');

    try {
        const now = moment();
        const oneHourLater = moment().add(1, 'hour');

        // Find appointments that are scheduled within the next hour
        const appointments = await Appointment.find({
            date: {
                $gte: now.toDate(),
                $lt: oneHourLater.toDate()
            },
            status: 'confirmed'
        });

        for (const appointment of appointments) {
            // Retrieve the user associated with the appointment
            const user = await User.findById(appointment.userId);

            if (user && user.expoPushToken) {
                await sendPushNotification([user.expoPushToken], {
                    body: `You have an upcoming appointment at ${moment(appointment.date).format('HH:mm')}.`,
                    data: { appointmentId: appointment._id },
                });
            }
        }
    } catch (error) {
        console.error('Error checking for upcoming appointments:', error);
    }
});
