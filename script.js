// ── DATA ──────────────────────────────────────────────
const projects = [
    {
        title: "NAO V5 Humanoid",
        tag: "AI Robotics - Python, NodeJS, Google Cloud",
        url: "https://github.com/PavitGitHub/naorobotproject",
        description: "An AI-powered humanoid robot project built on the NAO V5 platform. The system integrates speech recognition, natural language processing via Google Cloud, and real-time motor control to create an interactive conversational robot. Built with Python for the core AI pipeline and NodeJS for the web interface layer.",
        video: null,
    },
    {
        title: "Weather App",
        tag: "Website Design - HTML, CSS, JavaScript",
        url: "https://github.com/PavitGitHub/Weather-App",
        description: "A responsive weather application that fetches real-time meteorological data from a public API. Features a clean, minimal UI with animated weather condition icons, 5-day forecast, and geolocation support. Designed with a mobile-first approach using vanilla HTML, CSS, and JavaScript.",
        video: null,
    },
    {
        title: "Shadow Dance",
        tag: "Software Modeling and Design - Java",
        url: "https://github.com/PavitGitHub/Shadow-Dance-Game",
        description: "A rhythm-based dance game built in Java using the Bagel game engine. Players control a dancer character to match on-screen prompts in sync with music. Implements object-oriented design patterns including state machines and observer pattern for game logic.",
        video: null,
    },
    {
        title: "Lucky Thirteen",
        tag: "Software Modeling and Design - Java",
        url: "https://github.com/PavitGitHub/Lucky-Thirteen-Card",
        description: "A card game simulation implementing the Lucky Thirteen rules engine in Java. Features a full deck management system, player AI opponents, and a graphical interface. Demonstrates strong OOP principles with inheritance hierarchies for card types and player strategies.",
        video: null,
    },
    {
        title: "Ore Mining Simulator",
        tag: "Software Modeling and Design - Java",
        url: "https://github.com/PavitGitHub/Ore-Mining-Simulator",
        description: "A grid-based mining simulation game written in Java. Players navigate underground tunnels, collect ore deposits, and manage resources. The project applies software design patterns including factory and strategy patterns to manage entity creation and behaviour.",
        video: null,
    },
    {
        title: "Pathfinding",
        tag: "Algorithms and Data Structure - Python",
        url: "https://github.com/PavitGitHub/Pathfinding",
        description: "A visual pathfinding algorithm explorer implemented in Python. Demonstrates and compares classic algorithms including A*, Dijkstra's, BFS, and DFS on interactive grid maps. Users can place walls, set start/end points, and observe the traversal in real time with step-by-step animation.",
        video: null,
    },
];

// ── STATE ──────────────────────────────────────────────
let current     = 0;
let isAnimating = false;
let appState    = 'home'; // 'home' | 'detail'

// ── DOM REFS ───────────────────────────────────────────
const container     = document.getElementById('projects');
const arrowUp       = document.getElementById('arrowUp');
const arrowDown     = document.getElementById('arrowDown');
const counter       = document.getElementById('counter');
const cursor        = document.getElementById('cursor');
const careerBtn     = document.getElementById('careerBtn');
const careerPanel   = document.getElementById('careerPanel');
const careerOverlay = document.getElementById('careerOverlay');
const careerClose   = document.getElementById('careerClose');
const resumeBtn     = document.querySelector('.resume-btn');
const linkedinBtn   = document.querySelector('.linkedin-btn');
const homePage      = document.getElementById('homePage');
const detailPage    = document.getElementById('detailPage');
const detailTitle   = document.getElementById('detailTitle');
const detailNav     = document.getElementById('detailNav');
const detailDesc    = document.getElementById('detailDesc');
const detailGithub  = document.getElementById('detailGithub');
const backBtn       = document.getElementById('backBtn');
const detailTag     = document.getElementById('detailTag');
const detailDivider = document.getElementById('detailDivider');
const githubFrame   = document.getElementById('githubFrame');
const colDesc       = document.getElementById('colDesc');
const colGithub     = document.getElementById('colGithub');
const colNav        = document.getElementById('colNav');

// ── CURSOR ─────────────────────────────────────────────
let mouseX = -60, mouseY = -60;
let rafPending = false;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            rafPending = false;
        });
    }
});

// ── CAREER PANEL ───────────────────────────────────────
let panelOpen = false;

function openPanel() {
    panelOpen = true;
    careerPanel.classList.add('open');
    careerOverlay.classList.add('open');
}

function closePanel() {
    panelOpen = false;
    careerPanel.classList.remove('open');
    careerOverlay.classList.remove('open');
}

careerBtn.addEventListener('click', openPanel);
careerClose.addEventListener('click', closePanel);
careerOverlay.addEventListener('click', closePanel);

[careerBtn, careerClose, resumeBtn, linkedinBtn].forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// ── HOME PROJECT ITEMS ─────────────────────────────────
const items = projects.map((p, idx) => {
    const el = document.createElement('div');
    el.className = 'project-item';
    el.innerHTML = `
        <span class="project-title">${p.title}</span>
        <span class="project-subtitle">${p.tag}</span>
        <div class="divider"></div>`;

    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));

    el.addEventListener('click', () => {
        if (appState === 'home') openDetailPage(idx);
    });

    container.appendChild(el);
    return el;
});

// ── LAYOUT HELPERS ─────────────────────────────────────
function getProps(offset) {
    const abs = Math.abs(offset);
    const opacity   = offset === 0 ? 1 : abs === 1 ? 0.22 : 0;
    const fontSize  = offset === 0 ? '2.6rem' : '1.5rem';
    const translateY = offset * 72;
    return { opacity, fontSize, translateY };
}

function render(animate = true) {
    items.forEach((el, i) => {
        const offset = i - current;
        const { opacity, fontSize, translateY } = getProps(offset);
        el.style.transition  = animate ? '' : 'none';
        el.style.opacity     = opacity;
        el.style.transform   = `translateY(calc(-50% + ${translateY}px))`;
        el.style.top         = '50%';
        el.style.fontSize    = fontSize;
        el.style.pointerEvents = offset === 0 ? 'auto' : 'none';
        el.classList.toggle('active', offset === 0);
    });

    arrowUp.classList.toggle('visible', current > 0);
    arrowDown.classList.toggle('visible', current < projects.length - 1);

    const idx = String(current + 1).padStart(2, '0');
    const tot = String(projects.length).padStart(2, '0');
    counter.textContent = `${idx} / ${tot}`;

    if (!animate) {
        requestAnimationFrame(() => {
            items.forEach(el => el.style.transition = '');
        });
    }
}

function navigate(dir) {
    if (isAnimating) return;
    const next = current + dir;
    if (next < 0 || next >= projects.length) return;
    isAnimating = true;
    current = next;
    render();
    setTimeout(() => isAnimating = false, 560);
}

// ── DETAIL PAGE ────────────────────────────────────────

let detailCurrent = 0;
let detailNavItems = [];
let detailNavAnimating = false;

function openDetailPage(idx) {
    if (appState !== 'home') return;
    appState = 'detail';
    detailCurrent = idx;

    const p = projects[idx];

    // Set title and tag
    detailTitle.textContent = p.title;
    detailTag.textContent   = p.tag;

    // Transition: home fades out, detail fades in
    homePage.classList.add('page-exit');

    setTimeout(() => {
        homePage.classList.add('hidden');
        homePage.classList.remove('page-exit');

        // Populate detail nav
        buildDetailNav(idx);

        // Populate description
        buildDetailDesc(p);

        // Show github
        buildDetailGithub(p);

        // Show detail page
        detailPage.classList.remove('hidden');
        detailPage.classList.add('page-enter');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                detailPage.classList.remove('page-enter');
            });
        });
    }, 450);
}

function closeDetailPage() {
    if (appState !== 'detail') return;
    appState = 'home';

    detailPage.classList.add('page-exit');

    setTimeout(() => {
        detailPage.classList.add('hidden');
        detailPage.classList.remove('page-exit');
        homePage.classList.remove('hidden');
        homePage.classList.add('page-enter');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                homePage.classList.remove('page-enter');
            });
        });
    }, 450);
}

function buildDetailNav(activeIdx) {
    detailNav.innerHTML = '';
    detailNavItems = [];
    detailCurrent = activeIdx;

    projects.forEach((p, i) => {
        const el = document.createElement('div');
        el.className = 'detail-nav-item' + (i === activeIdx ? ' active' : '');
        el.innerHTML = `
            <span class="detail-nav-title">${p.title}</span>
            <span class="detail-nav-tag">${p.tag}</span>
            <div class="detail-nav-divider"></div>`;

        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        el.addEventListener('click', () => switchDetailProject(i));

        detailNav.appendChild(el);
        detailNavItems.push(el);
    });

    renderDetailNav(false);
}

function getDetailNavProps(offset) {
    const abs = Math.abs(offset);
    const opacity   = offset === 0 ? 1 : abs === 1 ? 0.2 : 0;
    const fontSize  = offset === 0 ? '1.6rem' : '1rem';
    const translateY = offset * 56;
    return { opacity, fontSize, translateY };
}

function renderDetailNav(animate = true) {
    detailNavItems.forEach((el, i) => {
        const offset = i - detailCurrent;
        const { opacity, fontSize, translateY } = getDetailNavProps(offset);

        el.style.transition    = animate ? '' : 'none';
        el.style.opacity       = opacity;
        el.style.transform     = `translateY(calc(-50% + ${translateY}px))`;
        el.style.top           = '50%';
        el.style.fontSize      = fontSize;
        el.style.pointerEvents = offset === 0 ? 'auto' : 'none';
        el.classList.toggle('active', offset === 0);
    });

    // Update nav arrows
    const navArrowUp   = document.getElementById('detailArrowUp');
    const navArrowDown = document.getElementById('detailArrowDown');
    if (navArrowUp)   navArrowUp.classList.toggle('visible', detailCurrent > 0);
    if (navArrowDown) navArrowDown.classList.toggle('visible', detailCurrent < projects.length - 1);

    if (!animate) {
        requestAnimationFrame(() => {
            detailNavItems.forEach(el => el.style.transition = '');
        });
    }
}

function switchDetailProject(idx) {
    if (detailNavAnimating || idx === detailCurrent) return;
    if (idx < 0 || idx >= projects.length) return;  
    detailNavAnimating = true;
    detailCurrent = idx;

    const p = projects[idx];

    // Update title and tag
    detailTitle.style.opacity = '0';
    detailTag.style.opacity   = '0';
    setTimeout(() => {
        detailTitle.textContent = p.title;
        detailTag.textContent   = p.tag;
        detailTitle.style.opacity = '1';
        detailTag.style.opacity   = '1';
    }, 200);

    // Update content cols
    colDesc.style.opacity = '0';
    colGithub.style.opacity = '0';
    setTimeout(() => {
        buildDetailDesc(p);
        buildDetailGithub(p);
        colDesc.style.opacity = '1';
        colGithub.style.opacity = '1';
    }, 250);

    renderDetailNav();
    setTimeout(() => detailNavAnimating = false, 560);
}

function buildDetailDesc(p) {
    colDesc.innerHTML = `
        <div class="desc-label">About</div>
        <p class="desc-text">${p.description}</p>
        ${p.video ? `
        <div class="video-wrap">
            <iframe src="${p.video}" frameborder="0" allowfullscreen></iframe>
        </div>` : `
        <div class="video-placeholder">
            <span class="vp-label">video unavailable</span>
        </div>`}
        <a class="github-link-btn" href="${p.url}" target="_blank">
            View on GitHub <span class="arrow-icon">↗</span>
        </a>`;
}

function buildDetailGithub(p) {
    // Convert github.com URL to github readme embed approach
    const repoPath = p.url.replace('https://github.com/', '');
    colGithub.innerHTML = `
        <div class="gh-label">Repository</div>
        <div class="gh-card">
            <div class="gh-card-header">
                <svg class="gh-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span class="gh-repo-name">${repoPath}</span>
            </div>
            <div class="gh-divider"></div>
            <div class="gh-readme-prompt">
                <div class="gh-readme-icon">{ }</div>
                <div class="gh-readme-text">Open repository to explore the full source code, README, and commit history.</div>
                <a class="gh-open-btn" href="${p.url}" target="_blank">Open Repository ↗</a>
            </div>
            <div class="gh-meta">
                <div class="gh-meta-item">
                    <span class="gh-meta-dot"></span>
                    <span>${p.tag.split(' - ')[1] || 'Code'}</span>
                </div>
                <div class="gh-meta-item">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"/></svg>
                    <span>Public</span>
                </div>
            </div>
        </div>`;
}

// ── BACK BUTTON ────────────────────────────────────────
backBtn.addEventListener('click', closeDetailPage);
backBtn.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
backBtn.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));

// ── DETAIL NAV ARROWS ──────────────────────────────────
document.addEventListener('click', e => {
    if (e.target.closest('#detailArrowUp'))   navigateDetail(-1);
    if (e.target.closest('#detailArrowDown')) navigateDetail(1);
});

function navigateDetail(dir) {
    const next = detailCurrent + dir;
    if (next < 0 || next >= projects.length) return;
    switchDetailProject(next);
}

// ── HOME EVENT LISTENERS ────────────────────────────────
// Arrow buttons
arrowUp.addEventListener('click',   () => navigate(-1));
arrowDown.addEventListener('click', () => navigate(1));

// Scroll wheel — throttled on detail page to prevent rapid-fire switching
let wheelCooldown = false;

window.addEventListener('wheel', e => {
    if (appState === 'home' && !panelOpen) {
        navigate(e.deltaY > 0 ? 1 : -1);
    } else if (appState === 'detail' && !panelOpen) {
        // Let columns scroll naturally; only hijack at their boundary
        const scrollable = e.target.closest('.detail-col');
        if (scrollable) {
            const { scrollTop, scrollHeight, clientHeight } = scrollable;
            const atTop    = scrollTop === 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
            if (e.deltaY < 0 && !atTop)    return;
            if (e.deltaY > 0 && !atBottom) return;
        }
        if (wheelCooldown) return;
        wheelCooldown = true;
        setTimeout(() => wheelCooldown = false, 600);
        switchDetailProject(detailCurrent + (e.deltaY > 0 ? 1 : -1));
    }
}, { passive: true });

// Touch swipe
let touchY = null;

window.addEventListener('touchstart', e => {
    touchY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', e => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (appState === 'home' && !panelOpen && Math.abs(dy) > 30) {
        navigate(dy > 0 ? 1 : -1);
    } else if (appState === 'detail' && !panelOpen && Math.abs(dy) > 30) {
        switchDetailProject(detailCurrent + (dy > 0 ? 1 : -1));
    }
    touchY = null;
}, { passive: true });

// Keyboard arrows
document.addEventListener('keydown', e => {
    if (appState === 'home' && !panelOpen) {
        if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(1);
    } else if (appState === 'detail' && !panelOpen) {
        if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  switchDetailProject(detailCurrent - 1);
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') switchDetailProject(detailCurrent + 1);
    }
    if (e.key === 'Escape') { closePanel(); if (appState === 'detail') closeDetailPage(); }
});

// ── INIT ───────────────────────────────────────────────
render(false);

