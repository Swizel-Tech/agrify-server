const axios = require("axios");
const config = require("../config.js");
const logger = require("../utils/logger.js");
// const { formatPhone } = require("../utils/helpers.js");
const { logApiResponse } = require("../repositories/actionLogs.js");
const HOSTNAME = "https://api.paystack.co";
const provider = "paystack";

const getallbank = async () => {
  try {
    const params = {
      country: "nigeria",
    };
    const res = await axios.get(`${HOSTNAME}/bank`, {
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      params,
    });

    logger.info(`${res.data.message}`);
    await logApiResponse("Account Verified", provider, res.data.data);
    return res.data.data;
  } catch (error) {
    logger.error(error);
  }
};

// Resolve account
const resolve_acc = async (acc_number, bank_code) => {
  try {
    const params = {
      account_number: acc_number,
      bank_code,
    };

    const res = await axios.get(`${HOSTNAME}/bank/resolve`, {
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      params, // pass the params here
    });

    logger.info(`${res.data.message}`);
    await logApiResponse("Account Verified", provider, res.data.data);
    return res.data.data;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

module.exports = {
  resolve_acc,
  getallbank,
};
