const {
  Marchant,
  UserOTPVerification,
  BankAccount,
} = require("../../models/index.js");
const MakeEmailTemplate = require("../../utils/makeEmailTemplate.js");
const Notification = require("../../utils/Notification.js");
const AsyncHandler = require("../../utils/asyncHandler");
const ErrorHandler = require("../../utils/customError");
const { StatusCodes } = require("http-status-codes");

const users = [
  {
    name: "Safe User",
    email: "safe@example.com",
    password: "pw",
    lastLogin: "2017-09-22T21:01:13.184Z",
  },
  {
    name: "Unsafe User",
    email: "test@example.com",
    password: "pw",
    lastLogin: "2016-01-01T08:51:33.912Z",
  },
];

const breaches = [
  {
    name: "Sample 1",
    domain: "test.com",
    breachDate: "2017-03-01",
    addedDate: "2017-11-24T08:15:24Z",
  },
  {
    name: "Sample 2",
    domain: "test.com",
    breachDate: "2009-01-01",
    addedDate: "2017-02-18T02:54:48Z",
  },
  {
    name: "Sample 3",
    domain: "test.com",
    breachDate: "2014-05-17",
    addedDate: "2014-09-04T21:06:46Z",
  },
];

const bcrypt = require("bcrypt");

/** New marchant account creation */
const sign_up = AsyncHandler(async (req, res, next) => {
  try {
    const { firstName, location, lastName, email, phone, deviceId } = req.body;

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
      location,
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

// change pin
const change_pin = AsyncHandler(async (req, res, next) => {
  try {
    const { marchantId } = req.body;
    if (!marchantId) {
      return next(
        new ErrorHandler(`Missing required fields!`, StatusCodes.BAD_REQUEST)
      );
    }

    const marchant = await Marchant.findByPk(marchantId);

    if (!marchant) {
      return next(
        new ErrorHandler(`Marchant not found!`, StatusCodes.BAD_REQUEST)
      );
    }

    // Generate OTP
    const otp = `${Math.floor(10000 + Math.random() * 90000)}`;

    // Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Find existing OTP record
    let v_otp = await UserOTPVerification.findOne({
      where: { marchantId: marchantId },
    });

    if (v_otp) {
      // Update existing OTP record
      v_otp.otp = hashedOTP;
      v_otp.created = Date.now();
      await v_otp.save();
    } else {
      // Create a new OTP record
      v_otp = UserOTPVerification.build({
        marchantId: marchantId,
        otp: hashedOTP,
        created: Date.now(),
      });
      await v_otp.save();
    }

    // Send email
    const emailData = {
      otp: `${otp}`,
      name: `${marchant.firstName} ${marchant.lastName}`,
      year: new Date().getFullYear(),
    };

    const emailMessage = MakeEmailTemplate("otp.html", emailData);

    const subject = `Welcome to Agrify`;

    // Send welcome/verify email to the user
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
        "Otp not sent, please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// verify pin and change password
const verify_otp_pin = AsyncHandler(async (req, res, next) => {
  try {
    const { otp, marchantId, pin } = req.body;

    if (!otp) {
      return next(
        new ErrorHandler(`OTP Not Provided`, StatusCodes.BAD_REQUEST)
      );
    }

    if (!marchantId) {
      return next(
        new ErrorHandler(
          `marchantId address Not Provided`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const fndmarId = await Marchant.findOne({ where: { id: marchantId } });

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

    const hashPin = await bcrypt.hash(pin, 10);

    await fndmarId.update({ pin_password: hashPin });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Account Pin changed Successfully",
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

// Log in
const sign_in = AsyncHandler(async (req, res, next) => {
  try {
    const { phone, pin_password, deviceId } = req.body;
    const user = await Marchant.findOne({ where: { phone } });

    if (!user) {
      return next(
        new ErrorHandler(`Marchant Not found`, StatusCodes.NOT_FOUND)
      );
    }

    if (user.isVerified === false) {
      return next(
        new ErrorHandler(
          `Account not verified, Please Verify Your account`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    if (user.deviceId === deviceId) {
      // Log in the User
      // Check pin_password
      const isPinCorrect = await user.comparePassword(pin_password);

      if (!isPinCorrect) {
        return next(
          new ErrorHandler(`Wrong User Pin...`, StatusCodes.NOT_FOUND)
        );
      }

      const updatedUsr = await user.update({
        loginStatus: true,
      });

      // Set user information in the session
      // req.session.user = { email: user.email };

      // Save the session explicitly
      // req.session.save((err) => {
      //   if (err) {
      //     console.error(err);
      //   }
      // });

      // Create Token
      const accessToken = updatedUsr.createJWT();

      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
          maxAge: 3600000,
          path: "/",
        })
        .status(StatusCodes.OK)
        .json({
          success: true,
          message: "Login successfull",
          data: { code: "00", updatedUsr, accessToken },
        });
    } else {
      // Check Password
      const isPasswordCorrect = await user.comparePassword(pin_password);

      if (!isPasswordCorrect) {
        return next(
          new ErrorHandler(`Wrong User Password`, StatusCodes.BAD_REQUEST)
        );
      }

      // Generate OTP
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

      // Hash OTP
      const hashedOTP = await bcrypt.hash(otp, 10);

      const OTPVerification = {
        userId: user.id,
        otp: hashedOTP,
        created: Date.now(),
      };

      // REPLACE OTP IF USER ID ALREADY EXIST
      const userExist = await UserOTPVerification.findOne({
        where: {
          marchantId: user.id,
        },
      });
      await userExist.update(OTPVerification);

      // send email
      const emailData = {
        otp: `${otp}`,
        name: `${user.firstName} ${user.lastName}`,
        year: new Date().getFullYear(),
      };

      const emailMessage = MakeEmailTemplate("firstsignin.html", emailData);

      const subject = `Welcome Back to Agrify`;

      // Resend one time password
      const notifier = new Notification();
      notifier.sendEmail(subject, emailMessage, user.email);

      res.status(StatusCodes.OK).json({
        success: true,
        newdevice: true,
        message:
          "Please verify your sign in from this device as its your first time to use this device",
      });
    }
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler("Sign in failed.", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

function authenticate(email, password) {
  const account = users.find((a) => a.email === email);
  if (account && account.password === password) {
    return account;
  } else {
    return null;
  }
}

async function getData(email) {
  const url = `https://hackcheck.woventeams.com/api/v4/breachedaccount/${email}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response;
  } catch (error) {
    return false;
  }
}

// The object returned from this function will be displayed in
// a modal upon clicking submit on the login form.

async function login(email, password) {
  const account = authenticate(email, password);
  if (account) {
    const email = account.email;
    // A new breach was detected!
    if (breaches.length > 0) {
      const res = await getData(email);
      return {
        success: true,
        meta: {
          suggestPasswordChange: true,
          // hardcoded for now...
          breachedAccounts: res,
        },
      };
    } else {
      return { success: true };
    }
  } else {
    return {
      success: false,
      message: "The username or password you entered is invalid.",
    };
  }
}

module.exports = {
  sign_up,
  verify_otp,
  marchant_pass,
  get_account,
  checkdevice,
  change_pin,
  verify_otp_pin,
  sign_in,
  login,
};
