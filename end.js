const saveScore = document.querySelector("#save-score");
const userName = document.querySelector("#usermane");
const finalScore = document.querySelector("#final-score");
const MAX_HIGH_SCORE = 5;

// get the most recent score ftom the local storage
const mostResentScore = localStorage.getItem("MostResentScore");

// set the text to the vale of the most resent score
finalScore.innerText = mostResentScore;

// Get the high scores from the local storage and convert it to an object, if null === []
const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

// if username value is still empty after key up leave the save button as disabled
userName.addEventListener("keyup", () => {
  saveScore.disabled = !userName.value;
});

const saveHighScore = (e) => {
  e.preventDefault();

  // Save score and username in the object
  const score = {
    score: mostResentScore,
    name: userName.value,
  };

  // Add the score to the high scores array
  highScores.push(score);

  // Sort high score by highest score then get the array of the first five in the array
  highScores
    .sort((a, b) => {
      return b.score - a.score;
    })
    .splice(5);

  // Save the high score in the local storage
  localStorage.setItem("HighScores", JSON.stringify(highScores));

  window.location.assign("/index.html");
};
