import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';

import getCoordenatesPoints from './point/getCoordenatesPoints';

// Cria a fonte do vetor
const vectorSource = new VectorSource();
// Cria a camada do vetor
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const galeao = [-43.25747587604714, -22.811305750000002]

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
    center: fromLonLat(galeao),
    zoom: 14,
  }),
});

getCoordenatesPoints(vectorSource);
