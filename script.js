document.addEventListener('DOMContentLoaded', () => {
    // ... (Объявление переменных остается прежним) ...
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const congratsScreen = document.getElementById('congratulations-screen');
    
    // ... (Остальные переменные остаются прежними) ...
    
    const urlParams = new URLSearchParams(window.location.search);
    const recipient = urlParams.get('recipient');
    const sender = urlParams.get('sender');
    const customMsgParam = urlParams.get('msg');

    // --- ИСПРАВЛЕННАЯ ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ ---
    if (recipient && sender) {
        // Параметры найдены - запускаем игру
        setupScreen.classList.add('hidden'); // СКРЫВАЕМ НАСТРОЙКИ
        congratsScreen.classList.add('hidden'); // СКРЫВАЕМ ПОЗДРАВЛЕНИЕ (если оно было)
        gameScreen.classList.remove('hidden'); // ПОКАЗЫВАЕМ ИГРУ
        initializeGame(recipient, sender, customMsgParam);
    } else {
        // Параметров нет (первый запуск или чистая ссылка) - показываем форму настройки
        setupScreen.classList.remove('hidden'); // ПОКАЗЫВАЕМ НАСТРОЙКИ
        gameScreen.classList.add('hidden');    // СКРЫВАЕМ ИГРУ
        congratsScreen.classList.add('hidden');
        
        generateLinkBtn.addEventListener('click', generateLink);
    }

    // --- ОСТАЛЬНЫЕ ФУНКЦИИ (generateLink, initializeGame, startGame и т.д.) остаются БЕЗ ИЗМЕНЕНИЙ ---

    function generateLink() {
        // ... (Код генерации ссылки остается прежним) ...
        const recName = setupRecipientName.value.trim();
        const sendName = setupSenderName.value.trim();
        const customMsg = setupCustomMessage.value.trim();

        if (!recName || !sendName) {
            alert("Пожалуйста, введите имя получателя и ваше имя!");
            return;
        }

        const encodedRecipient = encodeURIComponent(recName);
        const encodedSender = encodeURIComponent(sendName);
        const encodedMsg = encodeURIComponent(customMsg);
        
        const baseUrl = window.location.origin + window.location.pathname;
        let link = `${baseUrl}?recipient=${encodedRecipient}&sender=${encodedSender}`;
        
        if (customMsg) {
            link += `&msg=${encodedMsg}`;
        }
        
        // ВЫВОДИМ ССЫЛКУ ДЛЯ КОПИРОВАНИЯ
        linkOutput.classList.remove('hidden');
        shareLinkEl.href = link; 
        shareLinkEl.textContent = link;

        // ПЕРЕНАПРАВЛЯЕМ НА ИГРУ С ПАРАМЕТРАМИ
        // Это необходимо, чтобы сразу перейти к игровому экрану с заданными именами
        window.location.href = link;
    }
    
    // ... (Остальной код initializeGame, startGame, createFallingItem, catchItem, checkWinCondition) ...

    function initializeGame(recName, sendName, msgParam) {
        // Обновляем заголовки
        gameRecipientTitle.textContent = `для ${recName}`;
        
        // Устанавливаем финальный текст
        const finalMsgText = msgParam && msgParam.length > 0 ? msgParam : "С праздником весны! Желаю тебе счастья, здоровья и только ярких дней. Ты — самая лучшая! 🌸";
        finalMessage.textContent = finalMsgText;
        finalSender.textContent = sendName;
        finalGreeting.innerHTML = `С Днём 8 Марта, ${recName}!`;
        
        // Устанавливаем ссылку для шаринга на конечном экране
        shareLinkEl.href = window.location.href;
        shareLinkEl.textContent = window.location.href;

        startGame();
    }

    function startGame() {
        const gameArea = document.getElementById('game-area');
        const scoreDisplay = document.getElementById('score');
        
        gameArea.innerHTML = '';
        currentScore = 0;
        updateScoreDisplay(scoreDisplay);
        
        gameTimer = setInterval(createFallingItem, dropInterval);
    }

    function updateScoreDisplay(displayElement) {
        displayElement.textContent = `${currentScore} / ${TARGET_SCORE}`;
    }

    function createFallingItem() {
        if (currentScore >= TARGET_SCORE) {
            clearInterval(gameTimer);
            return;
        }

        const item = document.createElement('div');
        
        const isHeart = Math.random() < 0.8;
        
        item.textContent = isHeart ? heartEmoji : flowerEmoji;
        item.classList.add('falling-item');
        
        const startX = Math.random() * (gameArea.clientWidth - 50);
        item.style.left = `${startX}px`;
        item.style.top = `-50px`; 
        item.dataset.caught = 'false';

        const fallDuration = 4 + Math.random() * 3;
        item.style.animation = `fall ${fallDuration}s linear forwards`;

        gameArea.appendChild(item);

        // Обработка клика
        item.addEventListener('click', () => {
            if (isHeart && item.dataset.caught === 'false') {
                catchItem(item);
            } else if (!isHeart) {
                item.remove();
            }
        });

        // Проверка, долетел ли объект
        item.addEventListener('animationend', () => {
            if (item.dataset.caught === 'false') {
                item.remove();
            }
        });
    }

    function catchItem(itemElement) {
        if (itemElement.dataset.caught === 'true') return;

        itemElement.dataset.caught = 'true';
        currentScore++;
        updateScoreDisplay(document.getElementById('score'));

        itemElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        itemElement.style.transform = 'scale(1.5)';
        itemElement.style.opacity = '0';
        
        setTimeout(() => {
            itemElement.remove();
            checkWinCondition();
        }, 300);
    }

    function checkWinCondition() {
        if (currentScore >= TARGET_SCORE) {
            clearInterval(gameTimer);
            
            gameScreen.classList.add('hidden');
            congratsScreen.classList.remove('hidden');
        }
    }
});
