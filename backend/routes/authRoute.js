const express = require('express');
const {signup,login,logout,checkAuth} = require('../controllers/authController');
const {verifyToken} = require('../midleware/authMiddleware')

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/checkAuth', verifyToken, checkAuth);

module.exports = router;
