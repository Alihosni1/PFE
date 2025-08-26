const express = require('express');
const { login } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/login', login);

module.exports = router;