const { Marchant, UserOTPVerification } = require("../../models/index.js");
const MakeEmailTemplate = require("../../utils/makeEmailTemplate.js");
const Notification = require("../../utils/Notification.js");
const AsyncHandler = require("../../utils/asyncHandler");
const ErrorHandler = require("../../utils/customError");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

/** New marchant account creation */
const sign_up = AsyncHandler(async (req, res, next) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, phone, deviceId } = req.body;

    const findEmail = await Marchant.findOne({
      where: {
        email: req.body.email,
      },
    });
    const findPhone = await Marchant.findOne({
      where: {
        phone: req.body.phone,
      },
    });

    if (findEmail) {
      return next(
        new ErrorHandler(
          `Email ${findEmail.email} Already Exist`,
          StatusCodes.CONFLICT
        )
      );
    }
    if (findPhone) {
      return next(
        new ErrorHandler(
          `Phone Number ${findPhone.phone} Already Exist`,
          StatusCodes.CONFLICT
        )
      );
    }

    const new_marchant = Marchant.build({
      firstName,
      lastName,
      email,
      phone,
      pin_password: "",
      deviceId,
    });

    const marchant = await new_marchant.save();

    // Generate OTP
    const otp = `${Math.floor(10000 + Math.random() * 90000)}`;

    // Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    const v_otp = UserOTPVerification.build({
      marchantId: marchant.id,
      otp: hashedOTP,
      created: Date.now(),
    });

    await v_otp.save();

    // send email
    const emailData = {
      otp: `${otp}`,
      name: `${marchant.firstName} ${marchant.lastName}`,
      year: new Date().getFullYear(),
    };

    const emailMessage = MakeEmailTemplate("welcome.html", emailData);

    const subject = `Welcome to Agrify`;

    // send welcome/verify email to the user
    const notifier = new Notification();
    notifier.sendEmail(subject, emailMessage, marchant.email);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `One Time Password Sent to your email ${marchant.email}`,
      data: { marchant },
    });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Account Creation Failed.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

/**verify marchant account */
const verify_otp = AsyncHandler(async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    if (!otp) {
      return next(
        new ErrorHandler(`OTP Not Provided`, StatusCodes.BAD_REQUEST)
      );
    }

    if (!email) {
      return next(
        new ErrorHandler(`Email address Not Provided`, StatusCodes.BAD_REQUEST)
      );
    }

    const fndmarId = await Marchant.findOne({ where: { email: email } });

    if (fndmarId.verified === true) {
      return next(
        new ErrorHandler(`Account already verified.`, StatusCodes.BAD_REQUEST)
      );
    }
    const userOtp = await UserOTPVerification.findOne({
      where: {
        marchantId: fndmarId.id,
      },
    });

    if (!userOtp) {
      return next(
        new ErrorHandler(`User OTP Not Found`, StatusCodes.BAD_REQUEST)
      );
    }

    const hashedOTP = userOtp.otp;

    const validOTP = await bcrypt.compare(otp, hashedOTP);

    if (!validOTP) {
      return next(
        new ErrorHandler(
          `Invalid Code check your Inbox for the Most Recent Code`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const currentTime = new Date();
    const createdAtString = userOtp.created;
    const userOtpCreatedAt = new Date(createdAtString);
    const otpExpirationTime = new Date(userOtpCreatedAt.getTime() + 300000);

    // EXPIRE OTP AFTER % MINUTES OF CREATION
    if (currentTime > otpExpirationTime) {
      return next(
        new ErrorHandler(`OTP Expired, Resend OTP`, StatusCodes.BAD_REQUEST)
      );
    }

    await fndmarId.update({ verified: true });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Account Verified Successfully",
      data: { fndmarId },
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Verifying OTP Failed.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

/**creta account password */
const marchant_pass = AsyncHandler(async (req, res, next) => {
  try {
    const { pin, email } = req.body;

    if (!pin) {
      return next(
        new ErrorHandler(`Pin Not Provided`, StatusCodes.BAD_REQUEST)
      );
    }

    if (!email) {
      return next(
        new ErrorHandler(`Email address Not Provided`, StatusCodes.BAD_REQUEST)
      );
    }

    const fndmarId = await Marchant.findOne({ where: { email: email } });
    await fndmarId.update({ verified: true });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password created Successfully",
      data: { fndmarId },
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Password not created try again.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// Get account
const get_account = AsyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return next(
        new ErrorHandler(`User Id Not Provided`, StatusCodes.BAD_REQUEST)
      );
    }

    const user = await Marchant.findByPk(userId);

    if (!user) {
      return next(
        new ErrorHandler(`Account not found`, StatusCodes.BAD_REQUEST)
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Account retrived Successfully!`,
      data: { user },
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "failed to get user account",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// Check device Id
const checkdevice = AsyncHandler(async (req, res, next) => {
  try {
    const deviceId = req.params.deviceId;
    const device = await Marchant.findOne({
      where: {
        deviceId,
      },
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Device Id retrived Successfully!`,
      data: { device },
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "failed fetch device ID",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = {
  sign_up,
  verify_otp,
  marchant_pass,
  get_account,
  checkdevice,
};
