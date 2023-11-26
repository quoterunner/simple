function onlineCheck(){
  
}

function displayError(icon, text) {
  document.getElementById("local-error-trigger").innerHTML =
    '<div id="local-error-container"> <div id="local-error"> <span class="material-symbols-rounded" style="font-size: 50px;"> ' +
    icon +
    " </span> <h2> " +
    text +
    " </h2> </div> </div>";
}

function clearError() {
  document.getElementById("local-error-trigger").innerHTML = "";
}

var seconds = 0;
var quoteLength = 0;
var timerRunning = false;
function timer() {
  if (timerRunning) {
    seconds++;
    setTimeout(timer, 1000);
  }
}

function getQuote(minLength, maxLength, lengthName) {
  firstLetter = true;
  currentLetterKeypress = 0;
  correctLetters = 0;

  if (
    minLength == undefined ||
    maxLength == undefined ||
    lengthName == undefined
  ) {
    var minLength = localStorage.getItem("minLength");
    var maxLength = localStorage.getItem("maxLength");
    var lengthName = localStorage.getItem("lengthName");
  }

  localStorage.setItem("minLength", minLength);
  localStorage.setItem("maxLength", maxLength);
  localStorage.setItem("lengthName", lengthName);

  document.getElementById("small").style.color = "black";
  document.getElementById("medium").style.color = "black";
  document.getElementById("large").style.color = "black";
  document.getElementById("save-your-soul").style.color = "black";

  document.getElementById(lengthName).style.color = "blue";

  // quote api from https://github.com/lukePeavey/quotable
  fetch(
    "https://api.quotable.io/quotes/random?minLength=" +
      minLength +
      "&maxLength=" +
      maxLength
  )
    .then((res) => res.json())
    .then((json) => {
      var json = json[0];
      var quote = json["content"].split("");
      var author = "-" + json["author"];

      console.log(" ");
      console.info("New quote: " + json["content"] + " " + author);

      const quoteElement = document.getElementById("quote");
      const authorElement = document.getElementById("author");

      quoteElement.innerHTML = "";
      quoteLength = json["length"];

      var currentQuoteIndex = 0;
      while (currentQuoteIndex < quoteLength) {
        var character = quote[currentQuoteIndex];
        if (character == " ") {
          character = "&nbsp;";
        }

        var h1 = document.createElement("h1");
        h1.innerHTML = character;
        h1.id = currentQuoteIndex;
        quoteElement.appendChild(h1);

        currentQuoteIndex++;
      }
      authorElement.innerHTML = author;
    });
}

document.addEventListener("keydown", (event) => {
  var caps = event.getModifierState("CapsLock");
  if (caps) {
    displayError("keyboard_capslock", "Caps lock on");
  } else {
    clearError();
  }
}, false);

document.addEventListener("keypress", (event) => keypressEvent(event), false);

var currentLetterKeypress = 0;
var correctLetters = 0;
var firstLetter = true;
function keypressEvent(event) {
  var key = event.key;

  if (firstLetter == true) {
    firstLetter = false;
    seconds = 0;
    timerRunning = true;
    timer();
  }

  var currentLetter = document.getElementById(currentLetterKeypress);
  if (key == " ") {
    key = "&nbsp;";
  }

  if (currentLetter.innerHTML == "…") {
    if (key == ".") {
      key = "…";
    }
  }

  if (key == currentLetter.innerHTML) {
    currentLetter.style.color = "green";
    currentLetter.style.borderLeft = "";
    currentLetterKeypress++;
    correctLetters ++;

    currentLetter = document.getElementById(currentLetterKeypress);
    if (currentLetter == null) {
      timerRunning = false;
      var accuracy = Math.round((correctLetters / (quoteLength)) * 100);
      var rawWpm = Math.round(quoteLength / 5 / (seconds / 60));
      var wpm = Math.round(rawWpm * (accuracy / 100));

      console.log("Quote stats: ");
      console.info("Quote length: " + quoteLength);
      console.info("Correct letters: " + correctLetters);
      console.info("Seconds to complete: " + seconds);
      console.info("Raw WPM: " + rawWpm);
      console.info("Accuracy: " + accuracy);
      console.info("WPM: " + wpm);


      document.getElementById("info").textContent =
        "Raw WPM: " + rawWpm + " WPM; Accuracy: " + accuracy + "%; WPM: " + wpm + " WPM";

      firstLetter = true;
      currentLetterKeypress = 0;
      correctLetters = 0;

      getQuote();
    } else {
      currentLetter.style.borderLeft = "3px solid black";
      if (document.getElementById(currentLetterKeypress + 10) !== null) {
        document
          .getElementById(currentLetterKeypress + 10)
          .scrollIntoView(true);
      }
    }
  } else {
    currentLetter.style.borderLeft = "3px solid red";
    correctLetters --;
  }
}

var minLength = localStorage.getItem("minLength");
var maxLength = localStorage.getItem("maxLength");
var lengthName = localStorage.getItem("lengthName");

if (
  minLength == undefined ||
  maxLength == undefined ||
  lengthName == undefined
) {
  minLength = 0;
  maxLength = 50;
  lengthName = "small";
}

getQuote(minLength, maxLength, lengthName);
