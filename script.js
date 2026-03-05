document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const gameScreen = document.getElementById('game-screen');
    const congratsScreen = document.getElementById('congratulations-screen');
    
    const TARGET_SCORE = 8;
    let currentScore = 0;
    let dropInterval = 1000; // Интервал начала падения (1 секунда)
    let gameTimer;

    const heartEmoji = '❤️';
    const flowerEmoji = '🌸';
    
    // Инициализация
    updateScoreDisplay();
    startGame();

    function updateScoreDisplay() {
        scoreDisplay.textContent = `${currentScore} / ${TARGET_SCORE}`;
    }

    function startGame() {
        // Очищаем старые элементы, если они есть
        gameArea.innerHTML = '';
        currentScore = 0;
        updateScoreDisplay();
        
        // Запускаем цикл генерации объектов
        gameTimer = setInterval(createFallingItem, dropInterval);
        
        // Если нужно, чтобы объекты падали чаще по мере набора очков, можно уменьшать interval
        // dropInterval = Math.max(300, 1000 - currentScore * 50);
    }

    function createFallingItem() {
        if (currentScore >= TARGET_SCORE) {
            clearInterval(gameTimer);
            return;
        }

        const item = document.createElement('div');
        
        // Случайно выбираем, что будет падать
        const isHeart = Math.random() < 0.8; // 80% шанс, что это будет сердечко
        
        item.textContent = isHeart ? heartEmoji : flowerEmoji;
        item.classList.add('falling-item');
        
        // Устанавливаем начальные стили
        const startX = Math.random() * (gameArea.clientWidth - 50); // Начальная позиция по горизонтали
        item.style.left = `${startX}px`;
        item.style.top = `-50px`; // Начинаем выше области видимости
        item.dataset.caught = 'false'; // Флаг, поймано ли сердце

        // Устанавливаем анимацию (продолжительность падения зависит от высоты)
        const fallDuration = 4 + Math.random() * 3; // Падение от 4 до 7 секунд
        item.style.animation = `fall ${fallDuration}s linear forwards`;

        gameArea.appendChild(item);

        // 1. Обработка клика (попытка поймать)
        item.addEventListener('click', () => {
            if (isHeart && item.dataset.caught === 'false') {
                catchItem(item);
            } else if (!isHeart) {
                // Если это цветок, он просто исчезает, ничего не засчитывая
                item.remove();
            }
        });

        // 2. Проверка, долетел ли объект до низа
        item.addEventListener('animationend', () => {
            if (item.dataset.caught === 'false') {
                // Если объект долетел до низа и не был пойман (и это было сердце)
                if (isHeart) {
                    // Можно добавить штраф или просто ничего не делать
                }
                item.remove();
            }
        });
    }

    function catchItem(itemElement) {
        if (itemElement.dataset.caught === 'true') return;

        itemElement.dataset.caught = 'true';
        currentScore++;
        updateScoreDisplay();

        // Визуальное подтверждение поимки
        itemElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        itemElement.style.transform = 'scale(1.5)';
        itemElement.style.opacity = '0';
        
        // Удаляем элемент через короткое время
        setTimeout(() => {
            itemElement.remove();
            checkWinCondition();
        }, 300);
    }

    function checkWinCondition() {
        if (currentScore >= TARGET_SCORE) {
            clearInterval(gameTimer);
            
            // Скрываем игру и показываем поздравление
            gameScreen.classList.add('hidden');
            congratsScreen.classList.remove('hidden');
            
            // Добавляем финальный "взрыв" элементов на экране поздравления (опционально)
        }
    }
});
