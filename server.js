const express = require('express');
const path = require('path');
const axios = require('axios');
// Cargar variables de entorno al inicio del archivo
require('dotenv').config(); 

const app = express();

// Configuración de variables de entorno con valores de respaldo
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Variables globales para APIs
// Se elimina el texto 'TU_CLAVE_AQUI' para forzar el uso de variables de entorno seguras
app.locals.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; 
app.locals.openStreetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// --- RUTAS ---

// Ruta Principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Comparación de APIs de Mapas',
    googleMapsApiKey: app.locals.googleMapsApiKey,
    initialLocation: {
      lat: 20.2575,
      lng: -97.9536,
      name: 'Xicotepec de Juárez, Puebla'
    }
  });
});

// Ruta para Geocodificación (Dirección -> Coordenadas)
app.get('/geocode', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Dirección requerida' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'GeolocationComparisonApp/1.0' }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      res.json({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name,
        success: true
      });
    } else {
      res.status(404).json({ error: 'Dirección no encontrada', success: false });
    }
  } catch (error) {
    console.error('Error en geocodificación:', error);
    res.status(500).json({ error: 'Error en el servidor', success: false });
  }
});

// Ruta para Geocodificación Inversa (Coordenadas -> Dirección)
app.get('/reverse-geocode', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Coordenadas requeridas' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat: lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'GeolocationComparisonApp/1.0' }
    });

    if (response.data) {
      res.json({
        address: response.data.display_name,
        success: true
      });
    } else {
      res.status(404).json({ error: 'Dirección no encontrada', success: false });
    }
  } catch (error) {
    console.error('Error en reverse geocoding:', error);
    res.status(500).json({ error: 'Error en el servidor', success: false });
  }
});

// Inicio del servidor con logs informativos de entorno
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Servidor activo en modo: ${NODE_ENV}`);
  console.log(` URL Local: http://localhost:${PORT}`);
  // Verificación de seguridad de la API Key
  if (app.locals.googleMapsApiKey) {
    console.log(` Estado API: Google Maps Key detectada en .env ✅`);
  } else {
    console.log(` Estado API: Google Maps Key NO DETECTADA ❌`);
  }
  console.log(`=================================================`);
});