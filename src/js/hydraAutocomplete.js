export const hydraAutocomplete = {
    // Sources (générateurs de base)
    sources: [
      { text: 'noise()', displayText: 'noise' },
      { text: 'voronoi()', displayText: 'voronoi' },
      { text: 'osc()', displayText: 'osc' },
      { text: 'shape()', displayText: 'shape' },
      { text: 'gradient()', displayText: 'gradient' },
      { text: 'solid()', displayText: 'solid' },
      { text: 'src()', displayText: 'src' },
      // lib-noise sources
      { text: 'whitenoise()', displayText: 'whitenoise' },
      { text: 'colornoise()', displayText: 'colornoise' },
      { text: 'unoise()', displayText: 'unoise' },
      { text: 'turb()', displayText: 'turb' },
      { text: 'uturb()', displayText: 'uturb' },
      { text: 'warp()', displayText: 'warp' },
      { text: 'cwarp()', displayText: 'cwarp' },
      { text: 'ncontour()', displayText: 'ncontour' },
      // op-art patterns sources (lib-pattern)
      { text: 'brick()', displayText: 'brick' },
      { text: 'checker()', displayText: 'checker' },
      { text: 'concentric()', displayText: 'concentric' },
      { text: 'hextile()', displayText: 'hextile' },
      { text: 'lissa()', displayText: 'lissa' },
      { text: 'pulse()', displayText: 'pulse' },
      { text: 'pulsetrain()', displayText: 'pulsetrain' },
      { text: 'spiral()', displayText: 'spiral' },
      { text: 'wave()', displayText: 'wave' },
      // Soft patterns sources (lib-softpattern)
    { text: 'blinking()', displayText: 'blinking' },
    { text: 'blobs()', displayText: 'blobs' },
    { text: 'concentric()', displayText: 'concentric' }, // Attention: même nom, vérifiez si besoin d'une distinction
    { text: 'phasenoise()', displayText: 'phasenoise' },
    { text: 'sdfmove()', displayText: 'sdfmove' },
    { text: 'smoothsun()', displayText: 'smoothsun' }
    ],
    
    initSources: [
      { text: 's0.initCam()', displayText: 'SrcWebCam' },
      { text: 's0.initImage()', displayText: 'SrcImage' },
      { text: 's0.initVideo()', displayText: 'SrcVideo' },
      { text: 's0.initScreen()', displayText: 'SrcScreen' },
    ],

    // Transformations (modificateurs)
    transformations: [
      { text: 'add()', displayText: 'add' },
      { text: 'sub()', displayText: 'sub' },
      { text: 'mult()', displayText: 'mult' },
      { text: 'blend()', displayText: 'blend' },
      { text: 'diff()', displayText: 'diff' },
      { text: 'layer()', displayText: 'layer' },
      { text: 'mask()', displayText: 'mask' },
      { text: 'modulateRepeat()', displayText: 'modulateRepeat' },
      { text: 'modulateRepeatX()', displayText: 'modulateRepeatX' },
      { text: 'modulateRepeatY()', displayText: 'modulateRepeatY' },
      { text: 'modulateRotate()', displayText: 'modulateRotate' },
      { text: 'modulateScale()', displayText: 'modulateScale' },
      { text: 'modulatePixelate()', displayText: 'modulatePixelate' },
      { text: 'modulateHue()', displayText: 'modulateHue' },
      { text: 'modulateKaleid()', displayText: 'modulateKaleid' },
      { text: 'modulateScrollX()', displayText: 'modulateScrollX' },
      { text: 'modulateScrollY()', displayText: 'modulateScrollY' },
      { text: 'modulate()', displayText: 'modulate' },
      { text: 'out()', displayText: 'out' },
    ],
    
    // Effets (modificateurs visuels)
    effects: [
      { text: 'brightness()', displayText: 'brightness' },
      { text: 'contrast()', displayText: 'contrast' },
      { text: 'color()', displayText: 'color' },
      { text: 'colorama()', displayText: 'colorama' },
      { text: 'sum()', displayText: 'sum' },
      { text: 'r()', displayText: 'r' },
      { text: 'g()', displayText: 'g' },
      { text: 'b()', displayText: 'b' },
      { text: 'a()', displayText: 'a' },
      { text: 'invert()', displayText: 'invert' },
      { text: 'luma()', displayText: 'luma' },
      { text: 'posterize()', displayText: 'posterize' },
      { text: 'saturate()', displayText: 'saturate' },
      { text: 'hue()', displayText: 'hue' },
      { text: 'shift()', displayText: 'shift' },
      { text: 'thresh()', displayText: 'thresh' },
      { text: 'kaleid()', displayText: 'kaleid' },
      { text: 'pixelate()', displayText: 'pixelate' },
      { text: 'repeat()', displayText: 'repeat' },
      { text: 'repeatX()', displayText: 'repeatX' },
      { text: 'repeatY()', displayText: 'repeatY' },
      { text: 'rotate()', displayText: 'rotate' },
      { text: 'scale()', displayText: 'scale' },
      { text: 'scroll()', displayText: 'scroll' },
      { text: 'scrollX()', displayText: 'scrollX' },
      { text: 'scrollY()', displayText: 'scrollY' },
    ],
    
    // Fonctions utilitaires
    utilities: [
      { text: 'render()', displayText: 'render' },
      { text: 'update', displayText: 'update' },
      { text: 'setResolution()', displayText: 'setResolution' },
      { text: 'setFunction()', displayText: 'setFunction' },
      { text: 'setBins()', displayText: 'setBins' },
      { text: 'setCutoff()', displayText: 'setCutoff' },
      { text: 'setSmooth()', displayText: 'setSmooth' },
      { text: 'setScale()', displayText: 'setScale' },
      { text: 'hide()', displayText: 'hide' },
      { text: 'show()', displayText: 'show' },
    ],
    
    // Fonctions mathématiques et temporelles
    mathFunctions: [
      { text: '()=>Math.sin(time)', displayText: 'time' },
      { text: '()=> mouse.x/width, ()=>mouse.y/height', displayText: 'mouse' },
      { text: '()=>a.fft[0]', displayText: 'a.fft' },
      { text: 'Math.sin()', displayText: 'sin' },
      { text: 'Math.cos()', displayText: 'cos' },
      { text: 'Math.tan()', displayText: 'tan' },
      { text: 'Math.random()', displayText: 'random' },
      { text: 'Math.PI', displayText: 'Math.PI' },
    ],

    arrayMethods: [
      { text: 'smooth()', displayText: 'smooth' },
      { text: 'fast()', displayText: 'fast' },
    ],
    
    // Fonction principale d'autocomplétion pour Hydra
hint: function(cm, CodeMirror) {
  const cursor = cm.getCursor();
  const token = cm.getTokenAt(cursor);
  const line = cm.getLine(cursor.line);
  const cursorPosition = cursor.ch;
  const beforeCursor = line.slice(0, cursorPosition);
  const afterCursor = line.slice(cursorPosition);
  
  // Toutes les suggestions disponibles
  const allSuggestions = [
    ...this.sources,
    ...this.transformations,
    ...this.effects,
    ...this.utilities,
    ...this.mathFunctions,
    ...this.arrayMethods
  ];
  
  // Si la ligne est vide ou commence, suggérer les sources
  if (beforeCursor.trim() === '') {
    return {
      list: [...[{text:"", displayText: "--Sources--"}], ...this.sources,...[{text:"", displayText: "--InitSources--"}], ...this.initSources, ...[{text:"", displayText: "--Utilities--"}], ...this.utilities],
      from: CodeMirror.Pos(cursor.line, 0),
      to: CodeMirror.Pos(cursor.line, cursor.ch)
    };
  }

  // Vérifier si on est à l'intérieur de parenthèses
  const insideParentheses = (function() {
    // Compter les parenthèses ouvrantes et fermantes avant le curseur
    const openCount = (beforeCursor.match(/\(/g) || []).length;
    const closeCount = (beforeCursor.match(/\)/g) || []).length;
    return openCount > closeCount;
  })();
  
  // Si on est à l'intérieur de parenthèses, suggérer les fonctions mathématiques et sources
  if (insideParentheses) {
    const prefix = beforeCursor.split('(').pop().trim();
    const suggestionList = [...[{text:"", displayText: "--Sources--"}], ...this.sources, ...[{text:"", displayText: "--Math--"}], ...this.mathFunctions, ];
    const suggestions = suggestionList.filter(
      item => item.displayText.startsWith(prefix)
    );
    
    return {
      list: suggestions,
      from: CodeMirror.Pos(cursor.line, beforeCursor.lastIndexOf('(') + 1),
      to: CodeMirror.Pos(cursor.line, cursorPosition)
    };
  }
  
  // Détection de différents patterns avant un point
  const isIndentedDot = /^\s+\./.test(beforeCursor);
  const isArrayWithDot = /\]\s*\.\s*\w*$/.test(beforeCursor);
  
  // Si nous avons un array suivi d'un point
  if (isArrayWithDot) {
    const arrayDotMatch = beforeCursor.match(/\]\s*\.\s*(\w*)$/);
    const prefix = arrayDotMatch ? arrayDotMatch[1] : '';
    
    // Filtrer les suggestions de méthodes d'array
    const suggestions = this.arrayMethods.filter(
      item => prefix ? item.displayText.startsWith(prefix) : true
    );
    
    return {
      list: suggestions,
      from: CodeMirror.Pos(cursor.line, beforeCursor.lastIndexOf('.') + 1),
      to: CodeMirror.Pos(cursor.line, cursorPosition)
    };
  }
  
  // Si nous sommes sur une ligne indentée commençant par un point
  if (isIndentedDot) {
    // Extraire le préfixe après le point
    const indentedDotMatch = beforeCursor.match(/^\s+\.\s*(\w*)$/);
    const prefix = indentedDotMatch ? indentedDotMatch[1] : '';
    
    // Chercher dans les lignes précédentes pour détecter le contexte
    let lineIndex = cursor.line - 1;
    let isArrayContext = false;
    
    // Remonter pour vérifier si nous sommes dans un contexte d'array
    while (lineIndex >= Math.max(0, cursor.line - 5)) {
      const prevLine = cm.getLine(lineIndex);
      if (prevLine && prevLine.includes(']')) {
        isArrayContext = true;
        break;
      }
      if (prevLine && (prevLine.includes('osc(') || prevLine.includes('noise(') || 
                       prevLine.includes('shape(') || /\.\w+\(/.test(prevLine))) {
        break;
      }
      lineIndex--;
    }
    
    // Suggérer en fonction du contexte
    let suggestions;
    if (isArrayContext) {
      suggestions = this.arrayMethods.filter(
        item => prefix ? item.displayText.startsWith(prefix) : true
      );
    } else {
      suggestions = [...this.transformations, ...this.effects].filter(
        item => prefix ? item.displayText.startsWith(prefix) : true
      );
    }
    
    return {
      list: suggestions,
      from: CodeMirror.Pos(cursor.line, beforeCursor.lastIndexOf('.') + 1),
      to: CodeMirror.Pos(cursor.line, cursorPosition)
    };
  }
  
  // Détection standard des points dans la même ligne
  const dotPattern = /(\w+(?:\([^)]*\))?|\[\s*[^\]]*\s*\])\s*\.\s*(\w*)$/;
  const dotMatch = beforeCursor.match(dotPattern);
  
  if (dotMatch) {
    const prefix = dotMatch[2] || '';
    const isArray = dotMatch[1].trim().startsWith('[');
    
    // Suggérer en fonction du type de l'objet avant le point
    const suggestions = isArray 
      ? this.arrayMethods.filter(item => prefix ? item.displayText.startsWith(prefix) : true)
      : [...this.transformations, ...this.effects].filter(item => prefix ? item.displayText.startsWith(prefix) : true);
    
    return {
      list: suggestions,
      from: CodeMirror.Pos(cursor.line, cursorPosition - prefix.length),
      to: CodeMirror.Pos(cursor.line, cursorPosition)
    };
  }
  
  // Pour les autres cas, filtrer toutes les suggestions basées sur le préfixe
  const wordPattern = /(\w+)$/;
  const wordMatch = beforeCursor.match(wordPattern);
  
  if (wordMatch) {
    const prefix = wordMatch[1] || '';
    const suggestions = allSuggestions.filter(
      item => item.displayText.startsWith(prefix)
    );
    
    return {
      list: suggestions.length > 0 ? suggestions : allSuggestions,
      from: CodeMirror.Pos(cursor.line, cursorPosition - prefix.length),
      to: CodeMirror.Pos(cursor.line, cursorPosition)
    };
  }
  
  // Par défaut, retourner toutes les suggestions
  return {
    list: allSuggestions,
    from: CodeMirror.Pos(cursor.line, token.start),
    to: CodeMirror.Pos(cursor.line, token.end)
  };
}
  };