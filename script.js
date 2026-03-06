document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const recipient = params.get('recipient');
    const sender = params.get('sender');
    const msg = params.get('msg');

    if (recipient && sender) {
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        startGame(recipient, sender, msg);
    } else {
        document.getElementById('generateLinkBtn').onclick = () => {
            const r = document.getElementById('recipientName').value;
            const s = document.getElementById('senderName').value;
            const m = document.getElementById('customMessage').value;
            const link = window.location.origin + window.location.pathname + 
                         `?recipient=${encodeURIComponent(r)}&sender=${encodeURIComponent(s)}&msg=${encodeURIComponent(m)}`;
            
            const linkA = document.getElementById('shareLink');
            linkA.href = link; linkA.textContent = link;
            document.getElementById('linkOutput').style.display = 'block';
        };

        document.getElementById('copyBtn').onclick = () => {
            navigator.clipboard.writeText(document.getElementById('shareLink').href).then(() => alert("Ссылка скопирована!"));
        };
    }

    function startGame(rec, sen, msg) {
        const area = document.getElementById('game-area');
        let score = 0;
        const items = [
            { icon: '❤️', isHeart: true }, { icon: '🌸', isHeart: false },
            { icon: '🌟', isHeart: false }, { icon: '🦋', isHeart: false }
        ];

        setInterval(() => {
            if (score >= 8) return;
            const randomItem = items[Math.floor(Math.random() * items.length)];
            const item = document.createElement('div');
            item.innerHTML = randomItem.icon;
            item.className = 'falling-item';
            item.style.left = Math.random() * 90 + '%';
            item.style.animation = 'fall 6s linear';
            area.appendChild(item);
            
            // Обработчик события для обоих типов (клики и тапы)
            const trigger = (e) => {
                e.preventDefault(); 
                if (randomItem.isHeart) {
                    score++;
                    document.getElementById('score').textContent = score + " / 8";
                    item.remove();
                    if(score >= 8) {
                        document.getElementById('game-screen').classList.add('hidden');
                        const c = document.getElementById('congratulations-screen');
                        c.classList.remove('hidden');
                        c.classList.add('card');
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

            item.addEventListener('touchstart', trigger, {passive: false});
            item.addEventListener('click', trigger);

            setTimeout(() => item.remove(), 6000);
        }, 600);
    }
});
