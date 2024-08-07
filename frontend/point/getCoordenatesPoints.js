// const host = 'http://192.168.1.114:3030';
const host = 'http://localhost:3030';
import axios from 'axios';

import addPoint from './addPoint';

export default async (vectorSource, heatmapSource) => {
  const url = `${host}/coordenates`;
  const options = {
    validateStatus: () => true
  };
  const { data, status } = await axios.get(url, options);

  for (const coordenate of data.points) {
    const location = coordenate.location.coordinates
    const persona = {
      name: coordenate.nome
    }
    const point = addPoint(location, persona);

    vectorSource.addFeature(point);
    heatmapSource.addFeature(point);
    
  }
}
