const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Restaurant = require('../models/restaurant');

exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const RADIO_LIMITE = 10; // Radio límite en kilómetros

        // Calcular distancias a los atractivos turísticos
        const restaurants = await Restaurant.find({});
        const distances = await Promise.all(restaurants.map(async (restaurant) => {
            const distance = await distanceCalculator(latitude, longitude, restaurant.latitude, restaurant.longitude);
            const travelTime = await getTravelTime(latitude, longitude, restaurant.latitude, restaurant.longitude);
            return {
                name: restaurant.name,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
                distance,
                travelTime
            };
        }));

        // Filtrar atractivos dentro del radio y ordenar por distancia
        const restaurantsInRadius = distances
            .filter(attraction => attraction.distance <= RADIO_LIMITE)
            .sort((a, b) => a.distance - b.distance);

        // Crear mensajes personalizados para cada atractivo
        const messages = restaurantsInRadius.map(restaurant => ({
            type: "to_user",
            content: `📍 *${restaurant.name}*:  
🛣️ Se encuentra a ${restaurant.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${restaurant.travelTime || 'No disponible'}.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${restaurant.latitude},${restaurant.longitude}&travelmode=driving)`
        }));

        // Enviar la respuesta al CRM
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: `🗺️ Aquí tienes los restaurantes más cercanos y el tiempo estimado de viaje:`
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la ubicación' });
    }
};

// Función para obtener tiempo estimado de viaje usando Google Maps Directions API
async function getTravelTime(originLat, originLng, destLat, destLng) {
    const { Client } = require('@googlemaps/google-maps-services-js');
    const client = new Client({});

    try {
        const response = await client.directions({
            params: {
                origin: `${originLat},${originLng}`,
                destination: `${destLat},${destLng}`,
                mode: 'driving',
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        // Extraer la duración del viaje (formato legible, como '15 mins')
        const travelTime = response.data.routes[0]?.legs[0]?.duration?.text;
        return travelTime || 'No disponible';
    } catch (error) {
        console.error('Error obteniendo el tiempo de viaje:', error.message);
        return 'No disponible';
    }
}   
