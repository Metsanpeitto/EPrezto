const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController')

router.route('/').post(chatbotController.handleQuery);

module.exports = router;