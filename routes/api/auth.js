const router = require('express').Router();

// Controllers
const { login, me } = require('../../app/controllers/api/AuthController');

// Middleware validation
const {
  loginValidation,
} = require('../../app/middlewares/validations/authValidation');
const auth = require('../../app/middlewares/auth');

router.post('/', loginValidation, login);
router.get('/', auth, me);

module.exports = router;
