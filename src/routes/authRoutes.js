//Ki tji request, el router y3Adina lel corresponding function li 9asdineha fil controller 

const express = require('express');
const { register } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);

module.exports = router;