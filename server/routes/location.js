const express = require('express');
const location = require('../controllers/location');

const router = express.Router();

router.post('/', location.processLocation);

module.exports = router;

