const { success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');
const User = require('../../models/User');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @description     Login a user
 * @method          POST api/auth
 * @access          public
 */
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // Check the user email
    if (!user)
      return res.status(422).json(validation({ msg: 'Invalid Credentials' }));

    // Check the user password
    const isPassword = (user.password = await bcrypt.compare(
      password,
      user.password
    ));

    if (!isPassword)
      return res.status(422).json(validation({ msg: 'Invalid Credentials' }));

    // Payload for jwt
    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    // Send the response
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;

      res.status(200).json(
        success(
          'Login success',
          {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              date: user.createdAt,
            },
            token,
          },
          res.statusCode
        )
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @description     Get authenticated user
 * @method          GET api/auth
 * @access          private
 */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.authenticatedUser.id).select(
      '-password'
    );

    res.status(200).json(success(`Hi ${user.name}`, { user }, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};
