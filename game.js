// Get reference to the dom.
const question = document.querySelector("#question");
const choiceText = document.querySelectorAll(".choice-text");
const progressText = document.querySelector("#progress-text");
const scoreCount = document.querySelector(".score");
const loader = document.querySelector("#loader");
const game = document.querySelector("#game");
const progressBarFull = document.querySelector(".progress-bar-full");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

const uri =
  "https://opentdb.com/api.php?amount=20&category=18&difficulty=medium&type=multiple";

const fetchQuestions = async (url) => {
  try {
    const res = await fetch(url);
    const { results } = await res.json();

    questions = results.map((loadedQuestion) => {
      // formatting the result from the api into an object
      const formattedQuestion = {
        Question: loadedQuestion.question,
      };

      // spread the incorrect options into the answerChoices array
      const answerChoices = [...loadedQuestion.incorrect_answers];

      // get a random number from 1 - 4 for the correct answer(get a random index)
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

      // add the correct answer to the answer choices array by putting it at an index of obtained random number - 1 e.g(3 - 1 = 2)
      // so the index to insert it will be 2
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      // Iterate through the answerChoices then put each choice value into the formattedQuestion object as choice1, choice2, choice3, choice4
      answerChoices.forEach((choice, idx) => {
        formattedQuestion["choice" + (idx + 1)] = choice;
      });

      // console.log(answerChoices);
      // console.log(formattedQuestion);
      return formattedQuestion;
    });

    // start game once questions have been fetched successfully
    startGame();
  } catch (error) {
    console.log(error.message);
  }
};

fetchQuestions(uri);

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

const startGame = () => {
  // spread the questions into the availableQuestion array
  availableQuestions = [...questions];

  // get the new question
  getNewQuestion();

  // show question
  game.classList.remove("hidden");

  // hide the loader
  loader.classList.add("hidden");
};

const getNewQuestion = () => {
  // check is there are no more questions, if so add the score to the local storage and redirect to the end page
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    // set the most recent score to the local storage
    localStorage.setItem("MostResentScore", score);

    // render the end.html page, since questions is finished
    window.location.assign("/end.html");
  }

  // else increment the question counter
  if (questionCounter < MAX_QUESTIONS) {
    questionCounter++;
  }

  // style the progress bar
  progressText.innerText = `Question: ${questionCounter} / ${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // get a random index from 0 to the total number of questions(19)
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);

  // get the question at the random index and set it to the current question object
  currentQuestion = availableQuestions[questionIndex];
  // console.log(currentQuestion);
  question.innerText = currentQuestion["Question"];

  // iterate through the options get the dataset number then set the inner text to the currentQuestion choice that match e.g. if number ==== 1 it matches choice1
  choiceText.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  // remove the current question from the available question array.
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choiceText.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    // if acceptingAnswer === true do nothing
    if (!acceptingAnswers) {
      return;
    }

    // else set it to false
    acceptingAnswers = false;

    // get a reference to the selected option by user
    const selectedChoice = e.target;

    // get the data number
    const selectedAnswer = selectedChoice.dataset["number"];
    // console.log(selectedAnswer)

    const classToApply =
      selectedAnswer == currentQuestion["answer"] ? "correct" : "incorrect";

    // add a class to the target parent
    selectedChoice.parentElement.classList.add(classToApply);

    // add to score count on every correct answer
    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    // get a new question after 1s and remove the added class.
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 500);
  });
});

// increasing the score.
const incrementScore = (num) => {
  score += num;
  scoreCount.innerText = score;
};
