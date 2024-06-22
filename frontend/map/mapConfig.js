import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OGCMapTile, OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';

export function mapconfig(vectorLayer, initialPoint) {
  // constrói o mapa do Open Street Map
  const tileLayer = new TileLayer({
    source: new OSM(),
  });

  // constrói o mapa do gnosis
  const rasterLayer = new TileLayer({
    source: new OGCMapTile({
      url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
      crossOrigin: '',
    })
  });

  // define como será exibida a primeira visualização do mapa
  const view = new View({
    center: fromLonLat(initialPoint),
    zoom: 14,
  });

  // Cria o mapa
  const map = new Map({
    layers: [tileLayer, vectorLayer],
    target: document.getElementById('map'),
    view: view,
  });

  return map;
}