const express = require('express');
const { generateTimetables } = require('../controllers/timetable');
const router = express.Router();

// POST 요청 처리
router.post('/', generateTimetables);

module.exports = router;
