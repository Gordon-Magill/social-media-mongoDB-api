// Boilerplate config file - just change the db name in the conntect string
const { connect, connection } = require("mongoose");

connect("mongodb://localhost/socialMediaApiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
