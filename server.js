// Import Express, Mongoose db connection, and needed routes
const express = require("express");
const db = require("./config/connection.js");
const routes = require("./routes");

// Configure the Express application layer
const PORT = 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Start the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`);
  });
});
