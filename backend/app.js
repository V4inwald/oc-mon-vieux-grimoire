const path = require("path");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { cors } = require("./middleware/cors");

const app = express();

app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Limits all requests to 100/15min
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(cors);

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
