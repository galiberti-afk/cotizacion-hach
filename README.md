# Landing - Consulta Técnica

## Cómo usar en Visual Studio Code
Abrí la carpeta `landing/` completa en VS Code (con la extensión "Live Server" podés
hacer clic derecho sobre `index.html` → "Open with Live Server" para verla en el navegador).

## Estructura
```
landing/
├── index.html          → estructura de la página
├── css/
│   └── style.css        → todos los estilos
├── js/
│   ├── data.js           → catálogo (categorías, subcategorías, modelos, reactivos)
│   └── app.js             → lógica del formulario (pasos, validaciones, envío)
└── img/                    → ACÁ van todas tus fotos (ver lista abajo)
```

## Imágenes que tenés que agregar en /img
Con los nombres exactos de tu carpeta raíz. Revisá que la extensión sea `.jpg`
(si alguna imagen es `.png` o `.jpeg`, cambiá esa línea en `js/data.js`).

**Generales**
- logo.png → logo de la navbar
- hero.jpg → foto grande del panel izquierdo (pantalla principal)
- gracias.jpg → foto de la pantalla final de agradecimiento

**Categorías**
- Laboratorio.jpg
- Portatiles.jpg
- Reactivos y consumibles.jpg

**Subcategorías**
- Espectofotometros.jpg
- Turbidimetros.jpg
- Reactores digitales.jpg
- Tituladores.jpg
- DBO.jpg
- Colorimetros.jpg
- electroquimica.jpg

**Modelos**
- DR6000.jpg
- DR3900.jpg
- DR1900.jpg
- TL serie.jpg
- TU5200.jpg
- 2100Q.jpg
- DBR200.jpg
- AT1000.jpg
- Digital Tritrator.jpg
- Bodtrak.jpg
- LBOD.jpg
- DR900.jpg
- DR300.jpg
- HQ Serie.jpg
- Pocket Pro.jpg

Si una imagen no se encuentra, el formulario automáticamente muestra un ícono de
respaldo en su lugar, así que nunca se rompe el diseño mientras vas cargando fotos.

## Configuración de envío de mail (EmailJS)
Abrí `js/app.js` y completá estas 3 líneas con tus datos de
https://dashboard.emailjs.com/admin :
```js
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
```
El destino ya está configurado a **galiberti@meditecna.com.ar**.

## Editar el catálogo
Todo el contenido del formulario (categorías, subcategorías, modelos, características
y reactivos) está en `js/data.js`, en un solo objeto `CATALOG`. Para agregar, sacar o
modificar un producto, alcanza con editar ese archivo — no hace falta tocar `app.js`.

## Cambios de esta versión
- Arreglados los checkboxes de "Reactivos y Consumibles" (el problema era que el
  `<label>` disparaba el toggle del checkbox dos veces: una vez el navegador de forma
  nativa, y otra vez el código. Ahora se escucha el evento `change` del checkbox en
  lugar de togglear manualmente).
- El alto del módulo del formulario ya no es fijo: se ajusta automáticamente al
  contenido de cada pantalla (la pantalla de categorías, con pocas opciones, ya no
  deja un espacio vacío grande abajo).
- Catálogo actualizado según la planilla de productos/características que enviaste
  (Espectrofotómetros, Turbidímetros, Reactores Digitales, Tituladores, DBO,
  Colorímetros, Electroquímica y la lista de Reactivos y Consumibles).
