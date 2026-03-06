// Внутри функции startGame в script.js:
            
            // ... (создание item) ...
            
            // Функция обработки клика/касания
            const handleHit = (e) => {
                e.preventDefault(); // Предотвращаем дублирование клика
                if (randomItem.isHeart) {
                    score++;
                    document.getElementById('score').textContent = score + " / 8";
                    item.remove();
                    if(score >= 8) {
                        document.getElementById('game-screen').classList.add('hidden');
                        const c = document.getElementById('congratulations-screen');
                        c.classList.remove('hidden');
                        document.getElementById('finalName').textContent = rec;
                        document.getElementById('finalMsgText').textContent = msg || "С праздником!";
                        document.getElementById('finalSender').textContent = sen;
                    }
                } else {
                    item.style.transition = "all 0.3s";
                    item.style.transform = "scale(0.5) rotate(45deg)";
                    item.style.opacity = "0";
                    setTimeout(() => item.remove(), 300);
                }
            };

            // Добавляем оба события для надежности
            item.addEventListener('touchstart', handleHit, {passive: false});
            item.addEventListener('click', handleHit);

            area.appendChild(item);
            // ... (остальной код)
