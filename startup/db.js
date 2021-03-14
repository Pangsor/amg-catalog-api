const winston = require(`winston`);
const mongoose = require(`mongoose`);
const config = require(`config`);

const optionConnClient = {
  auth: { "authSource": "admin" },
  user: config.get('userDb'),
  pass: config.get('passDb'),
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
};

module.exports = function() {
  const db = config.get(`db`);

  mongoose.connect(db, optionConnClient)
    .then(() => {
      winston.info(`Connected to ${db}...`);
    });
}