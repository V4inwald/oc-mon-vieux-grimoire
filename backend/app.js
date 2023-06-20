const express = require("express");
const bookRoutes = require("./routes/book");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connect to DataBase
mongoose
  .connect(
    "mongodb+srv://MonVieuxGrimoire:6oMHryZBcVIz2YjFJna2@cluster0.q9dt6xu.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Prevent CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/books", bookRoutes);

module.exports = app;
