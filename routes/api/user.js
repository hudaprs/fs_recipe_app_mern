const router = require('express').Router();

// Controllers
const { register } = require('../../app/controllers/api/UserController');

// Middleware Validation
const {
  registerValidation,
} = require('../../app/middlewares/validations/authValidation');

router.post('/', registerValidation, register);

module.exports = router;
