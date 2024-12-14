
const Attraction = require('../models/attraction');

exports.createAttraction = async (req, res) => {
    try {
        const { name, description, latitude, longitude, imageUrl } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!name || !latitude || !longitude) {
            return res.status(400).json({ 
                error: 'Los campos nombre, latitud y longitud son obligatorios' 
            });
        }

        // Crear nueva atracción
        const newAttraction = new Attraction({
            name,
            description,
            latitude,
            longitude,
            imageUrl
        });

        // Guardar en la base de datos
        await newAttraction.save();

        res.status(201).json({
            message: 'Atracción creada exitosamente',
            attraction: newAttraction
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al crear la atracción turística' 
        });
    }
};

exports.getAllAttractions = async (req, res) => {
    try {
        const attractions = await Attraction.find();
        res.json(attractions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al obtener las atracciones turísticas' 
        });
    }
};

exports.getAttractionById = async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id);
        if (!attraction) {
            return res.status(404).json({ 
                error: 'Atracción no encontrada' 
            });
        }
        res.json(attraction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al obtener la atracción turística' 
        });
    }
};

exports.updateAttraction = async (req, res) => {
    try {
        const { name, description, latitude, longitude, imageUrl } = req.body;
        const updatedAttraction = await Attraction.findByIdAndUpdate(
            req.params.id,
            { name, description, latitude, longitude, imageUrl },
            { new: true }
        );
        
        if (!updatedAttraction) {
            return res.status(404).json({ 
                error: 'Atracción no encontrada' 
            });
        }
        
        res.json({
            message: 'Atracción actualizada exitosamente',
            attraction: updatedAttraction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al actualizar la atracción turística' 
        });
    }
};

exports.deleteAttraction = async (req, res) => {
    try {
        const deletedAttraction = await Attraction.findByIdAndDelete(req.params.id);
        
        if (!deletedAttraction) {
            return res.status(404).json({ 
                error: 'Atracción no encontrada' 
            });
        }
        
        res.json({
            message: 'Atracción eliminada exitosamente',
            attraction: deletedAttraction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al eliminar la atracción turística' 
        });
    }
};

