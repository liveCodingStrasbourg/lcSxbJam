import { EventEmitter } from './eventBus.js';
import Hydra from 'hydra-synth';
import { logsUtils } from './logs.js';

export const hydraUtils = {
  hydra: null,
  isInitialized: false,
  extensionsLoaded: false,

  // Initialisation d'Hydra
  init: function() {
    if (this.isInitialized) return;

    if (typeof Hydra !== 'undefined') {
      this.setupHydra();
      this.isInitialized = true;
      return;
    }

  },

  // Configuration d'Hydra sur l'élément canvas
  setupHydra: function() {
    const canva = document.getElementById('canva');
    
    canva.style.pointerEvents = 'auto';
    canva.style.backgroundColor = 'transparent';
    
    // Initialiser Hydra
    this.hydra = new Hydra({
      canvas: canva,
      detectAudio: true,
      enableStreamCapture: true,
      width: canva.clientWidth,
      height: canva.clientHeight
    });
    eval('setResolution(canva.clientWidth, canva.clientHeight)');
    eval('a.show()');
    window.hydraSynth = this.hydra;
    this.loadHydraExtensions();

    // const script = document.createElement('script');
    // script.src = 'src/js/hydra_extra_shader.js'; 
    // script.onload = () => {
    //   console.log('Shader definitions loaded');
    // };
    // script.onerror = () => {
    //   console.error('Erreur lors du chargement du shader externe');
    // };
    // document.head.appendChild(script);

    EventEmitter.on('hydra:evaluate', this.evaluateCode.bind(this));
    EventEmitter.on('hydra:remoteEvaluate', this.evaluateRemoteCode.bind(this));
    
  },

  // load Hydra extensions dynamically
  async loadHydraExtensions() {
        if (this.extensionsLoaded) return;
        
        try {
            console.log('🔄 Loading Hydra extensions...');
            
            await import('./hydra_extra_shader.js');
            console.log('✅ Hydra Extra Shaders loaded');
            
            await import('./hydraFractal.js');
            console.log('✅ Hydra Fractals loaded');
            
            await import('./antlia-math.js');
            console.log('✅ Hydra Antlia Math loaded');

            await import('./antlia-shape.js');
            console.log('✅ Hydra Antlia Shapes loaded');

            await import('./hydraFCS.js');
            console.log('✅ Hydra FCS loaded');

            await import('./databending.js');
            console.log('✅ Hydra Databending loaded');

            this.extensionsLoaded = true;
            console.log('🎉 All Hydra extensions loaded successfully!');
                        
        } catch (error) {
            console.error('❌ Error loading Hydra extensions:', error);
        }
    },

  toggleHydra: function() {    
    const hydraSwitch = document.getElementById('hydraSwitch');
    const hydraStatus = hydraSwitch.checked;
    hydraSwitch.checked = !hydraStatus;
    if (hydraSwitch) {
      const event = new Event('change', { bubbles: true });
      hydraSwitch.dispatchEvent(event);
    }
  },

  stopHydra: function() {
        eval('hush()');
  },

  // Évaluer le code Hydra
  evaluateCode: function(code) {
    if (!this.isInitialized) return;
    try {
      eval(code);
      EventEmitter.emit('hydra:broadcast', {code});

      // Log succès
      EventEmitter.emit('log:add', {
        type: 'success',
        message: 'Code Hydra exécuté'
      });
    } catch (error) {
      // Log erreur
      logsUtils.appendLog(`Hydra: ${error}`, "red");
      EventEmitter.emit('log:add', {
        type: 'error',
        message: `Erreur Hydra: ${error.message}`
      });
    }
  },

  evaluateRemoteCode: function(code) {
    if (!this.isInitialized) return;
    try {
      eval(code);
    } catch (error) {
      console.error('Erreur lors de l\'évaluation du code distant:', error);
    }}
};