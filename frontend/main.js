import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';

import addPoint from './point/addPoint';


// Cria a fonte do vetor
const vectorSource = new VectorSource();
// Cria a camada do vetor
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const conda = [-52.607841411111295, -27.104277128503973]

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
