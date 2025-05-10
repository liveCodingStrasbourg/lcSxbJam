import CodeMirror from 'codemirror';

const sources = {
  noise: 'noise(scale, offset)\nGénère un bruit de Perlin. \nscale: échelle du bruit (défaut: 10)\noffset: décalage du bruit (défaut: 0.1)',
  voronoi: 'voronoi(scale, speed, blending)\nGénère un motif de Voronoi. \nscale: échelle du motif (défaut: 5)\nspeed: vitesse d\'animation (défaut: 0.3)\nblending: lissage des bordures (défaut: 0.3)',
  osc: 'osc(frequency, sync, offset)\nOscillateur sinusoïdal. \nfrequency: fréquence des oscillations (défaut: 60)\nsync: synchronisation (défaut: 0.1)\noffset: décalage de phase (défaut: 0)',
  shape: 'shape(sides, radius, smoothing)\nCrée une forme géométrique. \nsides: nombre de côtés (défaut: 3)\nradius: rayon de la forme (défaut: 0.3)\nsmoothing: lissage des bords (défaut: 0.01)',
  gradient: 'gradient(speed)\nGénère un gradient animé. \nspeed: vitesse d\'animation (défaut: 0)',
  solid: 'solid(r, g, b, a)\nCrée une couleur unie. \nr,g,b: composantes de couleur (0-1)\na: canal alpha (défaut: 1)',
  src: 'src(input)\nRécupère une source vidéo. \ninput: nom de la source (o0-o3, s0-s3)',
};

const initSources = {
  'initCam': 's0.initCam()\nInitialise la webcam comme source vidéo',
  'initImage': 's0.initImage(url)\nInitialise une image comme source vidéo',
  'initVideo': 's0.initVideo(url)\nInitialise une vidéo comme source vidéo',
  'initScreen': 's0.initScreen()\nInitialise la capture d\'écran comme source vidéo',
};

const transformations = {
  add: 'add(texture, amount)\nAdditionne une texture avec une autre. \ntexture: texture à ajouter \namount: force de l\'addition (défaut: 1)',
  sub: 'sub(texture, amount)\nSoustrait une texture d\'une autre. \ntexture: texture à soustraire \namount: force de la soustraction (défaut: 1)',
  mult: 'mult(texture, amount)\nMultiplie une texture avec une autre. \ntexture: texture multiplicative \namount: force de la multiplication (défaut: 1)',
  blend: 'blend(texture, amount)\nMélange une texture avec une autre. \ntexture: texture à mélanger \namount: force du mélange (défaut: 0.5)',
  diff: 'diff(texture)\nCrée la différence absolue entre deux textures. \ntexture: texture à comparer',
  layer: 'layer(texture)\nSuperpose une texture sur une autre. \ntexture: texture à superposer',
  mask: 'mask(texture)\nMasque une texture avec une autre. \ntexture: texture de masquage (noir = transparent, blanc = opaque)',
  modulate: 'modulate(texture, amount)\nModule les coordonnées UV avec une texture. \ntexture: texture de modulation \namount: intensité de modulation (défaut: 0.1)',
  modulateRepeat: 'modulateRepeat(texture, repeatX, repeatY, offsetX, offsetY)\nRépète la texture en utilisant la luminosité d\'une autre. \ntexture: texture de modulation \nrepeatX/Y: nombre de répétitions (défaut: 3) \noffsetX/Y: décalage (défaut: 0.5)',
  modulateRotate: 'modulateRotate(texture, multiple, offset)\nFait tourner la texture en fonction de la luminosité d\'une autre. \ntexture: texture de modulation \nmultiple: multiplicateur de rotation (défaut: 1) \noffset: décalage de rotation (défaut: 0)',
  modulateScale: 'modulateScale(texture, multiple, offset)\nRedimensionne la texture en fonction de la luminosité d\'une autre. \ntexture: texture de modulation \nmultiple: multiplicateur d\'échelle (défaut: 1) \noffset: décalage d\'échelle (défaut: 1)',
  modulatePixelate: 'modulatePixelate(texture, multiple, offset)\nPixellise la texture en fonction de la luminosité d\'une autre. \ntexture: texture de modulation \nmultiple: multiplicateur de pixellisation (défaut: 10) \noffset: décalage de pixellisation (défaut: 3)',
  modulateKaleid: 'modulateKaleid(texture, nSides)\nApplique un effet kaléidoscope modulé. \ntexture: texture de modulation \nnSides: nombre de côtés (défaut: 4)',
  modulateScrollX: 'modulateScrollX(texture, scrollX, speed)\nDéfilement horizontal modulé. \ntexture: texture de modulation \nscrollX: quantité de défilement (défaut: 0.5) \nspeed: vitesse de défilement (défaut: 0)',
  modulateScrollY: 'modulateScrollY(texture, scrollY, speed)\nDéfilement vertical modulé. \ntexture: texture de modulation \nscrollY: quantité de défilement (défaut: 0.5) \nspeed: vitesse de défilement (défaut: 0)',
  out: 'out(buffer)\nEnvoie le résultat vers un buffer de sortie. \nbuffer: buffer de destination (o0-o3, défaut: o0)',
};

const effects = {
  brightness: 'brightness(amount)\nAjuste la luminosité. \namount: niveau de luminosité (défaut: 0.4)',
  contrast: 'contrast(amount)\nAjuste le contraste. \namount: niveau de contraste (défaut: 1.6)',
  color: 'color(r, g, b)\nAjuste les couleurs RGB. \nr, g, b: multiplicateurs des canaux (défaut: 1)',
  colorama: 'colorama(amount)\nDécale les couleurs HSV. \namount: intensité du décalage (défaut: 0.005)',
  invert: 'invert(amount)\nInverse les couleurs. \namount: intensité d\'inversion (défaut: 1)',
  luma: 'luma(threshold, tolerance)\nFiltre par luminosité. \nthreshold: seuil (défaut: 0.5) \ntolerance: tolérance (défaut: 0.1)',
  posterize: 'posterize(bins, gamma)\nRéduit le nombre de couleurs. \nbins: nombre de niveaux (défaut: 3) \ngamma: ajustement gamma (défaut: 0.6)',
  saturate: 'saturate(amount)\nAjuste la saturation. \namount: niveau de saturation (défaut: 2)',
  hue: 'hue(amount)\nDécale la teinte. \namount: quantité de décalage (défaut: 0.4)',
  thresh: 'thresh(threshold, tolerance)\nSeuille les pixels. \nthreshold: seuil (défaut: 0.5) \ntolerance: tolérance (défaut: 0.04)',
  kaleid: 'kaleid(nSides)\nEffet kaléidoscope. \nnSides: nombre de côtés (défaut: 4)',
  pixelate: 'pixelate(pixelX, pixelY)\nPixellise l\'image. \npixelX, pixelY: taille des pixels (défaut: 20, 20)',
  repeat: 'repeat(repeatX, repeatY, offsetX, offsetY)\nRépète l\'image. \nrepeatX, repeatY: nombre de répétitions (défaut: 3, 3) \noffsetX, offsetY: décalage (défaut: 0, 0)',
  repeatX: 'repeatX(reps, offset)\nRépète l\'image horizontalement. \nreps: nombre de répétitions (défaut: 3) \noffset: décalage (défaut: 0)',
  repeatY: 'repeatY(reps, offset)\nRépète l\'image verticalement. \nreps: nombre de répétitions (défaut: 3) \noffset: décalage (défaut: 0)',
  rotate: 'rotate(angle, speed)\nFait tourner l\'image. \nangle: angle en radians (défaut: 10) \nspeed: vitesse de rotation (défaut: 0)',
  scale: 'scale(amount, xMult, yMult, offsetX, offsetY)\nRedimensionne l\'image. \namount: taille (défaut: 1.5) \nxMult, yMult: multiplicateurs x/y (défaut: 1, 1) \noffsetX, offsetY: décalage du centre (défaut: 0.5, 0.5)',
  scrollX: 'scrollX(scrollX, speed)\nDéfilement horizontal. \nscrollX: quantité de défilement (défaut: 0.5) \nspeed: vitesse (défaut: 0)',
  scrollY: 'scrollY(scrollY, speed)\nDéfilement vertical. \nscrollY: quantité de défilement (défaut: 0.5) \nspeed: vitesse (défaut: 0)',
};

const utilities = {
  render: 'render(buffer)\nAffiche un buffer à l\'écran. \nbuffer: buffer à rendre (défaut: o0)',
  update: 'update = callback => {...}\nAjoute une fonction à exécuter à chaque frame',
  setResolution: 'setResolution(width, height)\nAjuste la résolution du canvas',
  setFunction: 'setFunction(objects)\nDéfinit des fonctions personnalisées',
  setBins: 'setBins(numBins)\nDéfinit le nombre de bins pour l\'analyse audio',
  setCutoff: 'setCutoff(cutoff)\nDéfinit la valeur seuil pour l\'analyse audio',
  setSmooth: 'setSmooth(smooth)\nDéfinit le lissage pour l\'analyse audio',
  setScale: 'setScale(scale)\nDéfinit l\'échelle pour l\'analyse audio',
  hide: 'hide()\nMasque le canvas',
  show: 'show()\nAffiche le canvas',
};

const arrayMethods = {
  smooth: 'array.smooth()\nLisse les transitions entre valeurs dans un tableau',
  fast: 'array.fast(speed)\nContrôle la vitesse de changement des valeurs. \nspeed: vitesse (défaut: 1)',
  ease: 'array.ease(easing)\nApplique une fonction d\'accélération/décélération. \neasing: type d\'easing (défaut: "linear")',
  offset: 'array.offset(amount)\nDécale les valeurs par une constante. \namount: valeur de décalage',
  fit: 'array.fit(low, high)\nRedimensionne les valeurs dans une plage. \nlow, high: plage de destination',
};

const mathFunctions = {
  time: 'time\nVariable qui s\'incrémente automatiquement',
  mouse: 'mouse\nPosition de la souris (x et y entre 0 et 1)',
  'a.fft': 'a.fft[index]\nAccède à l\'analyse fréquentielle audio',
  sin: 'Math.sin(x)\nCalcule le sinus de x',
  cos: 'Math.cos(x)\nCalcule le cosinus de x',
  tan: 'Math.tan(x)\nCalcule la tangente de x',
  random: 'Math.random()\nGénère un nombre aléatoire entre 0 et 1',
  'Math.PI': 'Math.PI\nConstante π (3.14159...)',
};

const definitions = { 
  ...sources, 
  ...initSources, 
  ...transformations, 
  ...effects, 
  ...utilities, 
  ...arrayMethods, 
  ...mathFunctions 
};

function showHydraDefinition(cm) {
  const cursor = cm.getCursor();
  const token = cm.getTokenAt(cursor);
  const word = token.string;

  // Supprimer les tooltips existants
  const existingTooltips = document.querySelectorAll('.CodeMirror-tooltip');
  existingTooltips.forEach(tooltip => removeTooltip(tooltip));

  // Vérifier si le mot est une fonction ou une méthode
  // Pour les méthodes comme "array.smooth()", on extrait "smooth"
  let lookupWord = word;
  
  if (word.includes('.')) {
    const parts = word.split('.');
    lookupWord = parts[parts.length - 1];
  }
  
  // Chercher la définition
  if (definitions[lookupWord]) {
    const definition = definitions[lookupWord];
    const tooltip = makeTooltip(cm, cursor, definition);
    setTimeout(() => removeTooltip(tooltip), 7000); // Supprimer le tooltip après 7 secondes
  }
}

function makeTooltip(cm, pos, content) {
  const tooltip = document.createElement('div');
  tooltip.className = 'CodeMirror-tooltip hydra-tooltip';
  tooltip.textContent = content;
  document.body.appendChild(tooltip);

  const left = cm.cursorCoords(pos, 'page').left;
  const rightEdge = left + tooltip.offsetWidth;
  const pageWidth = document.documentElement.clientWidth;

  if (rightEdge > pageWidth) {
    tooltip.style.left = `${pageWidth - tooltip.offsetWidth - 16}px`;
  } else {
    tooltip.style.left = `${left}px`;
  }

  tooltip.style.top = `${cm.cursorCoords(pos, 'page').bottom}px`;
  return tooltip;
}

function removeTooltip(tooltip) {
  if (tooltip && tooltip.parentNode) {
    tooltip.parentNode.removeChild(tooltip);
  }
}

export { showHydraDefinition };