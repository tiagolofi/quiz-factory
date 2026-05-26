const COLORS = [
    'red',
    'orange',
    'yellow',
    'light-orange',
    'light-yellow',
    'green',
    'teal',
    'dark-teal',
    'blue'
];

const EMOJIS = ['📚', '🎓', '🧬', '💡', '🎨', '⚽', '🎭', '📚', '🔬', '🌍'];

let allCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    const categoriesGrid = document.getElementById('categories-grid');
    const loadingDiv = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const categoryInput = document.getElementById('category');

    fetchCategories();

    // Sugestões de categoria ao digitar
    if (categoryInput) {
        categoryInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            const suggestions = document.getElementById('category-suggestions');
            
            if (value.length > 0) {
                const filtered = allCategories.filter(cat => 
                    cat.toLowerCase().includes(value)
                );
                
                if (filtered.length > 0) {
                    suggestions.innerHTML = filtered.map(cat => 
                        `<div class="suggestion-item" onclick="selectCategoryFromSuggestion('${cat}')">${cat}</div>`
                    ).join('');
                    suggestions.classList.add('active');
                } else {
                    suggestions.classList.remove('active');
                }
            } else {
                suggestions.classList.remove('active');
            }
        });

        // Fechar sugestões ao clicar fora
        document.addEventListener('click', (e) => {
            const suggestions = document.getElementById('category-suggestions');
            if (!e.target.closest('#category') && !e.target.closest('.suggestions')) {
                suggestions.classList.remove('active');
            }
        });
    }

    async function fetchCategories() {
        try {
            loadingDiv.style.display = 'flex';
            categoriesGrid.style.display = 'none';
            errorMessage.style.display = 'none';

            const response = await fetch('/quizzes/categories');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            allCategories = await response.json();
            renderCategories(allCategories);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            loadingDiv.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    }

    function renderCategories(categories) {
        categoriesGrid.innerHTML = '';

        categories.forEach((category, index) => {
            const colorClass = COLORS[index % COLORS.length];
            const emoji = EMOJIS[index % EMOJIS.length];

            const card = document.createElement('div');
            card.className = `category-card ${colorClass}`;
            card.onclick = () => selectCategory(category);

            card.innerHTML = `
                <div class="category-icon">${emoji}</div>
                <div class="category-name">${category}</div>
                <div class="category-description">Quiz nesta categoria</div>
            `;

            categoriesGrid.appendChild(card);
        });

        loadingDiv.style.display = 'none';
        categoriesGrid.style.display = 'grid';
    }
});

function selectCategory(categoryName) {
    sessionStorage.setItem('selectedCategory', categoryName);
    window.location.href = '/quiz-factory/question-flow';
}

function toggleNewQuizForm() {
    const modal = document.getElementById('new-quiz-modal');
    if (modal.style.display === 'none') {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }
}

function selectCategoryFromSuggestion(category) {
    document.getElementById('category').value = category;
    document.getElementById('category-suggestions').classList.remove('active');
}

async function submitNewQuiz(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const quiz = {
        question: document.getElementById('question').value,
        answer: document.getElementById('answer').value,
        level: document.getElementById('level').value,
        category: document.getElementById('category').value,
        value: parseInt(document.getElementById('value').value)
    };

    try {
        const response = await fetch('/quizzes/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quiz)
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        // Sucesso
        const successMessage = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        successText.textContent = `Pergunta adicionada com sucesso na categoria "${quiz.category}"!`;
        successMessage.style.display = 'block';

        toggleNewQuizForm();
        resetForm();

        // Atualizar lista de categorias
        setTimeout(() => {
            location.reload();
        }, 2000);

    } catch (error) {
        console.error('Erro ao adicionar pergunta:', error);
        alert('Erro ao adicionar pergunta. Tente novamente.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Adicionar Pergunta';
    }
}

function resetForm() {
    document.getElementById('new-quiz-form').reset();
}
