/* const distanceCalculator = require('../utils/distanceCalculator');
//const { google } = require('@googlemaps/google-maps-services-js');
//const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require('axios');
const Attraction = require('../models/attraction');

exports.processLocation = async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      const RADIO_LIMITE = 10; // Radio límite en kilómetros
  
      // Calcular distancias a los atractivos turísticos
      const attractions = await Attraction.find({});
      const distances = await Promise.all(attractions.map(async (attraction) => {
        const distance = await distanceCalculator(latitude, longitude, attraction.latitude, attraction.longitude);
        return {
          name: attraction.name,
          latitude: attraction.latitude,
          longitude: attraction.longitude,
          distance
        };
      }));
  
      // Filtrar atractivos dentro del radio y ordenar por distancia
      const attractionsInRadius = distances
        .filter(attraction => attraction.distance <= RADIO_LIMITE)
        .sort((a, b) => a.distance - b.distance);
  
      // Generar URL de Google Maps con marcadores solo para atractivos en el radio
      const mapUrl = await generateGoogleMapsUrl(latitude, longitude, attractionsInRadius);
  
      res.json({ 
        userLocation: { latitude, longitude }, 
        attractions: attractionsInRadius,
        mapUrl 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la ubicación' });
    }
};



async function generateGoogleMapsUrl(userLatitude, userLongitude, attractions) {
    const { Client } = require('@googlemaps/google-maps-services-js');
    const client = new Client({});
    
    // Construir la URL base de la API Static Maps
    let baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    
    // Parámetros básicos
    const params = new URLSearchParams({
        center: `${userLatitude},${userLongitude}`,
        zoom: '10',
        size: '600x400',
        key: process.env.GOOGLE_MAPS_API_KEY
    });

    // Agregar marcador para la ubicación del usuario
    params.append('markers', `color:red|${userLatitude},${userLongitude}`);

    // Agregar marcadores para las atracciones
    attractions.forEach(attraction => {
        params.append('markers', `color:blue|label:A|${attraction.latitude},${attraction.longitude}`);
    });

    return `${baseUrl}?${params.toString()}`;
}


 */

/* *********************************FIN DE LA PRIMERA SOLUCION**   *************************************************** */

/* *********************************INICIO DE LA SEGUNDA SOLUCION***************************************************** */

/* const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Attraction = require('../models/attraction');

exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const RADIO_LIMITE = 10; // Radio límite en kilómetros

        // Calcular distancias a los atractivos turísticos
        const attractions = await Attraction.find({});
        const distances = await Promise.all(attractions.map(async (attraction) => {
            const distance = await distanceCalculator(latitude, longitude, attraction.latitude, attraction.longitude);
            return {
                name: attraction.name,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                distance
            };
        }));

        // Filtrar atractivos dentro del radio y ordenar por distancia
        const attractionsInRadius = distances
            .filter(attraction => attraction.distance <= RADIO_LIMITE)
            .sort((a, b) => a.distance - b.distance);

        // Generar URL de Google Maps con marcadores solo para atractivos en el radio
        const mapUrl = await generateGoogleMapsUrl(latitude, longitude, attractionsInRadius);

        // Crear mensajes personalizados para cada atractivo
        const messages = attractionsInRadius.map(attraction => ({
            type: "to_user",
            content: `📍 *${attraction.name}*: Se encuentra a ${attraction.distance.toFixed(2)} km de tu ubicación. 
🌐 [Ver ubicación en Google Maps](https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude})`
        }));

        // Enviar la respuesta al CRM
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: `🗺️ Aquí tienes el mapa con los atractivos más cercanos: [Mapa estático](${mapUrl})`
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la ubicación' });
    }
};

async function generateGoogleMapsUrl(userLatitude, userLongitude, attractions) {
    const { Client } = require('@googlemaps/google-maps-services-js');
    const client = new Client({});

    // Construir la URL base de la API Static Maps
    let baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';

    // Parámetros básicos
    const params = new URLSearchParams({
        center: `${userLatitude},${userLongitude}`,
        zoom: '10',
        size: '600x400',
        key: process.env.GOOGLE_MAPS_API_KEY
    });

    // Agregar marcador para la ubicación del usuario
    params.append('markers', `color:red|label:U|${userLatitude},${userLongitude}`);

    // Agregar marcadores para las atracciones
    attractions.forEach(attraction => {
        params.append('markers', `color:blue|label:${attraction.name.charAt(0).toUpperCase()}|${attraction.latitude},${attraction.longitude}`);
    });

    return `${baseUrl}?${params.toString()}`;
} */

/* *********************************FIN DE LA SEGUNDA SOLUCION***************************************************** */




/* *********************************INICIO DE LA TERCERA SOLUCION***************************************************** */

/* 
const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Attraction = require('../models/attraction');

exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude} = req.body;


        const RADIO_LIMITE = 10; // Radio límite en kilómetros

        // Calcular distancias a los atractivos turísticos
        const attractions = await Attraction.find({});
        const distances = await Promise.all(attractions.map(async (attraction) => {
            const distance = await distanceCalculator(latitude, longitude, attraction.latitude, attraction.longitude);
            const travelTime = await getTravelTime(latitude, longitude, attraction.latitude, attraction.longitude);
            return {
                name: attraction.name,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                distance,
                travelTime
            };
        }));

        // Filtrar atractivos dentro del radio y ordenar por distancia
        const attractionsInRadius = distances
            .filter(attraction => attraction.distance <= RADIO_LIMITE)
            .sort((a, b) => a.distance - b.distance);

        // Crear mensajes personalizados para cada atractivo
        const messages = attractionsInRadius.map(attraction => ({
            type: "to_user",
            content: `📍 *${attraction.name}*:  
🛣️ Se encuentra a ${attraction.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${attraction.travelTime || 'No disponible'}.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${attraction.latitude},${attraction.longitude}&travelmode=driving)`
        }));

        // Enviar la respuesta al CRM
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: `🗺️ Aquí tienes los atractivos más cercanos y el tiempo estimado de viaje:`
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
 */



/* *********************************FIN DE LA TERCERA SOLUCION***************************************************** */



/* *********************************INICIO DE LA CUARTA SOLUCION***************************************************** */
/* 
const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Attraction = require('../models/attraction');

exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude, atractivos } = req.body;

        // Validar el keyword "atractivo"
        if (!atractivos || atractivos.toLowerCase() !== "b") {
            return res.status(400).json({
                messages: [
                    {
                        type: "to_user",
                        content: "🚫 Por favor, indica 'atractivo' como respuesta para buscar opciones cercanas. 🗺️"
                    }
                ]
            });
        }

        const RADIO_LIMITE = 10; // Radio límite en kilómetros

        // Calcular distancias a los atractivos turísticos
        const attractions = await Attraction.find({});
        const distances = await Promise.all(attractions.map(async (attraction) => {
            const distance = await distanceCalculator(latitude, longitude, attraction.latitude, attraction.longitude);
            const travelTime = await getTravelTime(latitude, longitude, attraction.latitude, attraction.longitude);
            return {
                name: attraction.name,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                distance,
                travelTime
            };
        }));

        // Filtrar atractivos dentro del radio y ordenar por distancia
        const attractionsInRadius = distances
            .filter(attraction => attraction.distance <= RADIO_LIMITE)
            .sort((a, b) => a.distance - b.distance);

        // Crear mensajes personalizados para cada atractivo
        const messages = attractionsInRadius.map(attraction => ({
            type: "to_user",
            content: `📍 *${attraction.name}*:  
🛣️ Se encuentra a ${attraction.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${attraction.travelTime || 'No disponible'} 🚗.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${attraction.latitude},${attraction.longitude}&travelmode=driving)`
        }));

        // Verificar si hay atractivos dentro del radio
        if (attractionsInRadius.length === 0) {
            return res.json({
                messages: [
                    {
                        type: "to_user",
                        content: "😞 No encontramos atractivos turísticos cerca de tu ubicación dentro de un radio de 10 km. 🗺️"
                    }
                ]
            });
        }

        // Enviar la respuesta al CRM
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: `🗺️ Aquí tienes los atractivos turísticos más cercanos y el tiempo estimado de viaje:`
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error("Error al procesar atractivos:", error);
        res.status(500).json({
            error: 'Error al procesar la ubicación'
        });
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
 */

/* *********************************FIN DE LA CUARTA SOLUCION***************************************************** */
