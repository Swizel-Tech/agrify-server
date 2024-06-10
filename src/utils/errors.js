class BadRequestError extends Error {
  constructor(message, code = "E400", data = null) {
    super();
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError);
    }

    this.errorCode = 400;
    this.intCode = code;
    if (data) this.data = data;
    this.errors = {
      property: "Invalid Credentials",
      message:
        message ||
        "An invalid parameter was supplied with request, please supply appropraite params",
    };
  }
}

module.exports = {
  BadRequestError,
};
