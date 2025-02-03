const express = require('express');
const location = require('../controllers/location');

const router = express.Router();

router.post('/', location.processLocation);

// location seria el archivo location.js de la carpeta "controllers" y CONCATENAMOS
// "processLocation" que es el metodo creado en location.js

module.exports = router;

