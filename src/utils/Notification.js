const { createTransport } = require("nodemailer");
const axios = require("axios");
// const AWS = require("aws-sdk");
const logger = require("./logger.js");
// const { formatPhone } = require("../utils/helpers.js");
const config = require("../config.js");
// const twilio = require("twilio");

class Notification {
  constructor() {
    this.emailTransporter = null;
    // this.whatsappClient = null;
  }

  async initializeEmail() {
    // Configure AWS SES Transporter
    /* AWS.config.update({
      accessKeyId: config.AWS_ACCESS_KEY,
      secretAccessKey: config.AWS_SECRET_KEY,
      region: config.AWS_REGION,
    });

    this.emailTransporter = createTransport({
      SES: new AWS.SES({ apiVersion: "2010-12-01" }),
    }); */

    this.emailTransporter = createTransport({
      host: config.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL_FROM,
        pass: config.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(subject, body, toEmail) {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: toEmail,
      subject: subject,
      html: body,
    };

    try {
      if (!this.emailTransporter) {
        await this.initializeEmail();
      }

      const info = await this.emailTransporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
    } catch (error) {
      logger.error("Error sending email:", error);
    }
  }

  async sendSMS(body, toPhoneNumber) {
    try {
      const resp = await axios.post(
        config.SMS_DOMAIN,
        {
          from: config.SMS_SENDER_ID,
          to: toPhoneNumber,
          body,
          api_token: config.SMS_TOKEN,
          append_sender: "none",
        },
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      );

      if (!resp || resp.data.data.status !== "success") {
        logger.info(`SMS failed sending to ${toPhoneNumber}`);
      } else {
        logger.info(`SMS sent successfully to ${toPhoneNumber}`);
      }

      return resp;
    } catch (error) {
      logger.error(`Error sending SMS to ${toPhoneNumber}: `, error);
    }
  }

  async sendWhatsApp(message, toPhoneNumber) {
    try {
      this.whatsappClient = await twilio(
        config.WHATSAPP_SID,
        config.WHATSAPP_TOKEN
      );

      const phone = formatPhone(toPhoneNumber);

      this.whatsappClient.messages
        .create({
          body: message,
          from: "whatsapp:+14155238886",
          to: `whatsapp:${phone}`,
        })
        .then((message) => {
          logger.info(`WhatsApp message sent successfully: ${message.sid}`);
        });
    } catch (error) {
      logger.error("Error sending WhatsApp message:", error);
    }
  }

  // TODO: push notification
}

module.exports = Notification;
