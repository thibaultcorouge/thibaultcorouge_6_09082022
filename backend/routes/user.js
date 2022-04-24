const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//Users routes (login and sign up).

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;