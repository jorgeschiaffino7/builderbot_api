const express = require('express');
const locationController = require('../controllers/locationController');
//const locationRestaurant = require('../controllers/locationRestaurant');

const router = express.Router();

router.post('/', locationController.processLocation);


//router.post('/restaurant', locationRestaurant.processLocation);

//TODO: locationRestaurant.processLocation recibe la latitud y longitud de la ciudad y devuelve los restaurantes 
//TODO: que se encuentran a menos de 10 km de la ciudad.


module.exports = router;


//TODO: este archivo se utiliza para procesar la ubicación de los restaurantes y atracciones .

