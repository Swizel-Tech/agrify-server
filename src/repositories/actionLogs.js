const { ActionLog, ApiLog } = require("../models/index.js");

const logAction = async (userId, action, data = null, session = null) => {
  if (data) data = JSON.stringify(data);

  const options = {};
  if (session) options.transaction = session;

  await ActionLog.create({ userId, action, data }, options);
};

const logApiResponse = async (title, provider, data = null, session = null) => {
  const options = {};
  if (session) options.transaction = session;

  await ApiLog.create({ title, provider, data }, options);
};

module.exports = { logAction, logApiResponse };
