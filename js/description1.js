let instructionLine;
let rocketLine;
let medoRocketLine;

const enInstruction = 
  "Aliens from deep space appear with their UFOs and plan an invasion of planet Alpha X. " +
  "Don't let the UFOs escape. If you collide with a UFO, your spaceship will explode. " +
  "You have three spaceships, if you lose them or three UFOs reach the left edge of " +
  "the screen, the game is over. ";
const deInstruction = 
  "Aliens aus den Tiefen des Weltalls erscheinen mit ihren UFOs und planen eine Invasion des Planeten Alpha X. " +
  "Lass die UFOs nicht entkommen. Wenn du mit einem UFO kollidierst, explodiert " +
  "dein Raumschiff. Du hast drei Raumschiffe, wenn du sie verlierst oder drei UFOs " +
  "den linken Bildrand erreichen, ist das Spiel vorbei. "; 

  const enRocket =
  "This is your spaceship. Control the spaceship with the cursor up and down keys.  " +
  "Use the spacebar to shoot at the UFOs. Avoid continuous fire so that your laser doesn't overheat and fail.";
 const deRocket =
   "Dies ist dein Raumschiff. Steuere das Raumschiff mit den Cursor-Tasten Pfeil-hoch und Pfeil-runter. " + 
   "Mit der Leertaste kannst du auf die UFOs schießen. Vermeide Dauerfeuer, damit sich Dein Laser nicht überhitzt und versagt.";
 
   const enMedoRocket =
   "When you have fought well for some time, a supply spaceship will appear. Touch it with your spaceship to " +
   "get an additional spaceship. The supply spaceship cannot be shot down.";
  const deMedoRocket =
    "Wenn Du einige Zeit gut gekämpft hast, erscheint ein Versorgungsraumschiff. Berühre es mit deinem Raumschiff um " + 
    "ein zusätzliches Raumschiff zu erhalten. Das Versorgungsraumschiff kann nicht abgeschossen werden.";
  
  const enXbomb =
  "The X-bomb belongs to your spaceship. Fire it with the X-key. The X-bomb flies very fast into the middle of the battlefield " +
  "and eliminates all enemy objects. Use them wisely, each of your spaceships has only one X-bomb.";
  
 const deXbomb =
  "Die X-Bombe gehört zu deinem Raumschiff. Feuere sie mit der Taste-X ab. Die X-Bombe fliegt sehr schnell in die Mitte des Kampfgeschehens " +
  "und eliminiert alle feindlichen Objekte. Verwende sie weise, jedes deiner Raumschiff verfügt nur über eine X-Bombe.";  

function description() {
  // Anleitung - wenn Browsersprache nicht deutsch ist wird englisch ausgegeben
  instructionLine = document.getElementById("instruction");
  rocketLine = document.getElementById("rocket");
  medoRocketLine = document.getElementById("medoRocket");
  xBombLine =  document.getElementById("xBomb");

  if (navigator.language.indexOf("de") > -1) {
    instructionLine.textContent = deInstruction;
    rocketLine.textContent = deRocket;
    medoRocketLine.textContent = deMedoRocket;
    xBombLine.textContent = deXbomb;
    document.getElementById("nextButton").innerHTML = "Weiter";
  } else {
    instructionLine.textContent = enInstruction;
    rocketLine.textContent = enRocket;
    medoRocketLine.textContent = enMedoRocket;
    xBombLine.textContent = enXbomb;
    document.getElementById("nextButton").innerHTML = "Next";
  }
}