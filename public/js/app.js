// Variables globales para el manejo de las instancias de los mapas
let googleMap;
let leafletMap;

// Arreglos para almacenar y gestionar los marcadores de cada API
let googleMarkers = [];
let leafletMarkers = [];

// Objeto para mantener la ubicación actual sincronizada con el servidor (Fase 3)
// CORRECCIÓN: Usamos el objeto global definido en index.ejs para evitar errores de sintaxis
let currentLocation = {
    lat: window.serverLocation.lat,
    lng: window.serverLocation.lng,
    name: window.serverLocation.name
};

// Contador para el registro de búsquedas realizadas en la sesión
let searchCount = 0;

// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar los contadores visuales en el dashboard
    updateStats();

    // Configurar los escuchadores de eventos (Event Listeners)
    document.getElementById('searchButton').addEventListener('click', searchLocation);
    document.getElementById('addressInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') searchLocation();
    });

    document.getElementById('currentLocationBtn').addEventListener('click', getCurrentLocation);
    document.getElementById('clearMarkersBtn').addEventListener('click', clearAllMarkers);

    // Inicializar el mapa de Leaflet
    initLeafletMap();
});

// Función para inicializar Google Maps (llamada automáticamente por la API)
function initGoogleMap() {
    const mapOptions = {
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
            { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
            { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }
        ]
    };

    googleMap = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    addGoogleMarker(currentLocation.lat, currentLocation.lng, currentLocation.name);

    googleMap.addListener('zoom_changed', () => {
        document.getElementById('googleZoom').textContent = googleMap.getZoom();
    });

    googleMap.addListener('click', (event) => {
        handleMapClick(event.latLng.lat(), event.latLng.lng());
    });
}

// Función para inicializar Leaflet
function initLeafletMap() {
    leafletMap = L.map('leafletMap').setView([currentLocation.lat, currentLocation.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(leafletMap);

    addLeafletMarker(currentLocation.lat, currentLocation.lng, currentLocation.name);

    leafletMap.on('zoomend', () => {
        document.getElementById('leafletZoom').textContent = leafletMap.getZoom();
    });

    leafletMap.on('click', (event) => {
        handleMapClick(event.latlng.lat, event.latlng.lng);
    });
}

// Función para manejar clics en el mapa y obtener dirección
async function handleMapClick(lat, lng) {
    try {
        const response = await fetch(`/reverse-geocode?lat=${lat}&lng=${lng}`);
        const data = await response.json();
        const name = data.success ? data.address : `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        addGoogleMarker(lat, lng, name);
        addLeafletMarker(lat, lng, name);
        updateLocationInfo(lat, lng, name);

        searchCount++;
        updateStats();
        showNotification(`Marcador agregado en: ${name}`, 'info');
    } catch (error) {
        console.error('Error al agregar marcador:', error);
    }
}

// Búsqueda de ubicación por texto
async function searchLocation() {
    const addressInput = document.getElementById('addressInput');
    const address = addressInput.value.trim();

    if (!address) {
        showNotification('Por favor, ingresa una dirección', 'warning');
        return;
    }

    try {
        showLoading(true);
        const response = await fetch(`/geocode?address=${encodeURIComponent(address)}`);
        const data = await response.json();

        if (data.success) {
            currentLocation = { lat: data.lat, lng: data.lng, name: data.name };
            centerBothMaps(data.lat, data.lng);
            addGoogleMarker(data.lat, data.lng, data.name);
            addLeafletMarker(data.lat, data.lng, data.name);
            updateLocationInfo(data.lat, data.lng, data.name);

            searchCount++;
            updateStats();
            showNotification(`Ubicación encontrada: ${data.name}`, 'success');
        } else {
            showNotification(data.error || 'Error al buscar la ubicación', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión con el servidor', 'error');
    } finally {
        showLoading(false);
    }
}

// Ubicación actual por GPS
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocalización no soportada', 'error');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
            const response = await fetch(`/reverse-geocode?lat=${lat}&lng=${lng}`);
            const data = await response.json();

            if (data.success) {
                currentLocation = { lat: lat, lng: lng, name: data.address };
                centerBothMaps(lat, lng);
                addGoogleMarker(lat, lng, 'Mi ubicación actual');
                addLeafletMarker(lat, lng, 'Mi ubicación actual');
                updateLocationInfo(lat, lng, 'Mi ubicación actual');
                document.getElementById('addressInput').value = data.address;
                searchCount++;
                updateStats();
                showNotification('Ubicación actual obtenida', 'success');
            }
        } finally {
            showLoading(false);
        }
    }, () => {
        showLoading(false);
        showNotification('Error al obtener ubicación GPS', 'error');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}

// Funciones de Marcadores
function addGoogleMarker(lat, lng, title) {
    if (!googleMap) return;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: googleMap,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2
        }
    });
    googleMarkers.push(marker);
    updateStats();
}

function addLeafletMarker(lat, lng, title) {
    if (!leafletMap) return;
    const leafletIcon = L.divIcon({
        html: `<div style="width: 20px; height: 20px; background-color: #199900; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        className: 'leaflet-custom-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    const marker = L.marker([lat, lng], { icon: leafletIcon, title: title }).addTo(leafletMap);
    leafletMarkers.push(marker);
    updateStats();
}

// Utilidades de Interfaz
function centerBothMaps(lat, lng) {
    if (googleMap) { googleMap.setCenter({ lat, lng }); googleMap.setZoom(14); }
    if (leafletMap) { leafletMap.setView([lat, lng], 14); }
}

function clearAllMarkers() {
    googleMarkers.forEach(m => m.setMap(null)); googleMarkers = [];
    leafletMarkers.forEach(m => leafletMap.removeLayer(m)); leafletMarkers = [];
    updateStats();
    showNotification('Todos los marcadores eliminados', 'info');
}

function updateLocationInfo(lat, lng, name) {
    document.getElementById('currentLat').textContent = lat.toFixed(6);
    document.getElementById('currentLng').textContent = lng.toFixed(6);
    document.getElementById('currentPlace').textContent = name;
}

function updateStats() {
    document.getElementById('googleMarkersCount').textContent = googleMarkers.length;
    document.getElementById('leafletMarkersCount').textContent = leafletMarkers.length;
    document.getElementById('totalSearches').textContent = searchCount;
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification'); if (existing) existing.remove();
    const colors = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500', info: 'bg-blue-500' };
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '0'; setTimeout(() => notification.remove(), 300); }, 5000);
}

function showLoading(show) {
    let overlay = document.getElementById('loadingOverlay');
    if (show && !overlay) {
        overlay = document.createElement('div'); overlay.id = 'loadingOverlay';
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        overlay.innerHTML = `<div class="bg-white p-6 rounded-lg shadow-xl flex items-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div><span>Procesando...</span></div>`;
        document.body.appendChild(overlay);
    } else if (!show && overlay) { overlay.remove(); }
}