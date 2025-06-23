const express = require('express');
const router = express.Router();
const {getLoggedInUser,getAllUsers} = require('../controllers/userController');
const {verifyToken} = require('../midleware/authMiddleware');

router.get('/loggedUser', verifyToken, getLoggedInUser);
router.get('/all', verifyToken, getAllUsers);

module.exports = router;