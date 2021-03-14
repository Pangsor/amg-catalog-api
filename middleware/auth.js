const jwt = require(`jsonwebtoken`);
const config = require(`config`);
const Joi = require('@hapi/joi');

const { decryptText } = require('../middleware/encrypt');

async function Auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

function nsiAuth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    if (token !== config.get(`nsiKey`)) return res.status(401).send(`Access denied.`);
    req.user = JSON.parse(decryptText(token));
    
    const { error } = validateNSIAuth(req.user);
    if ( error ) return res.status(400).send(error.details[0].message);
    next();
  }catch (ex) {
    res.status(400).send(ex.message);
  }
}

function validateNSIAuth(dataBody){
  const schema = Joi.object({
    user_id: Joi.string().min(1).max(40).required(), 
    nama_lkp: Joi.string().min(1).max(40).required(),
    password: Joi.string().min(1).max(100).required(),
    input_by: Joi.string().min(1).max(60).required()
  });
  return schema.validate(dataBody);  
}

exports.Auth = Auth;
exports.nsiAuth = nsiAuth;