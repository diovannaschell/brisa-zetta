import { Style, Icon } from 'ol/style';

export default new Style({
  image: new Icon({
    anchor: [0.5, 1],
    src: '../assets/point.webp', // URL do ícone do pin
    scale: 0.02 // Escala para ajustar o tamanho do ícone
  }),
});