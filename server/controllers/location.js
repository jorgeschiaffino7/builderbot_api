/* const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Attraction = require('../models/attraction');
const Restaurant = require('../models/restaurant');
//const Bar = require('../models/bar');
//const MedicalCenter = require('../models/medicalCenter');


exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude, categories } = req.body;

        // Validar que haya al menos una categoría seleccionada
        if (!categories || categories.length === 0) {
            return res.status(400).json({
                messages: [
                    {
                        type: "to_user",
                        content: "🚫 Por favor, selecciona al menos una categoría para buscar opciones cercanas (por ejemplo, 'atractivos', 'restaurantes')."
                    }
                ]
            });
        }

        const RADIO_LIMITE = 10; // Radio límite en kilómetros

        // Mapear las categorías a sus modelos correspondientes
        const categoryModels = {
            atractivos: Attraction,
            restaurantes: Restaurant
           // bares: Bar,
           // centros medicos: MedicalCenter,
        };

        const results = [];

        // Procesar cada categoría seleccionada
        for (const category of categories) {
            const Model = categoryModels[category.toLowerCase()];
            if (!Model) continue; // Si la categoría no es válida, la ignoramos

            const items = await Model.find({});
            const distances = await Promise.all(items.map(async (item) => {
                const distance = await distanceCalculator(latitude, longitude, item.latitude, item.longitude);
                const travelTime = await getTravelTime(latitude, longitude, item.latitude, item.longitude);
                return {
                    category,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    distance,
                    travelTime,
                };
            }));

            // Filtrar lugares dentro del radio y ordenar por distancia
            const itemsInRadius = distances
                .filter(item => item.distance <= RADIO_LIMITE)
                .sort((a, b) => a.distance - b.distance);

            results.push(...itemsInRadius);
        }

        // Verificar si hay resultados en alguna categoría
        if (results.length === 0) {
            return res.json({
                messages: [
                    {
                        type: "to_user",
                        content: "😞 No encontramos opciones cercanas dentro de un radio de 10 km para las categorías seleccionadas. 🚗"
                    }
                ]
            });
        }

        // Crear mensajes personalizados para cada resultado
        const messages = results.map(result => ({
            type: "to_user",
            content: `📍 *${result.name}* (${result.category}):  
🛣️ Se encuentra a ${result.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${result.travelTime || 'No disponible'} 🚗.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${result.latitude},${result.longitude}&travelmode=driving)`
        }));

        // Enviar la respuesta al CRM
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: "🗺️ Aquí tienes las opciones más cercanas para las categorías seleccionadas:"
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error("Error al procesar la ubicación:", error);
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
                key: process.env.GOOGLE_MAPS_API_KEY,
            }
        });

        // Extraer la duración del viaje (formato legible, como '15 mins')
        const travelTime = response.data.routes[0]?.legs[0]?.duration?.text;
        return travelTime || 'No disponible';
    } catch (error) {
        console.error('Error obteniendo el tiempo de viaje:', error.message);
        return 'No disponible';
    }
} */


/* ******************************SEGUNDA VERSION  ********************************************************************** */

/* 
const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Attraction = require('../models/attraction');
const Restaurant = require('../models/restaurant');
//const Bar = require('../models/bar');
//const MedicalCenter = require('../models/medicalCenter');

exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude, categories } = req.body;


        // Convertir "categories" en un array si es un string
        const categoriesArray = Array.isArray(categories)
            ? categories
            : categories.split(",").map((cat) => cat.trim().toLowerCase());

        // Validar que haya al menos una categoría seleccionada
        if (!categoriesArray || categoriesArray.length === 0) {
            return res.status(400).json({
                messages: [
                    {
                        type: "to_user",
                        content: "🚫 Por favor, selecciona al menos una categoría para buscar opciones cercanas (por ejemplo, 'A', 'R')."
                    }
                ]
            });
        }

        const RADIO_LIMITE = 10; // Radio límite en kilómetros

        // Mapear las categorías a sus modelos correspondientes
        const categoryModels = {
            a: Attraction,
            r: Restaurant,
            //bares: Bar,
            //centros medicos: MedicalCenter,
        };

        const results = [];

        // Procesar cada categoría seleccionada
        for (const category of categoriesArray) {
            const Model = categoryModels[category];
            if (!Model) continue; // Ignorar categorías no válidas

            const items = await Model.find({});
            const distances = await Promise.all(items.map(async (item) => {
                const distance = await distanceCalculator(latitude, longitude, item.latitude, item.longitude);
                const travelTime = await getTravelTime(latitude, longitude, item.latitude, item.longitude);
                return {
                    category,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    distance,
                    travelTime,
                };
            }));

            // Filtrar lugares dentro del radio y ordenar por distancia
            const itemsInRadius = distances
                .filter(item => item.distance <= RADIO_LIMITE)
                .sort((a, b) => a.distance - b.distance);

            results.push(...itemsInRadius);
        }

        // Verificar si hay resultados en alguna categoría
        if (results.length === 0) {
            return res.json({
                messages: [
                    {
                        type: "to_user",
                        content: "😞 No encontramos opciones cercanas dentro de un radio de 10 km para las categorías seleccionadas. 🚗"
                    }
                ]
            });
        }

        // Crear mensajes personalizados para cada resultado
        const messages = results.map(result => ({
            type: "to_user",
            content: `📍 *${result.name}* (${result.category}):  
🛣️ Se encuentra a ${result.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${result.travelTime || 'No disponible'} 🚗.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${result.latitude},${result.longitude}&travelmode=driving)`
        }));

        // Enviar la respuesta al CRM
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: "🗺️ Aquí tienes las opciones más cercanas para las categorías seleccionadas:"
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error("Error al procesar la ubicación:", error);
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
                key: process.env.GOOGLE_MAPS_API_KEY,
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

/****************************** FIN DE LA SEGUNDA VERSION   **************************************************** */ 




/* ******** TERCERA VERSION ACTUALIZADA CON GOOGLE PLACES API RATINGS AND OPENING HOURS-SIN BASE DE DATOS********************************************************************** */

const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios'); 
const Attraction = require('../models/attraction');
const Restaurant = require('../models/restaurant');
//const Bar = require('../models/bar');
//const MedicalCenter = require('../models/medicalCenter');

exports.processLocation = async (req, res) => {
    try {
        //TODO: NO AGREGAR LA VALIDACION DE LATITUD Y LONGITUD... TRAE PROBLEMAS.
        const { latitude, longitude, categories } = req.body;

        // Convertir "categories" en un array si es un string
        const categoriesArray = Array.isArray(categories)
            ? categories
            : categories.split(",").map((cat) => cat.trim().toLowerCase());

        // Validar que haya al menos una categoría seleccionada
        if (!categoriesArray || categoriesArray.length === 0) {
            return res.status(400).json({
                messages: [
                    {
                        type: "to_user",
                        content: "🚫 Por favor, selecciona al menos una categoría para buscar opciones cercanas (por ejemplo, 'A', 'R')."
                    }
                ]
            });
        }

        const RADIO_LIMITE = 10; // Radio límite en kilómetros
        const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const results = [];

        // Mapear categorías a modelos y Google Places types
        const categoryModels = {
            a: { model: Attraction, googleType: "tourist_attraction" },
            r: { model: Restaurant, googleType: "restaurant" },
            //bares: { model: Bar, googleType: "bar" },
            //"centros medicos": { model: MedicalCenter, googleType: "hospital" },
        };

        for (const category of categoriesArray) {
            const config = categoryModels[category];
            if (!config) continue;

            // Consulta a Google Places Nearby Search
            const placesResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                {
                    params: {
                        location: `${latitude},${longitude}`,
                        radius: RADIO_LIMITE * 1000, // Convertir a metros
                        type: config.googleType,
                        key: GOOGLE_PLACES_API_KEY,
                    }
                }
            );

            const places = placesResponse.data.results;

            // Procesar cada lugar devuelto por Google Places
            for (const place of places) {
                const distance = await distanceCalculator(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng);
                const travelTime = await getTravelTime(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng);
                const isOpen = place.opening_hours?.open_now ? "Sí" : "No";
                const rating = place.rating || "Sin valoración";

                if (distance <= RADIO_LIMITE) {
                    results.push({
                        category,
                        name: place.name,
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                        distance,
                        travelTime,
                        isOpen,
                        rating,
                    });
                }
            }
        }

        // Verificar si hay resultados
        if (results.length === 0) {
            return res.json({
                messages: [
                    {
                        type: "to_user",
                        content: "😞 No encontramos opciones cercanas dentro de un radio de 10 km para las categorías seleccionadas. 🚗"
                    }
                ]
            });
        }

        // Crear mensajes personalizados
        const messages = results.map(result => ({
            type: "to_user",
            content: `📍 *${result.name}* (${result.category}):  
🛣️ Se encuentra a ${result.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${result.travelTime || 'No disponible'} 🚗.  
⭐ Valoración: ${result.rating}.  
🕒 Abierto ahora: ${result.isOpen}.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${result.latitude},${result.longitude}&travelmode=driving)`
        }));

        // Enviar respuesta
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: "🗺️ Aquí tienes las opciones más cercanas para las categorías seleccionadas:"
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error("Error al procesar la ubicación:", error);
        res.status(500).json({
            error: 'Error al procesar la ubicación'
        });
    }
};

// Función para obtener tiempo estimado de viaje
async function getTravelTime(originLat, originLng, destLat, destLng) {
    const { Client } = require('@googlemaps/google-maps-services-js');
    const client = new Client({});

    try {
        const response = await client.directions({
            params: {
                origin: `${originLat},${originLng}`,
                destination: `${destLat},${destLng}`,
                mode: 'driving',
                key: process.env.GOOGLE_MAPS_API_KEY,
            }
        });

        return response.data.routes[0]?.legs[0]?.duration?.text || 'No disponible';
    } catch (error) {
        console.error('Error obteniendo el tiempo de viaje:', error.message);
        return 'No disponible';
    }
}



/* ****************************** FIN DE LA TERCERA VERSION ********************************************************************** */



/* *** INICIO CUARTA VERSION ACTUALIZADA CON DATOS DE LA *BASE DE DATOS* CON GOOGLE PLACES API RATINGS AND OPENING HOURS    ******** */

/* const distanceCalculator = require('../utils/distanceCalculator');
const axios = require('axios');
const Attraction = require('../models/attraction');
const Restaurant = require('../models/restaurant');
const Bar = require('../models/bar');
const MedicalCenter = require('../models/medicalCenter');

exports.processLocation = async (req, res) => {
    try {
        const { latitude, longitude, categories } = req.body;

        // Validar coordenadas
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            return res.status(400).json({
                messages: [
                    {
                        type: "to_user",
                        content: "🚫 Las coordenadas deben ser números válidos (latitud y longitud)."
                    }
                ]
            });
        }

        // Convertir "categories" en un array si es un string
        const categoriesArray = Array.isArray(categories)
            ? categories
            : categories.split(",").map((cat) => cat.trim().toLowerCase());

        if (!categoriesArray || categoriesArray.length === 0) {
            return res.status(400).json({
                messages: [
                    {
                        type: "to_user",
                        content: "🚫 Por favor, selecciona al menos una categoría para buscar opciones cercanas (por ejemplo, 'atractivos', 'restaurantes')."
                    }
                ]
            });
        }

        const RADIO_LIMITE = 10; // Radio límite en kilómetros
        const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const results = [];

        // Mapear categorías a modelos
        const categoryModels = {
            atractivos: Attraction,
            restaurantes: Restaurant,
            bares: Bar,
            "centros medicos": MedicalCenter,
        };

        for (const category of categoriesArray) {
            const Model = categoryModels[category];
            if (!Model) continue;

            // Obtener datos desde la base de datos
            const items = await Model.find({});
            for (const item of items) {
                const distance = await distanceCalculator(latitude, longitude, item.latitude, item.longitude);
                if (distance > RADIO_LIMITE) continue;

                // Consultar Google Places para obtener detalles adicionales (rating y estado abierto)
                const googleResponse = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                    {
                        params: {
                            location: `${item.latitude},${item.longitude}`,
                            radius: 50, // Usamos un radio pequeño para obtener solo ese lugar
                            keyword: item.name, // Filtrar por nombre del lugar
                            key: GOOGLE_PLACES_API_KEY,
                        }
                    }
                );

                const place = googleResponse.data.results[0]; // Usar el primer resultado si coincide
                const rating = place?.rating || "Sin valoración";
                const isOpen = place?.opening_hours?.open_now ? "Sí" : "No disponible";

                const travelTime = await getTravelTime(latitude, longitude, item.latitude, item.longitude);

                results.push({
                    category,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    distance,
                    travelTime,
                    rating,
                    isOpen,
                });
            }
        }

        // Verificar si hay resultados
        if (results.length === 0) {
            return res.json({
                messages: [
                    {
                        type: "to_user",
                        content: "😞 No encontramos opciones cercanas dentro de un radio de 10 km para las categorías seleccionadas. 🚗"
                    }
                ]
            });
        }

        // Crear mensajes personalizados
        const messages = results.map(result => ({
            type: "to_user",
            content: `📍 *${result.name}* (${result.category}):  
🛣️ Se encuentra a ${result.distance.toFixed(2)} km de tu ubicación.  
⏱️ Tiempo estimado de viaje: ${result.travelTime || 'No disponible'} 🚗.  
⭐ Valoración: ${result.rating}.  
🕒 Abierto ahora: ${result.isOpen}.  
🌐 [Ver ruta en Google Maps](https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${result.latitude},${result.longitude}&travelmode=driving)`
        }));

        // Enviar respuesta
        res.json({
            messages: [
                {
                    type: "to_user",
                    content: "🗺️ Aquí tienes las opciones más cercanas para las categorías seleccionadas:"
                },
                ...messages
            ]
        });
    } catch (error) {
        console.error("Error al procesar la ubicación:", error);
        res.status(500).json({
            error: 'Error al procesar la ubicación'
        });
    }
};

// Función para obtener tiempo estimado de viaje
async function getTravelTime(originLat, originLng, destLat, destLng) {
    const { Client } = require('@googlemaps/google-maps-services-js');
    const client = new Client({});

    try {
        const response = await client.directions({
            params: {
                origin: `${originLat},${originLng}`,
                destination: `${destLat},${destLng}`,
                mode: 'driving',
                key: process.env.GOOGLE_MAPS_API_KEY,
            }
        });

        return response.data.routes[0]?.legs[0]?.duration?.text || 'No disponible';
    } catch (error) {
        console.error('Error obteniendo el tiempo de viaje:', error.message);
        return 'No disponible';
    }
}
 */


/* ****************************** FIN DE LA CUARTA VERSION ********************************************************************** */