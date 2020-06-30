const { check } = require('express-validator');

exports.registerValidation = [
  check('name', 'Name is required | Max 50 Char').not().isEmpty().isLength({
    max: 50,
  }),
  check('email', 'Email is required | Max 50 Char')
    .isEmail()
    .isLength({ max: 50 }),
  check('password', 'Password is required | Max 255 Char')
    .not()
    .isEmpty()
    .isLength({
      max: 255,
    }),
];

exports.loginValidation = [
  check('email', 'Email must be valid').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
];
