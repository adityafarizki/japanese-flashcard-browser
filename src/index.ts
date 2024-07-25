import { Quiz, QuizSession, QuizQuestion } from "./quiz";
import { wordList } from "./word-list";

hideQuizPage();
showLevelSelectorPage();

let currentQuiz: Quiz;
let currentSession: QuizSession;
let answered = false;
const QUIZ_LENGTH = 50;

function hideQuizPage() {
  let quizPage = document.getElementById("quiz-page");
  quizPage.className += " d-none";
}

function getLevelButtonHTML(level: number): string {
  return `
<button
    class="btn btn-secondary m-2"
    style="height: 60px; width: 60px"
    onclick="quiz.onLevelSelect(${level})"
>
    ${level}
</button>
    `;
}

function showLevelSelectorPage() {
  let levelButtons = "";
  for (let i = 1; i <= 60; i++) {
    levelButtons += getLevelButtonHTML(i);
  }

  let levelSelectionElement = document.getElementById("level-selection");
  levelSelectionElement.innerHTML = levelButtons;

  let levelSelectionPage = document.getElementById("level-page");
  let pageClasses = levelSelectionPage.className;
  levelSelectionPage.className = pageClasses.replace("d-none", "");
}

export function onLevelSelect(level: number) {
  let quiz = selectQuiz(level);
  hideLevelSelectorPage();
  startQuiz(quiz);
}

function selectQuiz(level: number): QuizQuestion[] {
  let startIdx = QUIZ_LENGTH * (level - 1);
  let endIdx = startIdx + QUIZ_LENGTH;
  return wordList.slice(startIdx, endIdx);
}

function hideLevelSelectorPage() {
  let levelSelectionPage = document.getElementById("level-page");
  levelSelectionPage.className += " d-none";
}

function startQuiz(quiz: QuizQuestion[]) {
  currentQuiz = new Quiz(quiz);
  currentSession = currentQuiz.getNextQuiz();
  hideLevelSelectorPage();
  renderQuizPage();
  showQuizPage();
}

function showQuizPage() {
  let quizPage = document.getElementById("quiz-page");
  quizPage.className = quizPage.className.replace("d-none", "");
}

function renderQuizPage() {
  let questionWordElement = document.getElementById("current-word");
  questionWordElement.innerHTML = currentSession.question.jp;

  let progressIndicatorElement = document.getElementById("progress-indicator");
  progressIndicatorElement.innerHTML = `Remaining ${currentQuiz.remainingWords.length}/${QUIZ_LENGTH}`;

  let answerSectionHTML = "";
  for (let i = 0; i < 3; i++) {
    let buttons = "";
    for (let j = 0; j < 3; j++) {
      let idx = 3 * i + j;
      buttons += getAnswerButton(currentSession.options[idx], idx);
    }
    let row = getAnswerRow(buttons);
    answerSectionHTML += row;
  }
  let answerSectionElement = document.getElementById("answer-section");
  answerSectionElement.innerHTML = answerSectionHTML;
}

function getAnswerRow(buttons: string) {
  return `
  <div class="row align-items-center">
    ${buttons}
  </div>
  `;
}

function getAnswerButton(answer: string, idx: number) {
  return `
  <div class="col-md-4 text-center answer-container">
    <button 
      class="btn btn-outline-secondary answer-button"
      id="answer-text-${idx}" 
      onclick="quiz.submitAnswer('${answer}', ${idx})">
        <h4>${answer}</h4>
    </button>
  </div>
  `;
}

export function submitAnswer(answer: string, idx: number) {
  if (answered) {
    return;
  }
  let result = currentQuiz.submitAnswer(answer);
  let answerButton = document.getElementById(`answer-text-${idx}`);
  answered = true;

  if (result.isAnswerCorrect) {
    answerButton.className = answerButton.className.replace(
      "btn-outline-secondary",
      "btn-success"
    );
    console.log(result.isQuizFinished);
    if (result.isQuizFinished) {
      showAnswerHint();
      showFinishedStat();
      return;
    }
  } else {
    let supposedAnswerButton = document.getElementById(
      `answer-text-${currentSession.correctOptIdx}`
    );
    supposedAnswerButton.className = supposedAnswerButton.className.replace(
      "btn-outline-secondary",
      "btn-success"
    );
    answerButton.className = answerButton.className.replace(
      "btn-outline-secondary",
      "btn-danger"
    );
  }

  showAnswerHint();
  showNextQuestionButton();
}

function showFinishedStat() {
  let nextButtonPlElement = document.getElementById("next-button-placeholder");
  nextButtonPlElement.innerHTML = `Attempts: ${
    currentQuiz.numberOfTrial
  }</br>Score: ${Math.floor((QUIZ_LENGTH / currentQuiz.numberOfTrial) * 100)}%`;
  nextButtonPlElement.className = nextButtonPlElement.className.replace(
    "d-none",
    ""
  );
}

function showNextQuestionButton() {
  let nextButtonElement = document.getElementById("next-button");
  nextButtonElement.className = nextButtonElement.className.replace(
    "d-none",
    ""
  );

  let nextButtonPlElement = document.getElementById("next-button-placeholder");
  nextButtonPlElement.className += " d-none";
}

function hideNextQuestionButton() {
  let nextButtonElement = document.getElementById("next-button");
  nextButtonElement.className += " d-none";

  let nextButtonPlElement = document.getElementById("next-button-placeholder");
  nextButtonPlElement.className = nextButtonPlElement.className.replace(
    "d-none",
    ""
  );
}

function showAnswerHint() {
  let answerHintElement = document.getElementById("answer-hint");
  answerHintElement.innerHTML = `Answer: (${currentSession.question.sound}) ${
    currentSession.options[currentSession.correctOptIdx]
  }`;
}

function hideAnswerHint() {
  let answerHintElement = document.getElementById("answer-hint");
  answerHintElement.innerHTML = `&nbsp`;
}

export function nextQuestion() {
  answered = false;
  hideAnswerHint();
  hideNextQuestionButton();

  currentSession = currentQuiz.getNextQuiz();
  renderQuizPage();
}
