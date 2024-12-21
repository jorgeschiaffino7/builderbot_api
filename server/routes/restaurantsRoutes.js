const express = require('express');
const restaurantController = require('../controllers/restaurant');

const router = express.Router();

router.post('/', restaurantController.createRestaurant);

module.exports = router;
