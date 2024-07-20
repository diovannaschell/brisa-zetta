import 'ol/ol.css';
import { Overlay } from 'ol';
// import 'bootstrap';

import getCoordenatesPoints from './point/getCoordenatesPoints';
import { mapconfig } from './map/mapConfig';
import { vectorCreate } from './map/vectorCreate';

const initialPoint = [-43.25747587604714, -22.811305750000002]

const { vectorSource, vectorLayer } = vectorCreate();
const heatmapSource = new ol.source.Vector();
const map = mapconfig([vectorLayer, heatmapLayer], initialPoint);

getCoordenatesPoints(vectorSource);

const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
// display popup on click
map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  popup.setPosition(evt.coordinate);

  $(function () {
    popover = new bootstrap.Popover(element, {
      placement: 'top',
      html: true,
      content: feature.get('name'),
    });
    popover.show();
  });
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
// Close the popup when the map is moved
map.on('movestart', disposePopover);

const heatmapLayer = new Heatmap({
  source: heatmapSource,
  blur: 15,
  radius: 5,
  weight: function (feature) {
    return feature.get('ticketMedio') / 1000; // Adjust this scaling factor as needed
  },
});

// Button for toggling heatmap
document.getElementById('toggleHeatmap').addEventListener('click', function () {
  if (map.getLayers().getArray().includes(heatmapLayer)) {
    map.removeLayer(heatmapLayer);
    this.textContent = 'Mostrar Calor'; // Update button text
    this.style.backgroundColor = '#ff5722'; // Update button color
  } else {
    map.addLayer(heatmapLayer);
    this.textContent = 'Ocultar Calor'; // Update button text
    this.style.backgroundColor = '#e64a19'; // Update button color
  }
});