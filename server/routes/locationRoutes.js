const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();

router.post('/', locationController.processLocation);

module.exports = router;