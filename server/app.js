const express = require('express');
const mongoose = require('mongoose');
//const locationRoutes = require('./routes/locationRoutes');
//const locationRestaurant = require('./routes/locationrestRoutes'); 
const location = require('./routes/location');
const attractionsRoutes = require('./routes/attractionsRoutes');
const restaurantsRoutes = require('./routes/restaurantsRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');

dotenv.config();

const app = express();



// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/location', location); // Ruta para procesar la UBICACION de los atracciones 
//app.use('/api/location', locationRoutes); // Ruta para procesar la UBICACION de los atracciones 
//app.use('/api/restaurant', locationRestaurant); // Ruta para procesar la UBICACION del restaurante
app.use('/api/attractions', attractionsRoutes); // Ruta para procesar las atracciones
app.use('/api/restaurants', restaurantsRoutes); // Ruta para procesar los restaurantes


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

connectDB();


// cuando me dice que una ruta no esta definida, verifica que la ruta este definida en el archivo app.js arriba de todo.
