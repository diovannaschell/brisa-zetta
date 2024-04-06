// Crie um mapa no elemento com ID "map"
var mymap = L.map('map').setView([-27.1001, -52.6156], 13); // Coordenadas de Chapecó, SC

// Adicione um mapa base (usando OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 18,
}).addTo(mymap);

// Adicione um marcador
var marker = L.marker([-27.1001, -52.6156]).addTo(mymap);
marker.bindPopup("Chapecó, Santa Catarina").openPopup();
