const { connect, connection } = require('mongoose');

connect('mongodb://localhost/socialMediaApiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {connection};