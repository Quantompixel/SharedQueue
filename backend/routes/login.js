const express = require('express');
const {loginRequest} = require('../controllers/loginController');
const router = express.Router();

router.post('/login', loginRequest);
module.exports = router;