/* ============================================================
   ТАЙНАЯ КОМНАТА ЗНАНИЙ — скрипты
   ============================================================ */

/* ---------- 1. ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ---------- */
function switchPage(pageId, buttonElement) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }

    var targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    var navButtons = document.querySelectorAll('.nav-btn');
    for (var j = 0; j < navButtons.length; j++) {
        navButtons[j].classList.remove('active');
    }

    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    playMagicSound();
}

/* ---------- 2. РАСКРЫТИЕ ЗАКЛИНАНИЙ НА КАРТОЧКАХ ---------- */
function toggleSpell(button) {
    var card = button.closest('.card');
    if (!card) return;

    var spellBox = card.querySelector('.spell-box');
    if (!spellBox) return;

    var isOpen = spellBox.classList.contains('show');

    var allSpellBoxes = document.querySelectorAll('.spell-box.show');
    for (var i = 0; i < allSpellBoxes.length; i++) {
        allSpellBoxes[i].classList.remove('show');
    }

    var allSpellButtons = document.querySelectorAll('.spell-btn');
    for (var k = 0; k < allSpellButtons.length; k++) {
        allSpellButtons[k].textContent = '✨ Заклинание';
    }

    if (!isOpen) {
        spellBox.classList.add('show');
        button.textContent = '✦ Скрыть';
        playSpellSound();
    } else {
        button.textContent = '✨ Заклинание';
    }
}

/* ---------- 3. ФИЛЬТР КАРТОЧЕК ФАКУЛЬТЕТОВ ---------- */
function filterCards(filter, button) {
    var buttons = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    if (button) button.classList.add('active');

    var cards = document.querySelectorAll('#housesGrid .card');
    for (var j = 0; j < cards.length; j++) {
        var card = cards[j];
        var cardFilter = card.getAttribute('data-filter');
        if (filter === 'all' || cardFilter === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'cardAppear 0.7s cubic-bezier(0.25, 0.8, 0.35, 1) both';
        } else {
            card.classList.add('hidden');
        }
    }
    playMagicSound();
}

/* ---------- 4. ПОИСК ЗАКЛИНАНИЙ ---------- */
function searchSpells(query) {
    var q = query.toLowerCase().trim();
    var items = document.querySelectorAll('#spellList .spell-item');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var name = item.getAttribute('data-name') || '';
        if (q === '' || name.indexOf(q) !== -1) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    }
}

/* ---------- 5. ЗАПУСК ПРИ ЗАГРУЗКЕ ---------- */
window.onload = function () {
    var firstButton = document.querySelector('.nav-btn[data-page="home"]');
    switchPage('home', firstButton);

    startHogwartsClock();
    initCursor();
    initCounters();
    initVisitCounter();
    initParallax();
    initScrollReveal();
};

/* ---------- 6. ЧАСЫ ХОГВАРТСА ---------- */
function startHogwartsClock() {
    var clockEl = document.getElementById('hogwartsTime');
    if (!clockEl) return;

    function update() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = h + ':' + m + ':' + s;
    }

    update();
    setInterval(update, 1000);
}

/* ---------- 7. КАСТОМНЫЙ КУРСОР ---------- */
function initCursor() {
    var dot = document.getElementById('cursorDot');
    var glow = document.getElementById('cursorGlow');
    if (!dot || !glow) return;

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var glowX = mouseX;
    var glowY = mouseY;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    var hoverTargets = document.querySelectorAll('button, a, .card, .nav-btn, input, .info-card, .subject-card, .spell-item');
    for (var i = 0; i < hoverTargets.length; i++) {
        hoverTargets[i].addEventListener('mouseenter', function () {
            dot.classList.add('hover');
            glow.classList.add('hover');
        });
        hoverTargets[i].addEventListener('mouseleave', function () {
            dot.classList.remove('hover');
            glow.classList.remove('hover');
        });
    }
}

/* ---------- 8. СЧЁТЧИКИ НА ГЛАВНОЙ ---------- */
function initCounters() {
    var counters = document.querySelectorAll('.info-num[data-count]');
    for (var i = 0; i < counters.length; i++) {
        animateCounter(counters[i]);
    }
}

function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    var duration = 2000;
    var start = performance.now();

    function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(step);
}

/* ---------- 9. СЧЁТЧИК ПОСЕЩЕНИЙ ---------- */
function initVisitCounter() {
    var el = document.getElementById('visitCount');
    if (!el) return;

    var visits = 0;
    try {
        visits = parseInt(localStorage.getItem('hogwarts_visits') || '0', 10);
        visits += 1;
        localStorage.setItem('hogwarts_visits', String(visits));
    } catch (e) {
        visits = 1;
    }
    el.textContent = visits;
}

/* ---------- 10. ЗВУКИ ЧЕРЕЗ WEB AUDIO API ---------- */
var audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        try {
            var Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            audioCtx = new Ctx();
        } catch (e) {
            return null;
        }
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/* Мрачный низкий «колокол» при переключении страниц */
function playMagicSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;

    var osc1 = ctx.createOscillator();
    var osc2 = ctx.createOscillator();
    var gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.6);
    osc2.frequency.setValueAtTime(330, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(165, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.75);
    osc2.stop(ctx.currentTime + 0.75);
}

/* Жуткий «шёпот» при раскрытии заклинания */
function playSpellSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;

    var notes = [196, 233.08, 277.18, 329.63, 415.30];
    for (var i = 0; i < notes.length; i++) {
        (function (freq, index) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            var start = ctx.currentTime + index * 0.09;

            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.055, start + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.6);
        })(notes[i], i);
    }
}

/* ---------- 11. ПАРАЛЛАКС ФОНА ОТ МЫШИ ---------- */
function initParallax() {
    var fog = document.querySelector('.fog');
    var aurora = document.querySelector('.aurora');
    var bloodFog = document.querySelector('.blood-fog');

    document.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 24;
        var y = (e.clientY / window.innerHeight - 0.5) * 24;

        if (fog) fog.style.transform = 'translate(' + (-x) + 'px, ' + (-y) + 'px)';
        if (aurora) aurora.style.transform = 'translate(' + (x * 0.6) + 'px, ' + (y * 0.6) + 'px)';
        if (bloodFog) bloodFog.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });
}

/* ---------- 12. ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ---------- */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    var animated = document.querySelectorAll('.subject-card, .info-card, .spell-item, .card');
    for (var i = 0; i < animated.length; i++) {
        var el = animated[i];
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.8, 0.35, 1)';
        observer.observe(el);
    }
}

/* ---------- 13. «ДЫХАНИЕ» ТУМАНА ОТ СКРОЛЛА ---------- */
window.addEventListener('scroll', function () {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var body = document.body;

    if (scrolled > 100) {
        body.style.setProperty('--scroll-depth', Math.min(scrolled / 1000, 1));
    }
});

/* ---------- 14. МИГАЮЩИЙ ЭФФЕКТ НА ЗАГОЛОВКАХ ---------- */
(function initTitleFlicker() {
    var titles = document.querySelectorAll('.hero-title, .page-header h1');

    function flickerRandom() {
        if (titles.length === 0) return;
        var t = titles[Math.floor(Math.random() * titles.length)];
        t.style.filter = 'drop-shadow(0 0 50px rgba(185, 28, 28, 1)) brightness(1.4)';
        setTimeout(function () {
            t.style.filter = '';
        }, 80 + Math.random() * 120);
        setTimeout(flickerRandom, 3000 + Math.random() * 5000);
    }

    setTimeout(flickerRandom, 4000);
})();

/* ---------- 15. РЕАКЦИЯ НА КЛАВИАТУРУ (ESC — закрыть все заклинания) ---------- */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        var allSpellBoxes = document.querySelectorAll('.spell-box.show');
        for (var i = 0; i < allSpellBoxes.length; i++) {
            allSpellBoxes[i].classList.remove('show');
        }
        var allSpellButtons = document.querySelectorAll('.spell-btn');
        for (var k = 0; k < allSpellButtons.length; k++) {
            allSpellButtons[k].textContent = '✨ Заклинание';
        }
    }
});

/* ---------- 16. ПРЕДОТВРАЩЕНИЕ ДВОЙНОГО КЛИКА ПО КНОПКАМ ---------- */
(function preventDoubleClick() {
    var buttons = document.querySelectorAll('.nav-btn, .filter-btn, .spell-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function (e) {
            if (this.dataset.clicked === '1') {
                e.preventDefault();
                return;
            }
            this.dataset.clicked = '1';
            var self = this;
            setTimeout(function () {
                self.dataset.clicked = '0';
            }, 300);
        });
    }
})();