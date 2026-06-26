const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('active'));
}, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let counterStarted = false;
const finaleObserver = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !counterStarted) {
        counterStarted = true;
        setTimeout(() => {
            const el = document.getElementById('counter');
            const target = 93.21;
            const duration = 3500;
            let start = null;
            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / duration, 1);
                const val = (1 - Math.pow(1 - p, 3)) * target;
                el.innerText = val.toFixed(2).toLocaleString('ar-EG') + '%';
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            createConfetti();
        }, 300);
    }
}, { threshold: 0.4 });
finaleObserver.observe(document.getElementById('finale'));

function createConfetti() {
    const c = document.getElementById('confetti-container');
    const colors = ['#9d50bb', '#f5b9a6', '#edb1ff', '#ffffff', '#ebddff'];
    for (let i = 0; i < 150; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const s = Math.random() * 10 + 4;
        Object.assign(p.style, {
            width: s + 'px', height: s + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 100 + '%', top: '100%'
        });
        c.appendChild(p);
        const a = p.animate([
            { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${(Math.random() - 0.5) * 800}px,${-(Math.random() * 1000 + 400)}px) rotate(${Math.random() * 1080}deg) scale(0)`, opacity: 0 }
        ], { duration: Math.random() * 2500 + 3500, easing: 'cubic-bezier(0,.9,.57,1)' });
        a.onfinish = () => p.remove();
    }
}

const icons = ['star', 'favorite', 'celebration', 'music_note', 'photo_camera', 'videocam', 'palette', 'self_improvement', 'diversity_3', 'volunteer_activism'];
const colors = ['secondary', 'primary', 'tertiary', 'secondary', 'primary'];
const players = [];
const playerStates = [];

function toEmbedUrl(url) {
    const m = url.trim().match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&controls=0` : url.trim();
}

function createVideoCard(title, desc, url, i) {
    const isRev = i % 2 === 0;
    const id = `yt-${i}`;
    const embedUrl = toEmbedUrl(url);

    const card = document.createElement('div');
    card.className = `reveal flex flex-col md:flex-row${isRev ? '-reverse' : ''} items-center justify-center gap-8 md:gap-16${i % 2 ? ' md:-translate-x-12' : ''}${i % 3 === 0 ? ' md:translate-x-16' : ''}`;

    card.innerHTML = `
        <div class="md:w-5/12 flex ${isRev ? 'justify-start' : 'justify-end'} ${isRev ? 'order-2 md:order-1' : 'md:order-1'}">
            <div class="comic-bubble${isRev ? '' : ' left'} max-w-md">
                <span class="font-label-md text-secondary mb-2 block tracking-widest">${title}</span>
                <p class="font-body-lg text-body-lg text-on-surface leading-relaxed">${desc}</p>
            </div>
        </div>
        <div class="relative flex items-center justify-center ${isRev ? 'order-1 md:order-2' : 'md:order-2'}">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-${colors[i % colors.length]}-container/20 border-2 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-${colors[i % colors.length]} text-2xl md:text-3xl" style="font-variation-settings:'FILL'1">${icons[i % icons.length]}</span>
            </div>
        </div>
        <div class="md:w-5/12 order-3">
            <div class="glass-panel p-2 md:p-3 rounded-2xl overflow-hidden ${isRev ? 'rotate-2 md:rotate-3' : '-rotate-2 md:-rotate-3'} hover:rotate-0 transition-all duration-700 shadow-2xl group">
                <div class="relative aspect-[4/3] rounded-lg overflow-hidden bg-black">
                    <div id="${id}"></div>
                    <button class="yt-play-btn" data-player="${i}"><span class="material-symbols-outlined text-3xl md:text-4xl">pause</span></button>
                </div>
            </div>
        </div>`;

    document.getElementById('timeline-cards').appendChild(card);
    observer.observe(card);

    playerStates[i] = { playing: true };
    players[i] = new YT.Player(id, {
        videoId: toEmbedUrl(url).match(/embed\/([^?]+)/)[1],
        width: '100%', height: '100%',
        playerVars: { autoplay: 1, mute: 1, loop: 1, controls: 0, rel: 0 },
        events: {
            onReady: () => players[i].playVideo(),
            onStateChange: (e) => {
                const btn = card.querySelector('.yt-play-btn');
                if (!btn) return;
                playerStates[i].playing = e.data === YT.PlayerState.PLAYING;
                btn.innerHTML = `<span class="material-symbols-outlined text-3xl md:text-4xl">${e.data === YT.PlayerState.PLAYING ? 'pause' : 'play_arrow'}</span>`;
            }
        }
    });
}

function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    for (let i = 1; i <= 16; i++) {
        const card = document.createElement('div');
        card.className = 'reveal gallery-card';
        card.innerHTML = `<div class="glass-panel p-2 rounded-xl overflow-hidden group h-full">
            <div class="aspect-[4/3] rounded-lg overflow-hidden">
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="images/photo${i}.jpg" alt="ذكرى ${i}" loading="lazy">
            </div>
        </div>`;
        grid.appendChild(card);
        observer.observe(card);
    }
}

loadGallery();

document.getElementById('timeline-cards').addEventListener('click', (e) => {
    const btn = e.target.closest('.yt-play-btn');
    if (!btn) return;
    const i = +btn.dataset.player;
    if (!players[i]) return;
    if (playerStates[i].playing) players[i].pauseVideo();
    else players[i].playVideo();
});

let appUnlocked = false;

function onYouTubeIframeAPIReady() {
    if (!appUnlocked) return;
    appUnlocked = true;
    fetch('data.txt').then(r => r.text()).then(text => {
        const lines = text.trim().split('\n').filter(Boolean);
        for (let i = 0; i < lines.length; i += 2) {
            const url = lines[i];
            const desc = lines[i + 1] || 'لحظة مميزة من رحلتكِ الملهمة';
            createVideoCard(`فيديو ${i / 2 + 1}`, desc, url, i / 2);
        }
    }).catch(() => {});
}
