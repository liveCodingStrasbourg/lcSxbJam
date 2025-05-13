import { EventEmitter } from './eventBus.js';
import Hydra from 'hydra-synth';
import { logsUtils } from './logs.js';

export const hydraUtils = {
  hydra: null,
  isInitialized: false,

  // Initialisation d'Hydra
  init: function() {
    if (this.isInitialized) return;

    if (typeof Hydra !== 'undefined') {
      this.setupHydra();
      this.isInitialized = true;
      return;
    }

    // Chargement de la bibliothèque Hydra-Synth (via CDN)
    // return new Promise((resolve, reject) => {
    //   const script = document.createElement('script');
    //   script.src = 'https://unpkg.com/hydra-synth';
    //   script.onload = () => {
    //     this.setupHydra();
    //     this.isInitialized = true;
    //     resolve();
    //   };
    //   script.onerror = reject;
    //   document.head.appendChild(script);
    // });
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
      enableStreamCapture: true
    });
    
    EventEmitter.on('hydra:evaluate', this.evaluateCode.bind(this));
    EventEmitter.on('hydra:remoteEvaluate', this.evaluateRemoteCode.bind(this));
    
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