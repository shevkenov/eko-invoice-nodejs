const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/eko-invoice-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

module.exports = mongoose.connection;