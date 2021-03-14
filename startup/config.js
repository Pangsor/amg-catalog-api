const config = require(`config`);

module.exports = function() {
  if (!config.get(`jwtPrivateKey`)) {
    throw new Error(`FATAL ERROR: jwtPrivateKey is not defined.`);
  }

  if (!config.get(`db`)) {
    throw new Error(`FATAL ERROR: DataBase is not defined.`);
  }

  if (!config.get(`nsiKey`)) {
    throw new Error(`FATAL ERROR: NSI KEY is not defined.`);
  }

  if (!config.get(`encKey`)) {
    throw new Error(`FATAL ERROR: Encrypt key is not defined.`);
  }
  
  // console.log(config.get(`encKey`));
}