const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommend');

router.post('/', getRecommendations);

module.exports = router;