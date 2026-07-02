// Respaldo del logo embebido en base64: si por alguna razón 'img/logo.png' no
// carga (ruta incorrecta, mayúsculas/minúsculas, servidor mal configurado, etc.)
// el navbar va a mostrar igual tu logo real usando esta copia embebida.
const LOGO_FALLBACK_B64 = 'data:image/png;base64,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';

// ════════════════════════════════════════════════════════
//  CATÁLOGO — acá editás categorías, subcategorías, modelos
//  y las opciones de reactivos/consumibles.
//
//  Las rutas "img/..." ya están armadas con los MISMOS nombres
//  de archivo que me pasaste de tu carpeta raíz. Solo tenés que
//  copiar tus fotos dentro de la carpeta /img con esos nombres
//  exactos (revisá que la extensión sea .jpg; si alguna es .png
//  o .jpeg, cambiala en la línea correspondiente).
//
//  features: SOLO para modelos — hasta 2 características que se
//  muestran en la card del producto.
// ════════════════════════════════════════════════════════
const CATALOG = [
  {
    id: 'lab', label: 'Laboratorio', img: 'img/Laboratorio.jpg', icon: '🔬', type: 'nested',
    subcats: [
      {
        id: 'espectro', label: 'Espectrofotómetros', img: 'img/Espectofotometros.jpg', icon: '🔭',
        models: [
          { label: 'DR6000', img: 'img/DR6000.jpg', icon: '🔭', features: ['UV/Visible', 'TNT Plus'] },
          { label: 'DR3900', img: 'img/DR3900.jpg', icon: '🔭', features: ['Visible', 'TNT Plus'] },
          { label: 'DR1900', img: 'img/DR1900.jpg', icon: '🔭', features: ['Portátil', 'Visible'] },
        ]
      },
      {
        id: 'turbidimetros', label: 'Turbidímetros', img: 'img/Turbidimetros.jpg', icon: '💧',
        models: [
          { label: 'TL serie', img: 'img/TL serie.jpg', icon: '💧', features: ['Mesada', '0,01... 4000 NTU'] },
          { label: 'TU5200', img: 'img/TU5200.jpg', icon: '💧', features: ['Mesada', '0,0001... 1000 NTU'] },
          { label: '2100Q', img: 'img/2100Q.jpg', icon: '💧', features: ['Portátil', '0,1... 1000 NTU'] },
        ]
      },
      {
        id: 'reactores', label: 'Reactores Digitales', img: 'img/Reactores digitales.jpg', icon: '⚗️',
        models: [
          { label: 'DBR200', img: 'img/DBR200.jpg', icon: '⚗️', features: ['Programas precargados', 'DQO, Fósforo, Nitrógeno'] },
        ]
      },
      {
        id: 'tituladores', label: 'Tituladores', img: 'img/Tituladores.jpg', icon: '🧫',
        models: [
          { label: 'AT1000', img: 'img/AT1000.jpg', icon: '🧫', features: ['Automático', 'Acidez, Alcalinidad, Fos/Tac'] },
          { label: 'Digital Tritrator', img: 'img/Digital Tritrator.jpg', icon: '🧫', features: ['Portátil', 'Manual'] },
        ]
      },
      {
        id: 'dbo', label: 'DBO', img: 'img/DBO.jpg', icon: '🫧',
        models: [
          { label: 'Bodtrak', img: 'img/Bodtrak.jpg', icon: '🫧', features: ['6 canales independientes', 'Método respirométrico'] },
          { label: 'LBOD', img: 'img/LBOD.jpg', icon: '🫧', features: ['Método de diluciones', 'Serie Intellical'] },
        ]
      },
    ]
  },
  {
    id: 'port', label: 'Portátiles', img: 'img/Portatiles.jpg', icon: '📱', type: 'nested',
    subcats: [
      {
        id: 'colorimetros', label: 'Colorímetros', img: 'img/Colorimetros.jpg', icon: '🎨',
        models: [
          { label: 'DR900', img: 'img/DR900.jpg', icon: '🎨', features: ['Multiparámetro', 'Programas como DQO, Cloro, Hierro entre otros'] },
          { label: 'DR300', img: 'img/DR300.jpg', icon: '🎨', features: ['Monoparámetro', 'Cloro, hierro entre otros'] },
        ]
      },
      {
        id: 'electroquimica', label: 'Electroquímica', img: 'img/electroquimica.jpg', icon: '⚡',
        models: [
          { label: 'HQ Serie', img: 'img/HQ Serie.jpg', icon: '⚡', features: ['Sondas digitales', 'pH, Conductividad, Oxígeno entre otros'] },
          { label: 'Pocket Pro', img: 'img/Pocket Pro.jpg', icon: '⚡', features: ['De bolsillo', 'Sensor reemplazable'] },
        ]
      },
    ]
  },
  {
    id: 'reac', label: 'Reactivos y Consumibles', img: 'img/Reactivos y consumibles.jpg', icon: '🧪', type: 'checklist',
    options: ['Cloro','DQO','BDO','Hierro','Cobre','Sílice','Manganeso','Sulfato','Bario','Nitrógeno','Amonio','Estándares','Nitrito','Nitrato','Cromo','Zinc','Sulfuro','Otro']
  },
];
