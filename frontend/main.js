import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate';
import addPoint from './point/addPoint';

// Cria a fonte do vetor
const vectorSource = new VectorSource();
// Cria a camada do vetor
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const conda = [-52.607841411111295, -27.104277128503973];

// Cria o mapa
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  view: new View({
    center: fromLonLat(conda),
    zoom: 12,
  }),
});

const point = addPoint(conda);

// Adiciona a feature à fonte do vetor
vectorSource.addFeature(point);

// Cria o popup
const container = document.getElementById('popup');
const popup = new Overlay({
  element: container,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});
map.addOverlay(popup);

// Adiciona o evento pointermove
map.on('pointermove', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    const coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(container).popover({
      placement: 'top',
      html: true,
      content: '<p>' + toStringHDMS(fromLonLat(conda)) + '</p>',
    });
    $(container).popover('show');
  } else {
    $(container).popover('dispose');
  }
});

document.getElementById('filterForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const segmento = document.getElementById('segmento').value;
  const nome = document.getElementById('nome').value;
  const cidade = document.getElementById('cidade').value;
  const bairro = document.getElementById('bairro').value;
  // Lógica para processar os filtros e atualizar o mapa conforme necessário
});

$(function() {
  $("#filterContainer").draggable().resizable({
    handles: "e, s, se"
  });

  $("#filterHeader").on('click', function() {
    $("#filterForm").slideToggle();
    const arrow = $("#toggleFilter").text() === "▼" ? "▲" : "▼";
    $("#toggleFilter").text(arrow);
  });
});
