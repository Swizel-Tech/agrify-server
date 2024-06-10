// const admin = require("firebase-admin");

// // Initialize Firebase Admin SDK with your service account credentials
// const serviceAccount = require("../firebaseService/nicetel-7173e-firebase-adminsdk-dbhr1-1ce54eff4e.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Function to send a push notification
// const sendPushNotification = async (deviceToken, message) => {
//   const payload = {
//     notification: {
//       title: "New Message",
//       body: message,
//     },
//   };

//   try {
//     await admin.messaging().sendToDevice(deviceToken, payload);
//     console.log("Push notification sent successfully.");
//   } catch (error) {
//     console.error("Error sending push notification:", error);
//   }
// };

// module.exports = { sendPushNotification };
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../firebaseService/nicetel-7173e-firebase-adminsdk-dbhr1-1ce54eff4e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Subscribe a device to a topic
const sendPushNotification = async (topic, title, body, msgId) => {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        msgId: msgId,
      },
      topic: topic,
    };
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    return error;
  }
};

// Subscribe a device to a topic
const subscribeToTopic = async (deviceToken, topic) => {
  try {
    await admin.messaging().subscribeToTopic(deviceToken, topic);
    console.log(`Subscribed to topic: ${topic}`);
  } catch (error) {
    console.error("Error subscribing to topic:", error);
  }
};

module.exports = { sendPushNotification, subscribeToTopic };
