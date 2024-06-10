const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes.js");
const customError = require("./utils/customError");
const globalErrorHandler = require("./utils/globalErrorHandler");
const cookieParser = require("cookie-parser");
const { StatusCodes } = require("http-status-codes");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const config = require("./config.js");
const db = require("./models/index.js");

// Enable CORS for all routes
app.use(helmet());
app.use(
  cors({
    origin: ["*", "http://127.0.0.1:5173"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Configure session middleware
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      // httpOnly: true,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Agrify Backend Running!");
});

app.get("/sess", (req, res) => {
  if (req.session.user) {
    return res.json({ valid: true, user: req.session.user });
  } else {
    return res.json({ valid: false });
  }
});

const validApiKeys = new Set([config.API_KEY]);

// Middleware to check API key in each request
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !validApiKeys.has(apiKey)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized - Invalid API key" });
  }
  next();
};

// MIDDLEWARE
app.use(apiKeyMiddleware);

// api routes
app.use("/", routes);

//ERROR IF ROUTE DONT EXIST IN SERVER
app.all("*", (req, res, next) => {
  const err = new customError(
    `Can't Find ${req.originalUrl} on the Server`,
    404
  );
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

const port = config.PORT || 5000;

// START THE SERVER
app.listen(port, async () => {
  console.log(`Server Running on port ${port}`);
});
