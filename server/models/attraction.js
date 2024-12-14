
const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

module.exports = mongoose.model('attraction', attractionSchema);

//'attraction' es el nombre de la colección en la base de datos o tabla en la base de datos
