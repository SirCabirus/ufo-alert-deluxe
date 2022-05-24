let ufoLine;
let speedUfoLine;
let cmdUfoLine;
let conclusionLine;

const enUfo = "These are the exploration ships of the aliens. These UFOs are usually slow and can be easily repelled.";
const deUfo = "Dies sind die Erkundungsschiffe der Aliens. Diese UFOs sind meist langsam und lassen sich leicht abwehren.";

const enUfoSpeed = 
  "Beware of the fast black UFOs. " +
  "These alien spaceships try to escape the blockade by your spaceship through high speed.";
const deUfoSpeed = 
  "Vorsicht vor den schnellen schwarzen UFOs. " +
  "Diese Raumschiffe der Aliens versuchen durch hohe Geschwindigkeit der Blockade durch dein Raumschiff zu entkommen.";

const enCmdUfo = 
  "The large UFOs are the command centers of the aliens. You have to hit them several times to destroy them. " +
  "Sometimes the command centers have a defensive missile. You can't destroy this defensive missile and you have to avoid it.";
const deCmdUfo = 
  "Die großen UFOs sind die Kommandozentralen der Aliens. Du musst sie mehrmals treffen, um sie zu zerstören. " +
  "Manchmal verfügen die Kommadozentralen über eine Abwehrrakete. Du kannst diese Abwehrrakete nicht vernichten und musst ihr ausweichen.";

const enConclusion = "And now good luck Commander. Save planet Alpha X from invasion.";  
const deConclusion = "Und nun viel Glück Commander. Retten Sie den Planeten Alpha X vor der Invasion.";  

function description() {
  // Anleitung - wenn Browsersprache nicht deutsch ist wird englisch ausgegeben
  ufoLine = document.getElementById("ufo");
  speedUfoLine = document.getElementById("speedUfo");
  cmdUfoLine = document.getElementById("cmdUfo");
  medoRocketLine = document.getElementById("medoRocket");
  conclusionLine = document.getElementById("conclusion");

  if (navigator.language.indexOf("de") > -1) {
    ufoLine.textContent = deUfo;
    speedUfoLine.textContent = deUfoSpeed;
    cmdUfoLine.textContent = deCmdUfo;
    conclusionLine.textContent = deConclusion;
    document.getElementById("backButton").innerHTML = "Zurück";
    document.getElementById("startButton").innerHTML = "Starte Spiel";

  } else {
    ufoLine.textContent = enUfo;
    speedUfoLine.textContent = enUfoSpeed;
    cmdUfoLine.textContent = enCmdUfo;
    conclusionLine.textContent = enConclusion;
    document.getElementById("backButton").innerHTML = "Back";
    document.getElementById("startButton").innerHTML = "Start Game";
  }
}