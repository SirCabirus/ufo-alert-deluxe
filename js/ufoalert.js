/************************************************************/
/*                       UFO Alert                          */
/*                                                          */
/* Version 27 vom 17.02.2023                                */
/*                                                          */
/* Dies Spiel ist nach dem JavaScript Tutorial für Anfänger */
/* von Junus Ergin entstanden - siehe:                      */
/* https://www.youtube.com/watch?v=eWLDAAMsD-c              */
/*                                                          */
/* Vielen Dank für dieses tolle Tutorial, das mich          */
/* motiviert hat dieses Spiel zu schreiben, welches         */
/* zahlreiche Änderungen und Erweiterungen enthält.         */
/*                                                          */
/* Frank Wolter                                             */
/* https://www.sircabirus.com/                              */
/*                                                          */
/************************************************************/

/**************************************/
/* Globale Variablen und Konstanten   */
/**************************************/

// Variablen für den Zugriff auf die Zeichenfläche
let canvas;
let ctx;

// Konstanten für das zeitliche Aufruf-Intervall von Funktionen
const changeBackgroundIntervall = 2000; // 2 Sekunden
const updateIntervall = 1000 / 25; // 40 ms
const updateLaserIntervall = 1000; // 1 Sekunde
const createSpaceStationIntervall = 30000; // 30 Sekunden 
const createMedoRocketIntervall = 45000; // 45 Sekunden
const createUfoIntervall = 3500; // 3,5 Sekunden
const checkCollisionUfoIntervall = 1000 / 50; // 20 ms
const checkCollisionSpaceStationIntervall = 1000 / 50; // 20 ms
const checkCollisionMedoRocketIntervall = 1000 / 50; // 20 ms
const checkForShootIntervall = 1000 / 10; // 100 ms
const checkEndgameIntervall = 1000; // 1 Sekunde

// Variablen um im Intervall aufgerufene Funktionen zu stoppen
let changeBackgroundHandle;
let updateHandle;
let updateLaserHandle;
let createSpaceStationHandle;
let createMedoRocketHandle;
let createUfoHandle;
let checkCollisionUfoHandle;
let checkCollisionSpaceStationHandle;
let checkCollisionMedoRocketHandle;
let checkForShootHandle;
let checkEndgameHandle;

// Variablen für Soundeffekte - es wird die Howler-Library verwendet
// damit Soundeffekte parallel abgespielt werden können
// siehe https://howlerjs.com/
let shootsnd;
let rshootsnd;
let explode;
let rockethit;
let medoRockethit;
let missilehit;
let gameOverSnd;
let xBombSnd;
let ufoEsacped;
let gameMusic;

// Flag Musik abspielen
let music = false;

// Flag Sound initialisiert
let soundInitialized = false;

// Variablen für die Tastatureingaben
let KEY_SPACE = false; // die Leertaste
let KEY_UP = false; // die 'Peil nach oben' Cursor-Taste
let KEY_DOWN = false; // die 'Pfeil nach unten' Cursor-Taste
let KEY_RIGHT = false; // die 'Pfeil nach rechts' Cursor-Taste
let KEY_LEFT = false; // die 'Pfeil nach links' Cursor-Taste
let KEY_CONTROL = false; // die STRG-Taste

// Variablen zur Ausgabe des Status
let statusLine;
let stRocket;
let stEscUfos;
let stScore;
let stXbomb;
const space = "\xa0\xa0\xa0\xa0\xa0"; // fünf Leerzeichen

// Variable für das Hintergrundbild
let backgroundImage = new Image();

// Flag ob eine Kollision mit einem Ufo stattgefunden hat
let collision = false;

// aktuelle Anzahl Raketen
let rockets = 3;
// Vertikale und horizontale Geschwindigkeit der Rakete
const rocketSpeed = 8;

// aktuelle Anzahl X-Bombe
let xBombCnt = 1;

// Vertikale Geschwindigkeit der X-Bombe
const xBombSpeed = 20;

// Laser-Status
const laserMax = 10; // maximaler Laser-Vorrat - multipliziert mit 10 ergibt Prozentanzeige
let laserCount = laserMax; // aktueller Laser-Vorrat

// Geschwindigkeit der Raumstation
const spaceStationSpeed = 4;

// Treffer der Raumstation bis zur Explosion
const spaceStationMaxHits = 6;

// Missile der Raumstation
let spaceStationMissile;

// Flag ob Missile aktiv
let spaceStationMissileActive = false;

// Anzahl Punkte ab der erste Medo-Rocket erscheint - wird nach jeder Medo-Rocket hochgezählt
let medoRocketScore = 1000;

// Geschwindigkeit der Medo-Rocket
const medoRocketSpeed = 4;

// aktuelle Anzahl der Bewegungen der Medo-Rocket - Richtungsänderung nur nach bestimmer Anzahl von Bewegungen möglich
let medoRocketMoves = 0;

// Flag ob aktive Medo-Rocket Rakete berührt hat
let medoRocketCollison = false;

// Flag ob sich Medo-Rocket nach oben bewegt - wenn false bewegt sie sich nach unten
let medoRocketup = true;

// minimale und maximale Geschwindigkeit der Ufos
const ufoMinSpeed = 6;
const ufoMaxSpeed = 14;

// aktuelle Anzahl Ufos die passiert haben
let ufosPassed = 0;

// Anzahl Ufos die passiert haben um das Spiel zu beenden
const ufosMaxPassed = 3;

// Erzielte Punkte
let score = 0;

// Flag Spielende
let gameOver = false;

/**************************************************************************/
/* Globale Variablen für die beweglichen Objekte                          */
/* die Parameter werden in einem Json-Container zusammengefasst           */
/* Zugriff auf die Container-Parameter über . z.B. rocket.x oder          */
/* rocket.src                                                             */
/*                                                                        */
/* siehe auch: https://www.youtube.com/watch?v=KccgQkIdMnU                */
/*                                                                        */
/* die meisten der verwendeten Grafiken sind von von https://pixabay.com/ */
/**************************************************************************/
// Rakete / Raumschiff
let rocket = {
  x: 50,
  y: 200,
  width: 87,
  height: 50,
  src: "img/rocket.png",
};

// Raumstation
let spaceStation;
let spaceStationActive = false;

// Medo-Rocket
let medoRocket;
let medoRocketActive = false;

// X-Bombe
let xBomb;
let xBombActive = false;

// Array für Ufos
let ufos = [];

// Array für Schüsse von Rakete
let shots = [];

// Array für Schüsse vom Heck der Rakete
let rearshots = [];

/**********************************/
/*      Tastatur abfragen         */
/**********************************/
/*        Event-Handler           */
/* wenn Taste gedrückt wurde      */
/**********************************/
document.onkeydown = function (e) {
  console.log(">" + e.key + "<");

  // beim ersten Tastendruck Sound initialisieren
  if (!soundInitialized) {
    initializeSound();
  }

  // Leertaste gedrückt - keine Schüsse, wenn Rakete getroffen und im 'Boom'-Status ist
  if (e.key == " " && !collision) {
    KEY_SPACE = true;
  }

  // Cursor nach oben gedrückt
  if (e.key == "ArrowUp") {
    KEY_UP = true;
  }
  
  // Cursor nach unten gedrückt
  if (e.key == "ArrowDown") {
    KEY_DOWN = true;
  }

  // Cursor nach rechts gedrückt
  if (e.key == "ArrowRight") {
    KEY_RIGHT = true;
  }
  
  // Cursor nach links gedrückt
  if (e.key == "ArrowLeft") {
    KEY_LEFT = true;
  }
  
  // X-Taste gedrückt
  if (e.key == "x" || e.key == "X") {
    createXBomb();
  }

  // Strg-Taste gedrückt
  if (e.key == "Control") {
    KEY_CONTROL = true;
  }
};

/**********************************/
/*        Event-Handler           */
/* wenn Taste losgelassen wurde   */
/**********************************/
document.onkeyup = function (e) {
  // console.log(">" + e.key + "<");
  // Leertaste losgelassen
  if (e.key == " ") {
    KEY_SPACE = false;
  }

  // Cursor nach oben losgelassen
  if (e.key == "ArrowUp") {
    KEY_UP = false;
  }

  // Cursor nach unten losgelassen
  if (e.key == "ArrowDown") {
    KEY_DOWN = false;
  }

  // Cursor nach rechts losgelassen
  if (e.key == "ArrowRight") {
    KEY_RIGHT = false;
  }
  
  // Cursor nach links losgelassen
  if (e.key == "ArrowLeft") {
    KEY_LEFT = false;
  }
  
  // Strg-Taste losgelassen
  if (e.key == "Control") {
    KEY_CONTROL = false;
  }
};

/**************************************/
/*       Spiel starten                */
/*                                    */
/*    Diese Funktion wird über den    */
/*    body der Seite ufoalert.html    */
/*    aufgerufen                      */
/**************************************/
function startGame() {
  // Ausgabebereich besorgen
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  // Bild-Objekte laden
  loadImages();

  // Aufruf von Funktionen, die im zeitlichen Intervall immer wieder aufgerufen werden
  changeBackgroundHandle = setInterval(changeBackground, changeBackgroundIntervall);
  updateHandle = setInterval(update, updateIntervall);
  updateLaserHandle = setInterval(updateLaser, updateLaserIntervall);
  createSpaceStationHandle = setInterval(createSpaceStation, createSpaceStationIntervall);
  createMedoRocketHandle = setInterval(createMedoRocket, createMedoRocketIntervall);
  createUfoHandle = setInterval(createUfos, createUfoIntervall);
  checkCollisionUfoHandle = setInterval(checkCollisionUfo, checkCollisionUfoIntervall);
  checkCollisionSpaceStationHandle = setInterval(checkCollisionSpaceStation, checkCollisionSpaceStationIntervall);
  checkCollisionMedoRocketHandle = setInterval(checkCollisionMedoRocket, checkCollisionMedoRocketIntervall);
  checkForShootHandle = setInterval(checkForShoot, checkForShootIntervall);
  checkEndgameHandle = setInterval(checkEndOfGame, checkEndgameIntervall);

  // Statuszeile - wenn Browsersprache nicht Deutsch ist wird Englisch ausgegeben
  if (navigator.language.indexOf("de") > -1) {
    stRocket = "Raumschiffe: ";
    stXbomb = "X-Bomben: "
    stEscUfos = "Entkommene UFOs: ";
    stScore = "Punkte: ";
  } else {
    stRocket = "Spaceships: ";
    stXbomb = "X-Bombs: "
    stEscUfos = "Escaped UFOs: ";
    stScore = "Score: ";
  }

  // Status
  statusLine = document.getElementById("status");

  if (navigator.language.indexOf("de") > -1) {
    document.getElementById("backButton").innerHTML = "Zurück";
    document.getElementById("startButton").innerHTML = "Starte Spiel neu";
    } else {
      document.getElementById("backButton").innerHTML = "Back";
      document.getElementById("startButton").innerHTML = "Restart Game";
    }

  draw(); // alle Bild-Objekte ausgeben - die Funktion ist rekursiv, d.h. sie ruft sich immer wieder selbst auf
}

/**********************************
 * Initialisiert die Sound-Effekte
 **********************************/
function initializeSound() {
    // Soundeffekte initialisieren
    shootsnd = new Howl({ src: ["snd/shoot.mp3"], autoplay: false, html5: true });

    rshootsnd = new Howl({ src: ["snd/rshoot.mp3"], autoplay: false, html5: true });
  
    xBombSnd = new Howl({
      src: ["snd/xBomb.mp3"],
      autoplay: false,
      html5: true,
    });
  
    explode = new Howl({
      src: ["snd/explosion.mp3"],
      autoplay: false,
      html5: true,
    });
  
    rockethit = new Howl({
      src: ["snd/explode.mp3"],
      autoplay: false,
      html5: true,
    });
  
    medoRockethit = new Howl({
      src: ["snd/medoRocket.wav"],
      autoplay: false,
      html5: true,
    });
  
    missilehit = new Howl({
      src: ["snd/dong.mp3"],
      autoplay: false,
      html5: true,
    });
  
    ufoEsacped = new Howl({
      src: ["snd/ufoEscaped.mp3"],
      autoplay: false,
      html5: true,
    });
  
    gameOverSnd = new Howl({
      src: ["snd/game-over.wav"],
      autoplay: false,
      html5: true,
    });
  
    gameMusic = new Howl({ src: ["snd/game.mp3"], autoplay: false, loop: true, html5: true });

    soundInitialized = true;
    console.log("Sound-Modul wurde initialisiert.");      
}

/*****************************/
/* Musik ein und ausschalten */
/*****************************/
function playMusic() {
  if (!gameOver) {
    // Fokus vom Button nehmen damit Leertaste nicht auslöst
    document.getElementById("musicButton").blur(); 

    // Musik in Abhängigkeit vom Status ein oder ausschalten
    if (music) {
      gameMusic.stop();
      music = false;
    } else {
      gameMusic.play();
      music = true;
    }
  }
}

/*************************************/
/* Dynamisches Hintergrundbild       */
/*                                   */
/*************************************/
function changeBackground() {
  let bg = Math.floor(Math.random() * (4)) + 1;

  switch (bg) {
    case 1:
      backgroundImage.src = "img/background1.jpg";
      break;
    case 2:
      backgroundImage.src = "img/background2.jpg";
      break;
    case 3:
      backgroundImage.src = "img/background3.jpg";
      break;
    case 4:
      backgroundImage.src = "img/background4.jpg";
      break;
      default:
      break;
  }
}

/*************************************/
/*  Überprüfung auf Ufo-Kollisionen  */
/*                                   */
/*************************************/
function checkCollisionUfo() {
  // Kontrollieren, ob Ufo mit Rakete kollidiert
  ufos.forEach(function (ufo) {
    if (
      rocket.x + rocket.width > ufo.x &&
      rocket.y + rocket.height > ufo.y &&
      rocket.x < ufo.x &&
      rocket.y < ufo.y + ufo.height
    ) {
      // Rakete durch Boom-Bild ersetzen
      rocket.img.src = "img/boom.png";

      // das getroffene Ufo aus dem Array löschen
      ufos = ufos.filter((u) => u != ufo);

      // eine Rakete weniger
      rockets -= 1;
      
      // Laser auf 100%
      laserCount = laserMax;

      // X-Bombe wieder verfügbar
      xBombCnt = 1;

      // Sound abspielen
      rockethit.play();

      // Vorbereitung um Rakete wieder anzuzeigen - dies passiert in checkEndOfGame
      collision = true;
    }

    // Kontrollieren, ob Schüsse der Rakete ein Ufo treffen
    shots.forEach(function (shot) {
      if (
        shot.x + shot.width > ufo.x &&
        shot.y + shot.height > ufo.y &&
        shot.x < ufo.x &&
        shot.y < ufo.y + ufo.height
      ) {
        // den Treffer-Schuss aus dem Array löschen
        shots = shots.filter((u) => u != shot);

        // Ufo durch Explosions-Bild ersetzen
        ufo.img.src = "img/explosion.png";

        // Sound abspielen
        explode.play();

        score += 10;

        // das getroffene Ufo aus dem Array löschen
        setTimeout(() => {
          ufos = ufos.filter((u) => u != ufo);
        }, 100);

      }
    });

    // Kontrollieren, ob Schüsse vom Heck der Rakete ein Ufo treffen
    rearshots.forEach(function (shot) {
      if (
        shot.x < ufo.x + ufo.width &&
        shot.y + shot.height > ufo.y &&
        shot.x > ufo.x &&
        shot.y < ufo.y + ufo.height
      ) {
        // den Treffer-Schuss aus dem Array löschen
        rearshots = rearshots.filter((u) => u != shot);

        // Ufo durch Explosions-Bild ersetzen
        ufo.img.src = "img/explosion.png";

        // Sound abspielen
        explode.play();

        score += 10;

        // das getroffene Ufo aus dem Array löschen
        setTimeout(() => {
          ufos = ufos.filter((u) => u != ufo);
        }, 100);

      }
    });

  });
}

/*********************************************/
/*  Überprüfung auf Raumstation-Kollisionen  */
/*                                           */
/*********************************************/
function checkCollisionSpaceStation() {
  // Kontrollieren, ob Raumstation mit Rakete kollidiert
  if (spaceStationActive) {
    if (
      rocket.x + rocket.width > spaceStation.x &&
      rocket.y + rocket.height > spaceStation.y &&
      rocket.x < spaceStation.x &&
      rocket.y < spaceStation.y + spaceStation.height
    ) {
      // Rakete durch Boom-Bild ersetzen
      rocket.img.src = "img/boom.png";

      // eine Rakete weniger
      rockets -= 1;
      laserCount = laserMax;

      // Sound abspielen
      rockethit.play();

      // Vorbereitung um Rakete wieder anzuzeigen
      collision = true;

      spaceStationActive = false;
    }

    // Kontrollieren, ob Schüsse der Rakete Raumstation treffen
    shots.forEach(function (shot) {
      if (
        shot.x + shot.width > spaceStation.x &&
        shot.y + shot.height > spaceStation.y &&
        shot.x < spaceStation.x &&
        shot.y < spaceStation.y + spaceStation.height
      ) {
        // den Treffer-Schuss aus dem Array löschen
        shots = shots.filter((u) => u != shot);

        if (spaceStation.hits < spaceStationMaxHits) {
          // Treffer der Raumstation erhöhen
          spaceStation.hits += 1;

          // Beschädigung der Raumstation anzeigen und diese gegebenenfalls zerstören
          switch (spaceStation.hits) {
            case 1:
              spaceStation.img.src = "img/SpaceStation1.png";
              explode.play();
              break;
            case 2:
              spaceStation.img.src = "img/SpaceStation2.png";
              explode.play();
              break;
            case 3:
              spaceStation.img.src = "img/SpaceStation3.png";
              explode.play();
              break;
            case 4:
              spaceStation.img.src = "img/SpaceStation4.png";
              explode.play();
              break;
            case 5:
              spaceStation.img.src = "img/SpaceStation5.png";
              explode.play();
              break;
            case 6:
              // Raumstation durch Explosions-Bild ersetzen
              spaceStation.img.src = "img/explosion.png";

              // Sound abspielen
              explode.play();

              score += 100;

              setTimeout(() => {
                spaceStationActive = false;
              }, 100);
              break;
            default:
              break;
          }
        }
      }
    });

    // Kontrollieren, ob Schüsse vom Heck der Rakete Raumstation treffen
    rearshots.forEach(function (shot) {
      if (
        shot.x < spaceStation.x + spaceStation.width &&
        shot.y + shot.height > spaceStation.y &&
        shot.x > spaceStation.x &&
        shot.y < spaceStation.y + spaceStation.height
      ) {
        // den Treffer-Schuss aus dem Array löschen
        rearshots = rearshots.filter((u) => u != shot);

        if (spaceStation.hits < spaceStationMaxHits) {
          // Treffer der Raumstation erhöhen
          spaceStation.hits += 1;

          // Beschädigung der Raumstation anzeigen und diese gegebenenfalls zerstören
          switch (spaceStation.hits) {
            case 1:
              spaceStation.img.src = "img/SpaceStation1.png";
              explode.play();
              break;
            case 2:
              spaceStation.img.src = "img/SpaceStation2.png";
              explode.play();
              break;
            case 3:
              spaceStation.img.src = "img/SpaceStation3.png";
              explode.play();
              break;
            case 4:
              spaceStation.img.src = "img/SpaceStation4.png";
              explode.play();
              break;
            case 5:
              spaceStation.img.src = "img/SpaceStation5.png";
              explode.play();
              break;
            case 6:
              // Raumstation durch Explosions-Bild ersetzen
              spaceStation.img.src = "img/explosion.png";

              // Sound abspielen
              explode.play();

              score += 100;

              setTimeout(() => {
                spaceStationActive = false;
              }, 100);
              break;
            default:
              break;
          }
        }
      }
    });

  }

  // Kontrollieren, ob Missile mit Rakete kollidiert
  if (spaceStationMissileActive) {
    if (
      rocket.x + rocket.width > spaceStationMissile.x &&
      rocket.y + rocket.height > spaceStationMissile.y &&
      rocket.x < spaceStationMissile.x &&
      rocket.y < spaceStationMissile.y + spaceStationMissile.height
    ) {
      // Rakete durch Boom-Bild ersetzen
      rocket.img.src = "img/boom.png";

      // eine Rakete weniger
      rockets -= 1;

      // Laser auf 100%
      laserCount = laserMax;

      // X-Bombe wieder verfügbar
      xBombCnt = 1;

      // Sound abspielen
      rockethit.play();

      // Vorbereitung um Rakete wieder anzuzeigen
      collision = true;

      spaceStationMissileActive = false;
    }
    // Kontrollieren, ob Schüsse der Rakete Missile treffen
    shots.forEach(function (shot) {
      if (
        shot.x + shot.width > spaceStationMissile.x &&
        shot.y + shot.height > spaceStationMissile.y &&
        shot.x < spaceStationMissile.x &&
        shot.y < spaceStationMissile.y + spaceStationMissile.height
      ) {
        // den Treffer-Schuss aus dem Array löschen
        shots = shots.filter((u) => u != shot);
        missilehit.play();
      }
    });      
  }
}  

/*********************************************/
/*  Überprüfung auf Medo-Rocket-Kollision    */
/*                                           */
/*********************************************/
function checkCollisionMedoRocket() {
  // Kontrollieren, ob Medo-Rocket mit Rakete kollidiert
  if (medoRocketActive && !medoRocketCollison) {
    if (
      rocket.x + rocket.width > medoRocket.x &&
      rocket.y + rocket.height > medoRocket.y &&
      rocket.x < medoRocket.x &&
      rocket.y < medoRocket.y + medoRocket.height
    ) {
      // Sound abspielen
      medoRockethit.play();

      // Trefferbild anzeigen
      medoRocket.img.src = "img/medoRocketHit.png";

      // eine Rakete mehr
      rockets += 1;

      setTimeout(() => {
        medoRocketActive = false;
      }, 500);

      // solange Medo-Rocket sichtbar keine weitere Kollision und somit keine weitere Rakete
      medoRocketCollison = true;
    }
  }
}

/*****************************************/
/*  Überprüfen ob das Spiel zu Ende ist  */
/*                                       */
/*****************************************/
function checkEndOfGame() {
  // Raumschiffbild wieder herstellen - es könnte durch das Treffer-Bild ersetzt worden sein
  rocket.img.src = "img/rocket.png";
  // Tastaturabfragen nach einem möglichen Treffer wieder ermöglichen
  collision = false;

  // Spiel beenden wenn es keine Raumschiffe mehr gibt oder zuviel Ufos passiert haben
  if (rockets <= 0 || ufosPassed >= ufosMaxPassed) {
    if (ufosPassed >= ufosMaxPassed) {
    backgroundImage.src = "img/gameover2.jpg";
    } else {
      backgroundImage.src = "img/gameover.jpg";
    }
    ufoEsacped.stop();
    gameMusic.stop();
    gameOverSnd.play();
    music = false;
    gameOver = true;

    // alle im Intervall aufgerufenen Funktionen beenden
    clearInterval(changeBackgroundHandle);
    clearInterval(updateHandle);
    clearInterval(updateLaserHandle);
    clearInterval(createSpaceStationHandle);
    clearInterval(createMedoRocketHandle);
    clearInterval(createUfoHandle);
    clearInterval(checkCollisionUfoHandle);
    clearInterval(checkCollisionMedoRocketHandle);
    clearInterval(checkCollisionSpaceStationHandle);
    clearInterval(checkForShootHandle);
    clearInterval(checkEndgameHandle);
  }
}

/******************************************/
/*  Raumstation erzeugen                  */
/*                                        */
/******************************************/
function createSpaceStation() {
  if (spaceStationActive) return;

  const spaceStationWidth = 292;
  const spaceStationHeight = 108;
  const spaceStationMissileWidth = 100;
  const spaceStationMissileHeight = 35;

  // die Raumstation zufällig auf der Y-Achse erscheinen lassen
  let yAxis = Math.random() * (canvas.height - spaceStationHeight);

  spaceStation = {
    width: spaceStationWidth,
    height: spaceStationHeight,
    x: canvas.width,
    // die Raumstation zufällig auf der Y-Achse erscheinen lassen
    y: yAxis,
    hits: 0,
    img: new Image(),
    src: "img/SpaceStation0.png",
  };
  
  spaceStation.img.src = spaceStation.src;
  spaceStationActive = true;

  // Missile per Zufall erzeugen
  let m = Math.floor(Math.random() * (2)) + 1;
  if (m > 1) {
    spaceStationMissile = {
      width: spaceStationMissileWidth,
      height: spaceStationMissileHeight,
      x: canvas.width - spaceStationWidth / 2,
      y: yAxis + spaceStationHeight / 2,
      img: new Image(),
      src: "img/missile.png",
    }
    spaceStationMissile.img.src = spaceStationMissile.src;
    spaceStationMissileActive = true;
  }

}

/******************************************/
/*  Medo-Rocket erzeugen                  */
/*                                        */
/*  Wenn unser Raumschiff mit der         */
/*  Medo-Rocket                           */
/*  kollidiert haben wir ein Raumschiff   */
/*  mehr.                                 */
/*  Die Abfrage dazu geschieht in         */
/*  checkCollisionMedoRocket()            */
/******************************************/
function createMedoRocket() {
  // MedoRocket nicht mehrfach erzeugen und nur dann, wenn genug Punkte erreicht sind
  if (medoRocketActive || score < medoRocketScore) return;

  // erforderliche Punkte zum Erzeugen der nächsten Medo-Rocket hochsetzen
  medoRocketScore += 1000;

  // die Medo-Rocket ist noch nicht mit unserer Rakete kollidiert
  medoRocketCollison = false;

  // Medo-Rocket erzeugen
  const medoRocketWidth = 108;
  const medoRocketHeight = 73;

  medoRocket = {
    width: medoRocketWidth,
    height: medoRocketHeight,
    x: canvas.width,
    // die Medo-Rocket zufällig auf der Y-Achse erscheinen lassen
    y: Math.random() * (canvas.height - medoRocketHeight),
    hits: 0,
    img: new Image(),
    src: "img/medoRocket.png",
  };

  medoRocket.img.src = medoRocket.src;

  // Flag, das Medo-Rocket aktiv ist, setzen
  medoRocketActive = true;
}

/******************************************/
/*  X-Bombe erzeugen                      */
/*                                        */
/******************************************/
function createXBomb() {
  // X-Bombe nicht mehrfach erzeugen und nur dann, wenn X-Bombe verfügbar
  if (xBombCnt < 1 || xBombActive || gameOver) return;

  xBombCnt = 0;

  // X-Bombe erzeugen
  const xBombWidth = 70;
  const xBombHeight = 41;

  xBomb = {
    width: xBombWidth,
    height: xBombHeight,
    x: rocket.x + rocket.width,
    y: rocket.y,
    img: new Image(),
    src: "img/xBomb.png",
  };

  xBomb.img.src = xBomb.src;
  
  // Abschuss-Sound abspielen
  xBombSnd.play();
  
  // Flag, das X-Bombe aktiv ist, setzen
  xBombActive = true;
}

/******************************************/
/*  Ufos erzeugen und im Array speichern  */
/*                                        */
/******************************************/
function createUfos() {
  const ufoWidth = 100;
  const ufoHeight = 40;

  let ufo = {
    x: canvas.width + 100,
    // die Ufos zufällig auf der Y-Achse verteilen
    y: Math.random() * (canvas.height - ufoHeight),
    width: ufoWidth,
    height: ufoHeight,
    // die Geschwindigkeit der Ufos zufällig zwischen minimaler und maximaler Geschwindigkeit erzeugen
    speed: Math.floor(Math.random() * (ufoMaxSpeed - ufoMinSpeed + 1)) + 5,
    img: new Image(),
  };
  // Bild für Ufo in Abhängigkeit der Geschwindigkeit wählen
  if (ufo.speed < ufoMaxSpeed - 5) {
    ufo.img.src = "img/ufo.png";
  } else {
    ufo.img.src = "img/ufoSpeed.png";
  }
  ufos.push(ufo);
}

/*********************************************/
/*  Schüsse erzeugen und im Array speichern  */
/*                                           */
/*********************************************/
function checkForShoot() {
  if (collision) return;

  // Schuss vom Bug der Rakete
  if (KEY_SPACE && !KEY_CONTROL) {
    // Laser wird nur ausgelöst, wenn Laser Status > 0
    if (laserCount > 0) {
      laserCount -= 1;
      let shot = {
        x: rocket.x + rocket.width,
        y: rocket.y + rocket.height / 2,
        width: 30,
        height: 4,
        src: "img/shot.png",
        img: new Image(),
      };
      // Laser-Bild laden
      shot.img.src = shot.src;
      
      // Schuss im Schuss-Array speichern
      shots.push(shot);
      
      shootsnd.play();
    }
  }

  // Schuss vom Heck der Rakete
  if (KEY_SPACE && KEY_CONTROL) {
    let shot = {
      x: rocket.x,
      y: rocket.y + rocket.height / 2,
      width: 30,
      height: 4,
      src: "img/rshot.png",
      img: new Image(),
    };
    // Laser-Bild laden
    shot.img.src = shot.src;
    
    // Schuss im Schuss-Array speichern
    rearshots.push(shot);
    
    rshootsnd.play();
  }
}

/*********************************************************/
/*  Koordinaten aller beweglichen Objekte aktualisieren  */
/*                                                       */
/*********************************************************/
function update() {
  if (collision == false) {
    // Rakete auf der Y-Achse bewegen
    if (KEY_UP) {
      if (rocket.y >= 0 + rocketSpeed) {
        rocket.y -= rocketSpeed;
      }
    }

    if (KEY_DOWN) {
      if (rocket.y <= canvas.height - rocket.height - rocketSpeed) {
        rocket.y += rocketSpeed;
      }
    }

    // Rakete auf der X-Achse bewegen
    if (KEY_LEFT) {
      if (rocket.x >= 0 + rocketSpeed) {
        rocket.x -= rocketSpeed;
      }
    }

    if (KEY_RIGHT) {
      if (rocket.x <= canvas.width - rocket.width - rocketSpeed) {
        rocket.x += rocketSpeed;
      }
    }

    // X-Bombe nach rechts bewegen
    if (xBombActive) {
      xBomb.x += xBombSpeed;
      
      // wenn die Bombe die Mitte des Bildschirms erreicht hat alle feindlichen Objekte ausschalten
      if (xBomb.x > (canvas.width / 2) - xBombSpeed) {
        xBomb.width = 638;
        xBomb.height = 640;
        
        // Bild der Bombe durch Explosionsbild ersetzen
        xBomb.y = canvas.height / 2 - xBomb.height / 2;
        xBomb.x = canvas.width / 2 - xBomb.width / 2;
        xBomb.src = "img/explosion.png"
        xBomb.img.src = xBomb.src;

        // Sound abspielen
        rockethit.play();

        setTimeout(() => {
          xBombActive = false;
        }, 100);

        // alle feindlichen Objekte löschen
        ufos = [];
        spaceStationActive = false;
        spaceStationMissileActive = false;
      }
      
    }

    // Raumstation nach links bewegen
    if (spaceStationActive) {
      spaceStation.x -= spaceStationSpeed;

      if (spaceStation.x < spaceStation.width * -1) {
        spaceStationActive = false;
        // ein Ufo mehr entkommen - nicht hochzählen wenn nach 2 entkommenen Ufos mehrere gleichzeitig passieren
        if (ufosPassed != ufosMaxPassed) {
          ufosPassed += 1;
          // Hintergrund kurz ändern - Änderung wird durch changeBackground() rückgängig gemacht 
          backgroundImage.src = "img/backgroundUfoEscaped.jpg";
          // Sound abspielen
          ufoEsacped.play();          
        }
      }
    } // Ende Raumstation

    // Missile nach links bewegen
    if (spaceStationMissileActive) {
      spaceStationMissile.x -= spaceStationSpeed + 4;

      if (spaceStationMissile.x < spaceStationMissile.width * -1) {
        spaceStationMissileActive = false;
      }
    } // Ende Missile

    // MedoRocket nach links bewegen
    if (medoRocketActive) {
      medoRocket.x -= medoRocketSpeed;
      if (medoRocketup) {
        medoRocket.y -= 1;
      } else {
        medoRocket.y += 1;
      }

      medoRocketMoves += 1;
      if (medoRocketMoves > 50) {
        medoRocketMoves = 0;
        // Zufallszahl zwischen 1 und 30 erzeugen
        let directionChange = Math.floor(Math.random() * (30 - 1)) + 1;
        // es gibt eine mögliche Änderung der Richtung wenn Zufallszahl größer 20 ist
        if (directionChange > 20) {
          // in welcher Richtung soll es gehen
          if (medoRocketup) {
            medoRocketup = false;
          } else {
            medoRocketup = true;
          }
        }
      }

      // Korrektur wenn oberer Bildrand erreicht ist
      if (medoRocket.y <= 0) {
        medoRocketup = false;
      }

      // Korrektur wenn unterer Bildrand erreicht ist
      if (medoRocket.y > canvas.height - medoRocket.height) {
        medoRocketup = true;
      }

      // Medo-Rocket löschen wenn linken Bildrand erreicht
      if (medoRocket.x < medoRocket.width * -1) {
        medoRocketActive = false;
      }
 
    } // Ende Medo-Rocket

    // alle Ufos nach links bewegen
    ufos.forEach(function (ufo) {
      ufo.x -= ufo.speed;

      // Wenn Ufo linken Bildschirmrand erreicht hat Ufo aus Array löschen
      if (ufo.x < ufo.width * -1) {
        ufos = ufos.filter((u) => u != ufo);
        // ein Ufo mehr entkommen - nicht hochzählen wenn nach 2 entkommenen Ufos mehrere gleichzeitig passieren
        if (ufosPassed != ufosMaxPassed) {
          ufosPassed += 1;
          // Hintergrund kurz ändern - Änderung wird durch changeBackground() rückgängig gemacht 
          backgroundImage.src = "img/backgroundUfoEscaped.jpg";
          // Sound abspielen
          ufoEsacped.play();
        }
      }
    }); // Ende Ufos

    // alle Schüsse der Rakete nach rechts bewegen
    shots.forEach(function (shot) {
      shot.x += 15;

      // wenn Schuss rechten Bildschirmrand erreicht hat Schuss aus Array löschen
      if (shot.x > canvas.width) {
        shots = shots.filter((u) => u != shot);
      }

    }); // Ende Schüsse

    // alle Schüsse vom Heck der Rakete nach links bewegen
    rearshots.forEach(function (shot) {
      shot.x -= 18;

      // wenn Schuss linken Bildschirmrand erreicht hat Schuss aus Array löschen
      if (shot.x < 0) {
        shots = shots.filter((u) => u != shot);
      }

    }); // Ende Schüsse

  } // Ende Collison == false
}

/*********************************/
/*  Update Status Laserkanone    */
/*                               */
/*  alle updateLaserIntervall    */
/*  Sekunden wird der Vorrat     */
/*  an Schüssen um eins erhöht   */
/*  bis die maximale Anzahl      */
/*  erreicht ist                 */
/*********************************/
function updateLaser() {
  if (laserCount < laserMax) {
    laserCount += 1;
  }
}

/******************************/
/*  laden der Grafik-Objekte  */
/*                            */
/******************************/
function loadImages() {
  // Hintergrundbild laden
  backgroundImage.src = "img/background1.jpg";

  // Raumschiff laden
  rocket.img = new Image();
  rocket.img.src = rocket.src;
}

/****************************/
/*  Zeichnen aller Objekte  */
/*                          */
/****************************/
function draw() {
  // Ausgabe des Hintergrunds an den Koordinaten 0, 0
  ctx.drawImage(backgroundImage, 0, 0);

  // Rakete an den aktuellen Koordinaten ausgeben
  ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

  // X-Bombe an den aktuellen Koordinaten ausgeben
  if (xBombActive) {
    ctx.drawImage(
      xBomb.img,
      xBomb.x,
      xBomb.y,
      xBomb.width,
      xBomb.height
    );
  }

  // Raumstation an den aktuellen Koordinaten ausgeben
  if (spaceStationActive) {
    ctx.drawImage(
      spaceStation.img,
      spaceStation.x,
      spaceStation.y,
      spaceStation.width,
      spaceStation.height
    );
  }

  // Missile an den aktuellen Koordinaten ausgeben
  if (spaceStationMissileActive) {
    ctx.drawImage(
      spaceStationMissile.img,
      spaceStationMissile.x,
      spaceStationMissile.y,
      spaceStationMissile.width,
      spaceStationMissile.height
    );
  }

  // MedoRocket an den aktuellen Koordinaten ausgeben
  if (medoRocketActive) {
    ctx.drawImage(
      medoRocket.img,
      medoRocket.x,
      medoRocket.y,
      medoRocket.width,
      medoRocket.height
    );
  }

  // Ufos an den aktuellen Koordinaten ausgeben
  ufos.forEach(function (ufo) {
    ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
  });

  // Schüsse an den aktuellen Koordinaten ausgeben
  shots.forEach(function (shot) {
    ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
  });

  // Schüsse an den aktuellen Koordinaten ausgeben
  rearshots.forEach(function (shot) {
    ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
  });


  // Status ausgeben
  statusLine.textContent =
    stRocket +
    rockets +
    space +
    "Laser: " +
    laserCount * 10 +
    "%" +
    space +
    stXbomb +
    xBombCnt +
    space +    
    stEscUfos +
    ufosPassed +
    space +
    stScore +
    score;

  // Button-Zeile - wenn Browsersprache nicht Deutsch ist wird Englisch ausgegeben
  let deMstat;
  let enMstat;

  if (music) {
    deMstat = "Musik aus";
    enMstat = "Music off";
  } else {
    deMstat = "Musik ein";
    enMstat = "Music on";
  }

  if (navigator.language.indexOf("de") > -1) {
    document.getElementById("musicButton").innerHTML = deMstat;
    } else {
      document.getElementById("musicButton").innerHTML = enMstat;
    }

  requestAnimationFrame(draw);
}
