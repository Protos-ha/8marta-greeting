document.addEventListener('DOMContentLoaded', () => {
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const congratsScreen = document.getElementById('congratulations-screen');
    
    // Проверка параметров в URL
    const params = new URLSearchParams(window.location.search);
    const recipient = params.get('recipient');
    const sender = params.get('sender');

    if (recipient && sender) {
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        document.getElementById('gameRecipientTitle').textContent = "для " + recipient;
        startGame();
    } else {
        document.getElementById('generateLinkBtn').onclick = () => {
            const r = document.getElementById('recipientName').value;
            const s = document.getElementById('senderName').value;
            const link = window.location.origin + window.location.pathname + `?recipient=${encodeURIComponent(r)}&sender=${encodeURIComponent(s)}`;
            
            const out = document.getElementById('linkOutput');
            const linkA = document.getElementById('shareLink');
            linkA.href = link;
            linkA.textContent = link;
            out.style.display = 'block';
        };
    }

    function startGame() {
        const area = document.getElementById('game-area');
        let score = 0;
        setInterval(() => {
            if (score >= 8) return;
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.className = 'falling-item';
            heart.style.left = Math.random() * 80 + '%';
            heart.style.animation = 'fall 5s linear';
            area.appendChild(heart);
            
            heart.onclick = () => {
                score++;
                document.getElementById('score').textContent = score + " / 8";
                heart.remove();
                if(score >= 8) {
                    gameScreen.classList.add('hidden');
                    congratsScreen.classList.remove('hidden');
                    document.getElementById('finalName').textContent = recipient;
                }
            };
            setTimeout(() => heart.remove(), 5000);
        }, 1000);
    }
});
