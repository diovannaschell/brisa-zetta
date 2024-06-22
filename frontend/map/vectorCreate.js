import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

export function vectorCreate() {
  // Cria a fonte do vetor
  const vectorSource = new VectorSource();

  // Cria a camada do vetor
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  return {
    vectorSource,
    vectorLayer
  }
}
