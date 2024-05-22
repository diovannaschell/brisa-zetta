import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import pointStyle from './pointStyle';

export default (point) => {
  const ponto = new Point(fromLonLat(point))

  const pointFeature = new Feature({
    geometry: ponto
  })

  pointFeature.setStyle(pointStyle)

  return pointFeature
}