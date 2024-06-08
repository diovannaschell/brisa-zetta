import 'ol/ol.css';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import getCoordenatesPoints from './point/getCoordenatesPoints';
import { mapconfig } from './map/mapConfig';

// Cria a fonte do vetor
const vectorSource = new VectorSource();
// Cria a camada do vetor
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const galeao = [-43.25747587604714, -22.811305750000002]

mapconfig(vectorLayer, galeao);

getCoordenatesPoints(vectorSource);
