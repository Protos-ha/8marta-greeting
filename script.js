document.addEventListener('DOMContentLoaded', () => {
    // Элементы управления
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const congratsScreen = document.getElementById('congratulations-screen');
    
    // Элементы настройки
    const setupRecipientName = document.getElementById('recipientName');
    const setupSenderName = document.getElementById('senderName');
    const setupCustomMessage = document.getElementById('customMessage');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    const linkOutput = document.getElementById('linkOutput');
    
    // Элементы игры и поздравления
    const gameRecipientTitle = document.getElementById('gameRecipientTitle');
    const finalGreeting = document.getElementById('finalGreeting');
    const finalMessage = document.getElementById('finalMessage');
    const finalSender = document.getElementById('finalSender');
    const shareLinkEl = document.getElementById('shareLinkFinal');

    const TARGET_SCORE = 8;
    let currentScore = 0;
    let dropInterval = 1000;
    let gameTimer;

    const heartEmoji = '❤️';
    const flowerEmoji = '🌸';
    
    // --- 1. Инициализация и определение, какой экран показывать ---

    const urlParams = new URLSearchParams(window.location.search);
    const recipient = urlParams.get('recipient');
    const sender = urlParams.get('sender');
    const customMsgParam = urlParams.get('msg');

    // --- Логика показа экрана ---
    if (recipient && sender) {
        // Параметры найдены - запускаем игру
        setupScreen.classList.add('hidden');
        congratsScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initializeGame(recipient, sender, customMsgParam);
    } else {
        // Параметров нет - показываем форму настройки
        setupScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        congratsScreen.classList.add('hidden');
        
        generateLinkBtn.addEventListener('click', generateLink);
    }

    // --- 2. Генерация ссылки ---
    
    function generateLink() {
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
        
        // Выводим ссылку для копирования
        linkOutput.classList.remove('hidden');
        shareLinkEl.href = link; 
        shareLinkEl.textContent = link;
        
        // Перенаправляем на игру с параметрами, чтобы запустить игру сразу
        window.location.href = link;
    }
    
    // --- 3. Игровая логика ---

    function initializeGame(recName, sendName, msgParam) {
        gameRecipientTitle.textContent = `для ${recName}`;
        
        const finalMsgText = msgParam && msgParam.length > 0 ? msgParam : "С праздником весны! Желаю тебе счастья, здоровья и только ярких дней. Ты — самая лучшая! 🌸";
        finalMessage.textContent = finalMsgText;
        finalSender.textContent = sendName;
        finalGreeting.innerHTML = `С Днём 8 Марта, ${recName}!`;
        
        shareLinkEl.href = window.location.href;
        shareLinkEl.textContent = window.location.href;

        // Запускаем игру с задержкой, чтобы убедиться, что браузер отрисовал DOM
        requestAnimationFrame(() => {
             requestAnimationFrame(startGame); 
        });
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

        const gameArea = document.getElementById('game-area');
        
        // *** Проверка ширины: если контейнер еще не отрисован (ширина 0), пропускаем кадр ***
        if (gameArea.clientWidth === 0) {
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
        // Задаем анимацию напрямую, без использования класса, чтобы избежать конфликтов
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
