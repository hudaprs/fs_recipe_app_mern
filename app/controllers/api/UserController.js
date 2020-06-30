const User = require('../../models/User');
const { success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

/**
 * @description     Registering a user
 * @method          POST api/users
 * @access          public
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // Check the user
    if (user)
      return res
        .status(404)
        .json(validation({ msg: 'Email already registered' }));

    user = new User({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Hash the password
    const hash = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, hash);

    // Save the user
    await user.save();

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

      res.status(201).json(
        success(
          'Register success',
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
