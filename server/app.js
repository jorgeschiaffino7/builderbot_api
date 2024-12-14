const express = require('express');
const mongoose = require('mongoose');
const locationRoutes = require('./routes/locationRoutes');
const attractionsRoutes = require('./routes/attractionsRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');

dotenv.config();

const app = express();

// Conectar a MongoDB
/* mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});  */

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/location', locationRoutes);
app.use('/api/attractions', attractionsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

connectDB();


