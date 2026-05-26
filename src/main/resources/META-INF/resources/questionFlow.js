let currentQuestionIndex = 0;
let questions = [];
let timerInterval = null;
let timeRemaining = 30;
const TOTAL_TIME = 30;
let isAnswerRevealed = false;

document.addEventListener('DOMContentLoaded', () => {
    const category = sessionStorage.getItem('selectedCategory');

    if (!category) {
        window.location.href = '/quiz-factory/categories';
        return;
    }

    document.getElementById('category-title').textContent = category;
    fetchQuestions(category);

    document.getElementById('reveal-button').addEventListener('click', toggleAnswer);
    document.getElementById('prev-button').addEventListener('click', previousQuestion);
    document.getElementById('next-button').addEventListener('click', nextQuestion);
});

async function fetchQuestions(category) {
    const loadingDiv = document.getElementById('loading');
    const questionContainer = document.getElementById('question-container');
    const errorMessage = document.getElementById('error-message');

    try {
        loadingDiv.style.display = 'flex';
        questionContainer.style.display = 'none';
        errorMessage.style.display = 'none';

        const response = await fetch(`/quizzes/list/${encodeURIComponent(category)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        questions = await response.json();

        if (questions.length === 0) {
            throw new Error('Nenhuma pergunta encontrada');
        }

        currentQuestionIndex = 0;
        loadingDiv.style.display = 'none';
        questionContainer.style.display = 'flex';
        displayQuestion();
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        loadingDiv.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showCompletionScreen();
        return;
    }

    const question = questions[currentQuestionIndex];
    isAnswerRevealed = false;

    document.getElementById('question-text').textContent = question.question;
    document.getElementById('answer-text').textContent = question.answer;
    document.getElementById('question-counter').textContent = `${currentQuestionIndex + 1}/${questions.length}`;

    const answerCard = document.getElementById('answer-card');
    answerCard.style.display = 'none';

    const revealButton = document.getElementById('reveal-button');
    revealButton.textContent = 'Revelar Resposta';
    revealButton.disabled = false;

    updateNavigationButtons();
    updateProgressDots();
    resetTimer();
    startTimer();
}

function toggleAnswer() {
    const answerCard = document.getElementById('answer-card');
    const revealButton = document.getElementById('reveal-button');

    if (isAnswerRevealed) {
        answerCard.style.display = 'none';
        revealButton.textContent = 'Revelar Resposta';
        isAnswerRevealed = false;
    } else {
        answerCard.style.display = 'block';
        revealButton.textContent = 'Ocultar Resposta';
        isAnswerRevealed = true;
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

function updateProgressDots() {
    const progressDotsContainer = document.getElementById('progress-dots');

    if (progressDotsContainer.children.length === 0) {
        for (let i = 0; i < questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i < currentQuestionIndex) {
                dot.classList.add('completed');
            }
            if (i === currentQuestionIndex) {
                dot.classList.add('active');
            }
            dot.onclick = () => goToQuestion(i);
            progressDotsContainer.appendChild(dot);
        }
    } else {
        const dots = progressDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < currentQuestionIndex) {
                dot.classList.add('completed');
            }
            if (index === currentQuestionIndex) {
                dot.classList.add('active');
            }
        });
    }
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    displayQuestion();
}

function resetTimer() {
    timeRemaining = TOTAL_TIME;
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    updateTimerDisplay();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
        }

        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const timerValue = document.getElementById('timer-value');
    const timerCircle = document.getElementById('timer-circle');

    timerValue.textContent = timeRemaining;

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (timeRemaining / TOTAL_TIME) * circumference;
    timerCircle.style.strokeDashoffset = offset;

    if (timeRemaining <= 10) {
        timerCircle.style.stroke = '#f94144';
    } else if (timeRemaining <= 20) {
        timerCircle.style.stroke = '#f9c74f';
    } else {
        timerCircle.style.stroke = '#277da1';
    }
}

function showCompletionScreen() {
    const questionContainer = document.getElementById('question-container');
    const completionScreen = document.getElementById('completion-screen');

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    questionContainer.style.display = 'none';
    completionScreen.style.display = 'flex';
}
