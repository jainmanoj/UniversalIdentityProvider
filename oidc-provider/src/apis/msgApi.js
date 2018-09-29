
const express = require('express');

const router = express.Router();

const messageController = require('../controller/msgController');

// GET /api/messages/public1
router.get('/messages/public', messageController.getPublicMessage);

router.post('/messages/public', messageController.postPublicMessage);

// GET /api/callback
router.get('/callback', messageController.apicallback);


module.exports = router;
