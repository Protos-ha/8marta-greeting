Отлично. Чтобы все заработало корректно (сначала настройки, потом игра по ссылке, и чтобы анимация работала), нам нужно убедиться, что HTML настроен на показ по умолчанию, а JS использует перенаправление для запуска игры.

Вот полный, итоговый комплект кода:

1. HTML (index.html) - Убедитесь, что у #setup-screen НЕТ класса hidden
html

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Поздравление для Маши!</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Секция настройки: НЕ ДОЛЖЕН ИМЕТЬ КЛАСС "hidden" ПРИ ПЕРВОМ ЗАПУСКЕ -->
    <div id="setup-screen"> 
        <h1>Настройка поздравления</h1>
        
        <div class="input-group">
            <label for="recipientName">Имя получателя (например, Маша):</label>
            <input type="text" id="recipientName" value="Маша">
        </div>

        <div class="input-group">
            <label for="senderName">Ваше имя (отправитель):</label>
            <input type="text" id="senderName" value="Дима">
        </div>

        <div class="input-group">
            <label for="customMessage">Основное поздравление (оставить пустым для стандартного):</label>
            <textarea id="customMessage" rows="3"></textarea>
        </div>
        
        <button id="generateLinkBtn">Сгенерировать ссылку</button>
        
        <p id="linkOutput" class="hidden">
            Ваша ссылка: <a id="shareLink" href="#" target="_blank"></a>
        </p>
    </div>

    <!-- Первый экран: Игра (Должен быть скрыт) -->
    <div id="game-screen" class="hidden">
        <h1>Поймай 8 сердечек ❤️</h1>
        <h2 id="gameRecipientTitle">для [Имя]</h2>
        
        <div class="counter-container">
            <div id="score">0 / 8</div>
        </div>
        
        <div id="game-area">
        </div>
    </div>

    <!-- Второй экран: Поздравление -->
    <div id="congratulations-screen" class="hidden">
        <div class="flower-bouquet">
            💐
        </div>
        <h1 id="finalGreeting">С Днём 8 Марта, [Имя]!</h1>
        <p id="finalMessage">С праздником весны! Желаю тебе счастья, здоровья и только ярких дней. Ты — самая лучшая! 🌸</p>
        <p class="signature">— <span id="finalSender">Дима</span></p>
        
        <div class="final-message">
            🎉 Ты поймала все 8 сердечек! 🎉
        </div>
        <div id="shareLinkContainer" style="margin-top: 20px;">
            Поделись этой игрой: <a id="shareLinkFinal" href="#" target="_blank">Ссылка</a>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
2. CSS (style.css)
css

body {
    font-family: 'Arial', sans-serif;
    background-color: #fce4ec; /* Очень светлый розовый фон */
    color: #5e35b1; /* Фиолетовый цвет текста для контраста */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    overflow: hidden;
}

/* --- Стили для Настройки --- */
#setup-screen {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    max-width: 600px;
}
.input-group {
    text-align: left;
    margin-bottom: 15px;
}
#setup-screen label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}
#setup-screen input, #setup-screen textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}
#generateLinkBtn {
    padding: 10px 20px;
    background-color: #d81b60;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1em;
    margin-top: 10px;
}
#linkOutput {
    margin-top: 20px;
    padding: 15px;
    background-color: #e1bee7;
    border-radius: 8px;
    word-break: break-all;
    text-align: left;
}
#linkOutput a {
    color: #4a148c;
}

/* --- Стили для Игры --- */
#game-screen {
    text-align: center;
    width: 100%;
    max-width: 800px;
    padding: 20px;
}

#game-screen h1 {
    font-size: 2.5em;
    margin-bottom: 5px;
}

#game-screen h2 {
    font-size: 1.5em;
    margin-top: 0;
    color: #d81b60;
}

/* Счетчик */
.counter-container {
    margin: 20px auto;
    width: 150px;
    padding: 10px;
    border: 2px solid #ad1457;
    border-radius: 15px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#score {
    font-size: 1.5em;
    font-weight: bold;
    color: #d81b60;
}

/* Зона игры (БЕЗ РАМКИ) */
#game-area {
    position: relative;
    width: 100%;
    height: 500px;
    background-color: transparent;
    border-radius: 10px;
    overflow: hidden;
    cursor: crosshair;
}

/* Стили для падающих объектов (сердечек и цветов) */
.falling-item {
    position: absolute;
    font-size: 30px;
    cursor: pointer;
    transition: transform 0.5s linear, opacity 0.5s;
    user-select: none; 
}

@keyframes fall {
    0% {
        transform: translateY(-100px);
        opacity: 1;
    }
    100% {
        transform: translateY(600px);
        opacity: 0.1;
    }
}

/* --- Стили для Поздравления --- */
#congratulations-screen {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    animation: fadeIn 1s ease-in-out;
}

#congratulations-screen h1 {
    color: #d81b60;
    font-size: 3em;
    margin: 10px 0;
}

#congratulations-screen p {
    font-size: 1.2em;
    color: #6a1b9a;
    line-height: 1.6;
}

#congratulations-screen .flower-bouquet {
    font-size: 4em;
    margin-bottom: 10px;
}

#congratulations-screen .signature {
    font-style: italic;
    color: #ad1457;
    margin-top: 20px;
}

.final-message {
    margin-top: 30px;
    padding: 15px;
    font-size: 1.4em;
    font-weight: bold;
    color: white;
    background-color: #8e24aa;
    border-radius: 10px;
    display: inline-block;
}

.hidden {
    display: none !important;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
3. JavaScript (script.js)
javascript

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

    // --- 2. Генерация ссылки (Без автоматического редиректа) ---
    
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
        
        // ВАЖНО: Перенаправление убрано, чтобы пользователь мог скопировать ссылку.
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

        // Запуск игры с задержкой для надежной отрисовки DOM
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
