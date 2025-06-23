const express = require('express');
const {createChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controllers/chatController');
const {verifyToken} = require('../midleware/authMiddleware');
const router = express.Router();

router.post('/createChat', verifyToken, createChat);
router.get('/fetchChats', verifyToken, fetchChats);
router.post('/createGroupChat', verifyToken, createGroupChat);
router.put('/renameGroup', verifyToken, renameGroup);
router.put('/addToGroup', verifyToken, addToGroup);
router.put('/removeFromGroup', verifyToken, removeFromGroup);

module.exports = router;