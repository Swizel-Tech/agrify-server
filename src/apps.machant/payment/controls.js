const { BankAccount } = require("../../models/index.js");
const AsyncHandler = require("../../utils/asyncHandler");
const ErrorHandler = require("../../utils/customError");
const { StatusCodes } = require("http-status-codes");
const { resolve_acc, getallbank } = require("../../service/paystackDVA.js");
const { findMatchingRecord } = require("../../utils/helpers.js");

// get all bank
const get_banks = AsyncHandler(async (req, res, next) => {
  try {
    const banks = await getallbank();
    res.status(StatusCodes.OK).json({
      success: true,
      data: { banks },
    });
  } catch (error) {
    console.log(error);
  }
});

// Validate Account
const resolve_acc_number = AsyncHandler(async (req, res, next) => {
  try {
    const { acc_number, bank_name } = req.body;
    const bankResponse = await getallbank();
    const matchingRecord = await findMatchingRecord(
      bankResponse,
      "name",
      bank_name
    );

    const bank_code = matchingRecord.code;
    const acc = await resolve_acc(acc_number, bank_code);
    if (acc === false) {
      return next(
        new ErrorHandler(
          `Could not resolve account name. Check parameters or try again.`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Bank Account verified Successfully!`,
      data: { acc },
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "failed to validate account number",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// Save account Number
const account_number = AsyncHandler(async (req, res, next) => {
  try {
    const marchantId = "087a8b59-6f41-4d27-8ce3-f6c603294829";
    const { acc_number, acc_name, bank } = req.body;
    // check if marchant already have an acc
    const check_acc = await BankAccount.findOne({
      where: { marchantId },
    });

    if (check_acc) {
      return next(
        new ErrorHandler(
          `You already have an Account Stored`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const new_bank = BankAccount.build({
      acc_number,
      acc_name,
      bank,
      marchantId: marchantId,
    });

    const bank_saved = await new_bank.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Bank Account saved Successfully!`,
      data: { bank_saved },
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "failed Save account Number",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = {
  account_number,
  resolve_acc_number,
  get_banks,
};
