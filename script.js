
"use strict";

// 1. Quiz questions and explanations
const questions = [
  {
    question: "You receive an email asking you to verify your bank account through an unfamiliar link. What should you do?",
    options: [
      "Click the link immediately",
      "Reply with your bank password",
      "Avoid the link and verify through the bank's official website",
      "Forward the email to all your friends"
    ],
    answer: 2,
    explanation: "This may be phishing. Never trust unexpected links asking for sensitive information. Open the official website yourself or contact the bank."
  },
  {
    question: "Which is the strongest password practice?",
    options: [
      "Use your name and birth year",
      "Use a long, unique password for every account",
      "Use the same password everywhere",
      "Use the word password123"
    ],
    answer: 1,
    explanation: "Long, unique passwords reduce the risk of one compromised account affecting your other accounts. A password manager can help."
  },
  {
    question: "What is the main purpose of multi-factor authentication (MFA)?",
    options: [
      "To make the internet faster",
      "To remove the need for passwords in every case",
      "To add another verification step to sign-in",
      "To delete viruses automatically"
    ],
    answer: 2,
    explanation: "MFA adds another proof of identity, such as an authenticator app or security key, making stolen passwords less useful."
  },
  {
    question: "What should you do before using public Wi-Fi for sensitive activities?",
    options: [
      "Trust every network with a familiar name",
      "Turn off all security settings",
      "Share your hotspot password publicly",
      "Verify the network and use secure connections; avoid sensitive tasks on untrusted networks"
    ],
    answer: 3,
    explanation: "Fake Wi-Fi networks can imitate legitimate hotspots. Verify the network and use HTTPS. A trusted VPN may add protection, but it does not make every activity safe."
  },
  {
    question: "What does ransomware typically do?",
    options: [
      "Encrypts or locks data and demands payment",
      "Improves computer performance",
      "Creates stronger passwords",
      "Updates your operating system"
    ],
    answer: 0,
    explanation: "Ransomware can encrypt files and demand money. Keep backups, update software and avoid suspicious attachments."
  },
  {
    question: "Which website connection is generally safer for sending information?",
    options: [
      "A site with no address bar",
      "A site using HTTPS with a valid certificate and the correct domain",
      "Any site that displays a padlock, regardless of its domain",
      "A website with many advertisements"
    ],
    answer: 1,
    explanation: "HTTPS encrypts data in transit, but it does not prove a website is trustworthy. Check the domain and be alert for impersonation."
  },
  {
    question: "You find an unknown USB drive in your college lab. What is the safest action?",
    options: [
      "Plug it in to identify the owner",
      "Open every file on it",
      "Use it on your personal laptop first",
      "Do not plug it in; hand it to the responsible IT staff"
    ],
    answer: 3,
    explanation: "Unknown USB devices can contain malicious software. Give the device to your college's IT or security team."
  },
  {
    question: "What is social engineering in cybersecurity?",
    options: [
      "Building social media websites",
      "Upgrading computer hardware",
      "Manipulating people into revealing information or taking unsafe actions",
      "Encrypting files with a password"
    ],
    answer: 2,
    explanation: "Social engineering exploits human trust or urgency. Verify unusual requests, especially those involving money, passwords or confidential data."
  },
  {
    question: "Why should you install security updates?",
    options: [
      "They can fix vulnerabilities and security bugs",
      "They make every online attack impossible",
      "They automatically back up every file",
      "They remove the need for antivirus software"
    ],
    answer: 0,
    explanation: "Updates often patch known vulnerabilities. Install updates from official sources and keep applications and operating systems current."
  },
  {
    question: "You receive an unexpected login approval request that you did not initiate. What should you do?",
    options: [
      "Approve it to make the notification disappear",
      "Reject it, secure your account and investigate the activity",
      "Share the approval code with the requester",
      "Ignore repeated requests forever"
    ],
    answer: 1,
    explanation: "Reject unexpected login requests. Change your password from the official service if needed, review account sessions and enable strong MFA."
  }
];

// 2. Get HTML elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const greeting = document.getElementById("greeting");
const timerElement = document.getElementById("timer");
const timeText = document.getElementById("timeText");
const questionCounter = document.getElementById("questionCounter");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedback = document.getElementById("feedback");

const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const scoreValue = document.getElementById("scoreValue");
const scorePercent = document.getElementById("scorePercent");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const finalTime = document.getElementById("finalTime");
const reviewList = document.getElementById("reviewList");

// 3. Quiz state
const QUIZ_DURATION = 5 * 60;

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = QUIZ_DURATION;
let timerId = null;
let hasAnswered = false;
let quizFinished = false;
let playerName = "";
let userAnswers = [];

// 4. Start the quiz
startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  clearInterval(timerId);

  playerName = playerNameInput.value.trim();
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = QUIZ_DURATION;
  hasAnswered = false;
  quizFinished = false;
  userAnswers = [];

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  greeting.textContent = playerName
    ? `Good luck, ${playerName}!`
    : "Let's get started";

  timerElement.classList.remove("warning");

  renderQuestion();
  updateTimerDisplay();
  timerId = setInterval(updateTimer, 1000);
}

// 5. Display a question and its options
function renderQuestion() {
  hasAnswered = false;

  const currentQuestion = questions[currentQuestionIndex];
  const questionPosition = currentQuestionIndex + 1;
  const progress = (questionPosition / questions.length) * 100;

  questionCounter.textContent =
    `QUESTION ${questionPosition} OF ${questions.length}`;
  progressPercent.textContent = `${Math.round(progress)}%`;
  progressFill.style.width = `${progress}%`;

  questionNumber.textContent =
    `QUESTION ${String(questionPosition).padStart(2, "0")}`;
  questionText.textContent = currentQuestion.question;

  optionsContainer.replaceChildren();
  feedback.className = "feedback hidden";
  feedback.replaceChildren();

  nextBtn.disabled = true;
  nextBtn.innerHTML = questionPosition === questions.length
    ? 'See results <span>→</span>'
    : 'Next question <span>→</span>';

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = option;

    button.append(letter, text);
    button.addEventListener("click", () => selectAnswer(index));

    optionsContainer.appendChild(button);
  });
}

// 6. Check the selected answer
function selectAnswer(selectedIndex) {
  if (hasAnswered || quizFinished) return;

  hasAnswered = true;

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.answer;

  userAnswers[currentQuestionIndex] = selectedIndex;

  if (isCorrect) {
    score++;
  }

  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === currentQuestion.answer) {
      button.classList.add("correct");
      button.querySelector(".option-letter").textContent = "✓";
    } else if (index === selectedIndex && !isCorrect) {
      button.classList.add("incorrect");
      button.querySelector(".option-letter").textContent = "×";
    }
  });

  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;

  const heading = document.createElement("strong");
  heading.textContent = isCorrect
    ? "✓ Correct answer!"
    : "✕ Not quite!";

  const explanation = document.createElement("p");
  explanation.textContent = currentQuestion.explanation;

  feedback.append(heading, explanation);
  nextBtn.disabled = false;
}

// 7. Move to the next question
nextBtn.addEventListener("click", () => {
  if (!hasAnswered || quizFinished) return;

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

// 8. Timer
function updateTimer() {
  if (quizFinished) return;

  timeLeft = Math.max(0, timeLeft - 1);
  updateTimerDisplay();

  if (timeLeft <= 30) {
    timerElement.classList.add("warning");
  }

  if (timeLeft === 0) {
    finishQuiz();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timeText.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// 9. Calculate and display results
function finishQuiz() {
  if (quizFinished) return;

  quizFinished = true;
  clearInterval(timerId);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const incorrect = total - score;

  resultIcon.textContent = percentage >= 70 ? "✓" : "!";
  resultTitle.textContent = percentage >= 70
    ? "Great work!"
    : "Keep learning!";

  const namePrefix = playerName ? `${playerName}, ` : "";
  resultMessage.textContent =
    `${namePrefix}you scored ${score} out of ${total}. ${
      percentage >= 70
        ? "You have a good foundation in cybersecurity awareness."
        : "Review the explanations below and try again to improve your score."
    }`;

  scoreValue.textContent = score;
  scorePercent.textContent = `${percentage}% accuracy`;
  correctCount.textContent = score;
  wrongCount.textContent = incorrect;
  finalTime.textContent = formatTime(timeLeft);

  renderReview();
}

// 10. Show answer review
function renderReview() {
  reviewList.replaceChildren();

  questions.forEach((question, index) => {
    const selectedIndex = userAnswers[index];
    const isCorrect = selectedIndex === question.answer;

    const item = document.createElement("article");
    item.className = `review-item ${
      selectedIndex === undefined
        ? "review-wrong"
        : isCorrect
          ? "review-correct"
          : "review-wrong"
    }`;

    const status = document.createElement("span");
    status.className = "review-status";
    status.textContent = selectedIndex === undefined
      ? "Not answered"
      : isCorrect
        ? "✓ Correct"
        : "✕ Incorrect";

    const title = document.createElement("h4");
    title.textContent = `${index + 1}. ${question.question}`;

    const yourAnswer = document.createElement("p");
    yourAnswer.textContent = selectedIndex === undefined
      ? "Your answer: No answer selected."
      : `Your answer: ${question.options[selectedIndex]}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.textContent =
      `Correct answer: ${question.options[question.answer]}`;

    const explanation = document.createElement("p");
    explanation.textContent = `Why: ${question.explanation}`;

    item.append(status, title, yourAnswer, correctAnswer, explanation);
    reviewList.appendChild(item);
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// 11. Restart the quiz
restartBtn.addEventListener("click", () => {
  clearInterval(timerId);
  resultScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  playerNameInput.focus();
});
