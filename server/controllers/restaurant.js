const Restaurant = require('../models/restaurant');

exports.createRestaurant = async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!name || !latitude || !longitude) {
            return res.status(400).json({ 
                error: 'Los campos nombre, latitud y longitud son obligatorios' 
            });
        }

        // Crear nueva atracción
        const newRestaurant = new Restaurant({
            name,
            latitude,
            longitude,
            
        });

        // Guardar en la base de datos
        await newRestaurant.save();

        res.status(201).json({
            message: 'Restaurante creado exitosamente',
            restaurant: newRestaurant
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al crear el restaurante' 
        });
    }
};
