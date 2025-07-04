// @ts-ignore
import CodeMirror from 'codemirror'
import { CodemirrorBinding } from 'y-codemirror'
import { EventEmitter } from './eventBus.js';
import { setupConfigPanel, updateHelpPanel, toggleHydraHelp, updateHydraHelp } from './configPanel.js'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness'

import 'codemirror/addon/dialog/dialog.js'
import './foxdot_mode.js'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/keymap/vim'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'

import { chatUtils } from './chatUtils.js';
import { logsUtils } from './logs.js';
import { functionUtils } from './functionUtils.js';
import { markerUtils } from './markerUtils.js';
import { foxdotAutocomplete } from './foxdotAutocomplete.js';
import { hydraAutocomplete } from './hydraAutocomplete.js';
import { showDefinition } from './foxdotDefinitions.js';
import { showHydraDefinition, removeAllTooltips } from './hydraDefinition.js';
import { hydraColorPicker } from './colorPicker.js';
import { hydraUtils } from './hydraUtils.js';

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/fold/foldgutter.css'
import '../css/style.css'
import '../css/crashpanel.css'
import '../css/configPanel.css'
import '../css/customCodeMirror.css';

document.addEventListener('DOMContentLoaded', async () => {
  // Récupération de la configuration
  const configRequest = await fetch('../../config.json');
  if (!configRequest.ok) {
    throw new Error(`HTTP error! status: ${configRequest.status}`);
  }
  const config = await configRequest.json();
  
  // Connexion aux serveurs
  const wsServer = new WebSocket(`ws://${config.HOST_IP}:1234`);
  let foxdotWs = null;
  // let foxdotWs = new WebSocket(`ws://${config.HOST_IP}:${config.FOXDOT_WS_PORT}`);

  // Récupération des éléments du DOM
  const chrono = document.getElementById('chrono');
  

  let hydra = localStorage.getItem('lcsxbjam-hydraEnabled') === 'true';
  const hydraSwitch = document.getElementById('hydraSwitch');
  const languageLabel = document.getElementById('language');
  const separator = document.getElementById('separator');
  hydraSwitch.checked = hydra;
  languageLabel.textContent = hydra ? 'Hydra' : 'FoxDot';
  separator.style.background = hydra ? 'aqua' : 'red';
  toggleHydraHelp(hydra);

  hydraSwitch.addEventListener('change', (event) => {
    hydra = event.currentTarget.checked;
    localStorage.setItem('lcsxbjam-hydraEnabled', hydra);
    separator.style.background = hydra ? 'aqua' : 'red';
    languageLabel.textContent = hydra ? 'Hydra' : 'FoxDot';
    toggleHydraHelp(hydra);
  })


  // Initialisation de YJS
  const ydoc = new Y.Doc();
  const awareness = new Awareness(ydoc);
  const provider = new WebsocketProvider(`ws://${config.HOST_IP}:4444`, 'webtroop', ydoc, {
    awareness: awareness,
  });
  const ytext = ydoc.getText('webtroop');
  const ychat = ydoc.getArray('chat');
  const ymarkers = ydoc.getArray('markers');
  const yhydra = ydoc.getMap('hydra');

  // Configuration de CodeMirror
  const editor = CodeMirror(document.getElementById('editor'), {
    mode: 'python',
    theme: 'material-darker',
    lineNumbers: true,
    autofocus: true,
    matchBrackets: true,
    autoCloseBrackets: {pairs: "()[]{}<>''\"\"", override: true},
    lineWrapping: true,
    //cursorScrollMargin: 50,
    fixedGutter: false,
    singleCursorHeightPerLine: false,
    styleActiveLine: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    keyMap: 'sublime',
  });

  // undo Manager
  const yUndoManager = new Y.UndoManager(ytext, { trackedOrigins: new Set([]) });
  // Binding YJS avec CodeMirror
  const binding = new CodemirrorBinding(ytext, editor, provider.awareness, {yUndoManager});

  // Configuration du panneau de configuration
  setupConfigPanel(awareness, editor);
  
  // Configuration des logs
  logsUtils.initResize(editor);

  EventEmitter.on('send_foxdot', (command) => {
    wsServer.send(JSON.stringify({
        type: 'evaluate_code',
        code: command
    }));
  });

  EventEmitter.on('hydra:brodcast', (data) => {
    if (data && data.code) {
      const userState = awareness.getLocalState();
      yhydra.set('latestCode', {
        code: data.code,
        userName: userState?.user?.name || 'Anonymous',
        userColor: userState?.user?.color || '#00ff00',
        timestamp: Date.now(),
      });
  }});

  //Gestion des logs FoxDot pour la console
  wsServer.onmessage = (event) => {    
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'foxdot_log') {
        logsUtils.appendLog(message.data, message.color);
        if (message.attackRequestName != ""){
          awareness.setLocalStateField('attackRequest', {"attackRequestName": message.attackRequestName});
        }
      }
    } catch (error) {
    }
  };

  // Reset du chrono lors du clic sur le chrono
  chrono.addEventListener('click', ()=> functionUtils.resetChrono(wsServer));

  function evaluateCode(cm, multi){
      var [blockCode, startLine, endLine] = functionUtils.getCodeAndCheckStop(cm, multi);

      const userState = awareness.getLocalState();
      const userName = userState.user.name;
      const userColor = userState.user.color;
      // Envoyer le code
      wsServer.send(JSON.stringify({
          type: 'evaluate_code',
          code: blockCode,
          userColor: userColor,
          userName: userName,
      }));

      foxdotWs.send(JSON.stringify({
        type: `${userName}Code`,
        code: blockCode,
      }));   
    
    // Flash effect
    awareness.setLocalStateField('flash', {
        lineStart: startLine,
        lineEnd: endLine,
        timestamp: Date.now()
    });
  }

  function evaluateCodeHydra(cm){
    var {startLine,endLine} = functionUtils.getBlock(cm, cm.getCursor().line);
    const blockCode = cm.getRange({line: startLine, ch: 0}, {line: endLine, ch: cm.getLine(endLine).length});
    const userState = awareness.getLocalState();
    const userName = userState.user.name;
    const userColor = userState.user.color;
    hydraUtils.evaluateCode(blockCode);

    yhydra.set('latestCode', {
      code: blockCode,
      userName: userName,
      userColor: userColor,
      timestamp: Date.now(),
    })

    awareness.setLocalStateField('flash', {
        lineStart: startLine,
        lineEnd: endLine,
        timestamp: Date.now()
    });
  } 
  
  // Écouter les changements dans le Y.Array des messages de chat
  ychat.observe(event => {
    event.changes.added.forEach(item => {
      const message = item.content.getContent()[0];
      chatUtils.insertChatMessage(editor, message.text, message.userName, message.userColor, message.line);
    });
    // Supprimer les anciens messages pour ne garder que les 30 plus récents
    if (ychat.length > 30) {
      ychat.delete(0, ychat.length - 30);
    }
  });

  // Écouter les changements dans le Y.Array des marqueurs
  ymarkers.observe(event => {
    event.changes.added.forEach(item => {
      const marker = item.content.getContent()[0];
      markerUtils.applyMarker(editor, marker.line, marker.color);
    });

    event.changes.deleted.forEach(item => {
      const marker = item.content.getContent()[0];
      markerUtils.removeMarker(editor, marker.line);
    });
  });

  // Écouter les changements dans le Y.Array des codes Hydra
  yhydra.observe(event => {
    if(event.keysChanged.has('latestCode')){
      const hydraData = yhydra.get('latestCode');
      const userName = awareness.getLocalState()?.user?.name;
      if( hydraData && hydraData.userName !== userName){
        EventEmitter.emit('hydra:remoteEvaluate', hydraData.code);
        // supprimer les retours à la ligne et les espaces
        const formattedCode = hydraData.code.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, '').trim();
        logsUtils.appendLog(`${hydraData.userName}: ${formattedCode}`, hydraData.userColor);
      }
    }
  });

  // Open the color picker and replace the color code
  function selectColor(cm) {
    const detection = hydraColorPicker.detectColorFunction(cm);
        
        if (detection.found) {
            hydraColorPicker.openNativeColorPicker(cm, detection, (r, g, b, detectionInfo) => {
                const newColorCode = `${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}`;
                const startPos = { line: detectionInfo.start.line, ch: detectionInfo.openParenPos };
                const endPos = { line: detectionInfo.start.line, ch: detectionInfo.closeParenPos };
                
                cm.replaceRange(newColorCode, startPos, endPos);
                evaluateCodeHydra(cm);
            });
        } else {
            console.log('Place your cursor in a .color() function to use the color picker');
        }
  } 

  // Gestion de CTRL+ENTER
  editor.setOption('extraKeys', {
    'Ctrl-;': ()=> {
      if (hydra) {
        hydraUtils.stopHydra();
      } else {
        functionUtils.stopClock(wsServer)
      }
    },
    'Ctrl-Space': 'autocomplete',
    'Ctrl-S': (cm)=> {functionUtils.saveEditorContent(cm,wsServer)},
    'Alt-X': (cm) => {
      cm.toggleComment();
      evaluateCode(cm, false);
    },
    'Ctrl-Alt-X': (cm) => {
      const {startLine, endLine} = functionUtils.getBlock(cm, cm.getCursor().line);
      cm.setSelection({line: startLine, ch: 0}, {line: endLine, ch: cm.getLine(endLine).length});
      cm.toggleComment();
      evaluateCode(cm, true);
    },
    'Alt-S': (cm) => {functionUtils.soloPlayer(cm, wsServer)},
    'Ctrl-Alt-S': () => {functionUtils.unSoloPlayers(wsServer)},
    'Alt-J': (cm) => {functionUtils.jumpToOtherPlayer(cm, awareness)},
    'Ctrl-Alt-J': (cm) => {functionUtils.previousJump(cm)},
    'Alt-1': (cm) => markerUtils.setMarker(cm, "Red", cm.getLine(cm.getCursor().line), awareness, ymarkers, ychat),
    'Alt-2': () => markerUtils.resetMarkers(ymarkers),
    'Alt-C': (cm) => {
      chatUtils.getChat(cm, "", (text, line) => {
        const userState = awareness.getLocalState();
        const userName = userState?.user?.name || 'Anonymous';
        const userColor = userState?.user?.color || '#000000';
        ychat.push([{ text, userName, userColor, line }]); // Ajouter le message au Y.Array
      });
    }, 
    // 'Ctrl-Enter': (cm) => {evaluateCode(cm, false)},
    'Ctrl-Enter': (cm) => {
      if (hydra){
        evaluateCodeHydra(cm);
      } else {
      evaluateCode(cm, true)
      }
    },
    'Alt-I': (cm) => {
      if (hydra){
        showHydraDefinition(cm);
      }
      else {
        showDefinition(cm);
            }   
    },
    'Alt-F': "findPersistent",
    'Ctrl-G': "findNext",
    'Ctrl-Alt-Left': "goLineStart",
    'Ctrl-Alt-Right': "goLineEnd",
    'Alt-Q': (cm) => cm.foldCode(cm.getCursor(), 
      {rangeFinder: (cm,start) => {
        if(!start){return null;}
        let startLine = start.line;
        let endLine = start.line + 1;
        while (startLine > 0 && !cm.getLine(startLine).trim().startsWith("#")){
          startLine--;
        }
     
        while (endLine < cm.lineCount() -1  && !cm.getLine(endLine).trim().startsWith("#")){
          endLine++;
        }

        if (startLine === endLine){
          return null;
        }

        return {
            from: CodeMirror.Pos(startLine+1, 0),
            to: CodeMirror.Pos(endLine, cm.getLine(endLine).length),
        };
      }}),
      'Ctrl-Left': (cm) => {functionUtils.goToPreviousComma(cm)},
      'Ctrl-Right': (cm) => {functionUtils.goToNextComma(cm)},
      'Alt-P': () => {document.getElementById('piano-roll').classList.toggle('hidden')},
      'Alt-Up': (cm) => {
                    functionUtils.incrementValue(cm, 1)
                    if (hydra){
                      evaluateCodeHydra(cm);
                    } else {
                      evaluateCode(cm, false);
                    }
                  },
      'Alt-Down': (cm) => {
                    functionUtils.incrementValue(cm, -1)
                    if (hydra){
                      evaluateCodeHydra(cm);
                    } else {
                      evaluateCode(cm, false)
                    }
                  },
      'Alt-A': (cm) => {functionUtils.randomizer(cm)},
      'Alt-R': (cm) => {functionUtils.resetPlayer(cm, wsServer)},
      'Alt-Y': ()=> {hydraUtils.toggleHydra()},
      'Esc': () => { removeAllTooltips(); },
      'Ctrl-K': (cm) => { selectColor(cm); },
  });

  // Gestion de l'autocomplétion
  editor.setOption('hintOptions', {
    hint: (cm) => {
      if (hydra) {
        return hydraAutocomplete.hint(cm, CodeMirror);
      } else {
        return foxdotAutocomplete.hint(cm, CodeMirror);
      }
    }
  });

  // Ajouter l'écouteur d'awareness
  awareness.on('change', () => {
    const states = awareness.getStates();
    states.forEach((state) => {
      // Gestion de l'effet flash
      if (state.flash) {
          const { lineStart, lineEnd, timestamp } = state.flash;
          // Vérifier si le flash est récent (moins de 100ms)
          if (Date.now() - timestamp < 100) {
              // Créer l'effet flash
              for (let i = lineStart; i <= lineEnd; i++) {
                  const mark = editor.markText(
                      {line: i, ch: 0},
                      {line: i, ch: editor.getLine(i).length},
                      {className: 'flash-highlight'}
                  );
                  setTimeout(() => mark.clear(), 200);
              }
          }
      }
    });
  });

  function foxDotWs(){
    foxdotWs = new WebSocket(`ws://${config.HOST_IP}:${config.FOXDOT_WS_PORT}`);
    foxdotWs.onopen = () => {
      foxdotWs.send(JSON.stringify({ type: 'get_autocomplete' }));
    };
    foxdotWs.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'attack') {
          if (awareness.getLocalState().attackRequest.attackRequestName === awareness.getLocalState().user.name){
            functionUtils.insertAttackContent(editor, message.content);
          }
        }
        else if (message.type === 'autocomplete') {
          const { loops, fxList, synthList, attackList } = functionUtils.formatFoxDotAutocomplete(message);
          // obj1.filter(i => !obj2.includes(i.id))
          const toExclude = ["__init__", "1s", ""];
          let filteredLoops = loops.filter(i => !toExclude.includes(i.displayText)); 

          foxdotAutocomplete.loopList = filteredLoops;
          foxdotAutocomplete.fxList = fxList;
          foxdotAutocomplete.synths= synthList;
          foxdotAutocomplete.attackList = attackList;
          
          filteredLoops = filteredLoops.filter(loop => !loop.displayText.startsWith('AKWF'));
          updateHelpPanel(filteredLoops, fxList, synthList);

          if (loops.length == 0 || fxList.length == 0 || synthList.length == 0 || attackList.length == 0) {
            console.error(`Erreur lors de la récupération de la liste des boucles (${loops.length}), effets (${fxList.length}), synthés (${synthList.length}) ou attaques (${attackList.length})`);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la réception de message FoxDot:', error);
      }
    };
    foxdotWs.onclose = (e) => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function() {
      foxDotWs();
      }, 1000);
    };
    foxdotWs.onerror = (err) => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      foxdotWs.close();
    };
  }

  foxDotWs();

  // Gestion de l'envoi de code en temps réel
  editor.on('cursorActivity', (cm) => {
    // Récupérer les infos utilisateur depuis awareness
    const userState = awareness.getLocalState();
    const userName = userState?.user?.name || 'Anonymous';

    // Récupérer la position du curseur et le contenu
    const cursor = cm.getCursor();
    const currentLine = cm.getLine(cursor.line);
    
    // Préparer le message
    const message = {
        type: `${userName}InstantCode`,
        position: cursor.ch,
        code: currentLine
    };

    // envoyer le message dans le live other player display
    try {
        awareness.setLocalStateField('otherInstantCode', {
          user: userName,
          code: currentLine,
          position: cursor.ch,
          line: cursor.line + 1,
        });
      } 
    catch (error) {
    }
    
    if(foxdotWs.readyState === WebSocket.OPEN) {
      foxdotWs.send(JSON.stringify(message));
    }
  });

  // Gestion de l'activation/désactivation du serveur dans CrashPanel
  crashPanelTitle.addEventListener('click', () => {
    if (foxdotWs.readyState === WebSocket.OPEN) {
      foxdotWs.send(JSON.stringify({ type: "serverToggle"}));
    }
    
    crashPanelTitle.classList.toggle('loading');
    setTimeout(() => {
      crashPanelTitle.classList.toggle('loading');
    }, 4000);
  });

  // piano insert at cursor
  document.querySelectorAll('#piano-roll .piano-key li').forEach(key => {
    key.addEventListener('click', (event) => {
        const index = event.currentTarget.dataset.index;
        if (index !== undefined) {
            insertAtCursor(index);
        }
    });
  });

  function insertAtCursor(index) {
      // insert index text at cursor position
      const cursor = editor.getCursor();
      const line = cursor.line;
      const ch = cursor.ch;
      editor.replaceRange(index+',', {line, ch}, {line, ch});
  }

  try {
    // Initialiser le module hydra
    await hydraUtils.init();
    updateHydraHelp();
    console.log('Hydra module initialized'); 
  } catch (error) {
    console.error('Error initializing Hydra module:', error);
    logsUtils.appendLog('Error initializing Hydra module: ' + error.message, 'error');
  }
});
