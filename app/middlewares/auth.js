const { error } = require('../helpers/responseApi');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

module.exports = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  // Check the token
  if (typeof bearerHeader === 'undefined')
    return res.status(401).json(error('No token found', res.statusCode));

  try {
    const bearerToken = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(bearerToken, jwtSecret);

    // Check the token
    if (!decoded)
      return res.status(401).json(error('Token invalid', res.statusCode));

    req.authenticatedUser = decoded.user;
    next();
  } catch (err) {
    res.status(401).json(error('Token invalid', res.statusCode));
  }
};
