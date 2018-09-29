
const express = require('express');

const router = express.Router();

const viewController = require('./viewController');

// GET /viewApis/messages/public
router.get('/messages/public', viewController.testEngineViews);


module.exports = router;
