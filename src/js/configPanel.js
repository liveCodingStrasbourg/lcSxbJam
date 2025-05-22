import { hydraAutocomplete } from './hydraAutocomplete.js';

export function setupConfigPanel(awareness, editor) {
    const configButton = document.getElementById('configButton');
    const configPanel = document.getElementById('configPanel');
    const userNameInput = document.getElementById('userName');
    const userColorInput = document.getElementById('userColor');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontInterfaceSizeSlider = document.getElementById('fontInterfaceSizeSlider');
    const fontInterfaceSizeValue = document.getElementById('fontInterfaceSizeValue');
    const keybindingsSelect = document.getElementById('keybindingsSelect');
    const modal = document.getElementById("shortcutsModal");
    const modalbtn = document.getElementById("openModalBtn");
    const closeModal = document.getElementById("closeModal");
    const buttonValidatePlayerName = document.getElementById('validatePlayerName');
    // const themeInterface = document.getElementById('themeInterface');
    const themeInterfaceSelector = document.getElementById('themeInterfaceSelector');

    // Restaurer les données utilisateur
    const savedUser = localStorage.getItem('lcsxbjam-user');
    if (savedUser) {
        const userInfo = JSON.parse(savedUser);
        userNameInput.value = userInfo.name;
        userColorInput.value = userInfo.color;
        updateUserInfo(); // Met à jour awareness
    }

    // Keybindings restore



    const savedKeybindings = localStorage.getItem('webFoxPreferredKeybindings');
    if (savedKeybindings) {
        keybindingsSelect.value = savedKeybindings;
        editor.setOption('keyMap', savedKeybindings);
    }

    function updateUserInfo() {
        const userInfo = {
            name: userNameInput.value || 'Anonyme',
            color: userColorInput.value
        };
        
        // Sauvegarder dans localStorage
        localStorage.setItem('lcsxbjam-user', JSON.stringify(userInfo));
        
        // Mettre à jour awareness
        awareness.setLocalStateField('user', userInfo);
    }

    // Event listeners
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateUserInfo();
            userNameInput.blur();
        }
    });

    buttonValidatePlayerName.addEventListener('click', (e) => {
        e.preventDefault();
        updateUserInfo();
        userNameInput.blur();
    }
    );
    
    userColorInput.addEventListener('input', updateUserInfo);

    // Gestion du changement de police
    fontSelect.addEventListener('change', (e) => {
        const font = e.target.value;
        editor.getWrapperElement().style.fontFamily = font;
        document.body.style.fontFamily = font;
        localStorage.setItem('lcsxbjam-preferredFont', font);
    });

    // Restaurer la police sauvegardée
    const savedFont = localStorage.getItem('lcsxbjam-preferredFont');
    if (savedFont) {
        fontSelect.value = savedFont;
        editor.getWrapperElement().style.fontFamily = savedFont;
        }

    // Gestion ouverture/fermeture du panneau
    configButton.addEventListener('click', () => {
        configPanel.classList.toggle('open');
    });

    // Fermer le panneau en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!configPanel.contains(e.target) && 
            !configButton.contains(e.target) && 
            configPanel.classList.contains('open')) {
            configPanel.classList.remove('open');
        }
    });

    // Gestion du thème
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        editor.setOption('theme', theme);
        localStorage.setItem('lcsxbjam-preferredTheme', theme);
    });

    // Restaurer le thème
    const savedTheme = localStorage.getItem('lcsxbjam-preferredTheme');
    if (savedTheme) {
        editor.setOption('theme', savedTheme);
        themeSelect.value = savedTheme;
    }

    keybindingsSelect.addEventListener('change', (e) => {
        const keybindings = e.target.value;
        editor.setOption('keyMap', keybindings);
        localStorage.setItem('webFoxPreferredKeybindings', keybindings);
    });
    

    // Restaurer la taille sauvegardée
    const savedSize = localStorage.getItem('lcsxbjam-preferredFontSize');
    if (savedSize) {
        fontSizeSlider.value = savedSize;
        updateFontSize(savedSize);
    }

    const savedInterfaceSize = localStorage.getItem('lcsxbjam-preferredInterfaceFontSize');
    if (savedInterfaceSize) {
        fontInterfaceSizeSlider.value = savedInterfaceSize;
        updateInterfaceFontSize(savedInterfaceSize);
    }

    // Mettre à jour lors du changement
    fontSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        updateFontSize(size);
        });

    function updateFontSize(size) {
        // Mettre à jour l'affichage
        fontSizeValue.textContent = size;
        
        // Mettre à jour l'éditeur
        editor.getWrapperElement().style.fontSize = size + 'px';
        
        // Forcer le rafraîchissement
        editor.refresh();
        
        // Sauvegarder la préférence
        localStorage.setItem('lcsxbjam-preferredFontSize', size);
    }

    fontInterfaceSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        updateInterfaceFontSize(size);
        });
    
    function updateInterfaceFontSize(size) {
        // Mettre à jour l'affichage
        fontInterfaceSizeValue.textContent = size;
        
        // Mettre à jour l'interface
        document.documentElement.style.fontSize = size + 'px';
        
        // Sauvegarder la préférence
        localStorage.setItem('lcsxbjam-preferredInterfaceFontSize', size);
    };

    // Ouvrir la modal
    modalbtn.onclick = function() {
        modal.style.display = "block";
    }

    // Fermer la modal
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Fermer la modal en cliquant en dehors de celle-ci
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }

    // Restore the interface theme
    const savedInterfaceTheme = localStorage.getItem('lcsxbjam-selectedInterfaceTheme') || 'dark';
    document.documentElement.className = `${savedInterfaceTheme}-theme`;
    themeInterfaceSelector.value = savedInterfaceTheme;
    
    // Gérer le changement de thème
    themeInterfaceSelector.addEventListener('change', (e) => {
        const selectedInterfaceTheme = e.target.value;
        document.documentElement.className = `${selectedInterfaceTheme}-theme`;
        localStorage.setItem('lcsxbjam-selectedInterfaceTheme', selectedInterfaceTheme);
    });
    // themeInterface.addEventListener('change', (event) => {
    //     if (event.target.checked) {
    //         document.documentElement.classList.remove('light-theme');
    //     } else {
    //         document.documentElement.classList.add('light-theme');
    //     }
    //   });

    return {
        updateUserInfo() {
            const userInfo = {
                name: userNameInput.value || 'Anonyme',
                color: userColorInput.value
            };
            return userInfo;
        }
    };
}

export function updateHelpPanel(loopList, fxList, synthList) {
    document.getElementById('helpLoop').innerHTML = loopList
        .map(loop => `<span>${loop.displayText}</span>`)
        .join('');
    document.getElementById('helpFx').innerHTML = fxList
        .filter(loop => !loop.displayText.endsWith("_"))
        .map(fx => `<span>${fx.displayText}</span>`)
        .join('');
    document.getElementById('helpSynth').innerHTML = synthList
        .filter(synth => !synth.displayText.endsWith("_"))
        .map(synth => `<span>${synth.displayText}</span>`)
        .join('');
    document.getElementById('helpHydraSource').innerHTML = hydraAutocomplete.sources.map(item => `<span>${item.displayText}</span>`).join("")
    document.getElementById('helpHydraTransfo').innerHTML = hydraAutocomplete.transformations.map(item => `<span>${item.displayText}</span>`).join("")
    document.getElementById('helpHydraFx').innerHTML = hydraAutocomplete.effects.map(item => `<span>${item.displayText}</span>`).join("")
} 

export function toggleHydraHelp(hydra) {
    const hydraSource = document.getElementById('hydra-source-tab');
    const hydraTransfo = document.getElementById('hydra-transfo-tab');
    const hydraFx = document.getElementById('hydra-fx-tab');
    const foxLoops = document.getElementById('fox-loop-tab');
    const foxFx = document.getElementById('fox-fx-tab');
    const foxSynth = document.getElementById('fox-synth-tab');
    const foxinput = document.getElementById('tab-loop');
    const hydrainput = document.getElementById('tab-hydra-source');

    if (hydra) {
        hydraSource.style.display = "block";
        hydraTransfo.style.display = "block";
        hydraFx.style.display = "block";
        foxLoops.style.display = "none";
        foxFx.style.display = "none";
        foxSynth.style.display = "none";
        hydrainput.checked = true;
        foxinput.checked = false;
    } else {
        hydraSource.style.display = "none";
        hydraTransfo.style.display = "none";
        hydraFx.style.display = "none";
        foxLoops.style.display = "block";
        foxFx.style.display = "block";
        foxSynth.style.display = "block";
        foxinput.checked = true;
        hydrainput.checked = false;
    }
}
