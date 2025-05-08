# LcSxb Jam - un éditeur collaboratif pour FoxDot et Hydra spécialement conçu pour les jams de LiveCoding Strasbourg
## Basé sur WebTroop de CrashServer

## Préréquis
- nodejs
- FoxDot
- SuperCollider

## Installation

```bash
git clone
cd lcSxbJam
npm install
```

## Configuration
Copier le fichier `config_sample.json` en `config.json` et modifier les paramètres en fonction de votre configuration
Les ports n'ont pas besoin d'être modifiés si vous n'avez pas de conflit.


## Utilisation

### Lancer le serveur

```bash
node server.js
```

### lancer le server de synchro websocket pour pair-programming
    
    ```bash
    dans \webTroop
    HOST=0.0.0.0 PORT=4444 YPERSISTENCE=./dbDir node ./node_modules/y-websocket/bin/server.cjs
    ```

### lancer le client

```bash
npm run dev
```
### Se connecter

Ouvrir un navigateur et se connecter à l'adresse `http://localhost:3000`
