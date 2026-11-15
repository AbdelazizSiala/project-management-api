const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');

//Ki tji request, el router y3Adina lel corresponding function li 9asdineha fil controller 

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;