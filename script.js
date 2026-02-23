// DATA
const projects = [
    { title: "Large Language Model",    tag: "Machine Learning - Python"                },
    { title: "Pathfinding",             tag: "Algorithms and Data Structure - C"        },
    { title: "Weather App",             tag: "Website Design - HTML, CSS, JavaScript"   },    
    { title: "Shadow Dance",            tag: "Software Modeling and Design - Java"      },
    { title: "Lucky Thirteen",          tag: "Software Modeling and Design - Java"      },
    { title: "Ore Mining Simulator",    tag: "Software Modeling and Design - Java"      },
];

// STATE 
let current     = 0;
let isAnimating = false;

const container = document.getElementById('projects');
const arrowUp   = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowDown');
const counter   = document.getElementById('counter');
const cursor    = document.getElementById('cursor');

let mouseX = -60, mouseY = -60;
let rafPending = false;

// Custom Cursor
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

// Project Items
const items = projects.map(p => {
    const el = document.createElement('div');
    el.className = 'project-item';
    el.innerHTML = `
        <span class="project-title">${p.title}</span>
        <span class="project-subtitle">${p.tag}</span>
        <div class="divider"></div>`;
    
    // cursor dot grows when hovering over the active project item
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));

    // clicking the active title opens its GitHub URL in a new tab
    // Need to replace the "#" placeholders in the data above with real repo links
    el.addEventListener('click', () => {
        if (p.url && p.url !== '#') window.open(p.url, '_blank');
    });

    container.appendChild(el);
    return el;
});

// Layout Helpers
function getProps(offset) {
    const abs = Math.abs(offset);
    const opacity = offset === 0 ? 1 : abs === 1 ? 0.22 : 0;
    const fontSize = offset === 0 ? '2.6rem' : '1.5rem';
    const translateY = offset * 72; // vertical spacing in px
    return { opacity, fontSize, translateY };
}

// Render
function render(animate = true) {
    items.forEach((el, i) => {
        const offset = i - current;
        const { opacity, fontSize, translateY } = getProps(offset);

        // Suppress transitions on first render
        el.style.transition = animate ? '' : 'none';

        el.style.opacity       = opacity;
        el.style.transform     = `translateY(calc(-50% + ${translateY}px))`;
        el.style.top           = '50%';
        el.style.fontSize      = fontSize;
        el.style.pointerEvents = offset === 0 ? 'auto' : 'none';
        el.classList.toggle('active', offset === 0);
    });

    // Show or Hide arrows based on position in list
    arrowUp.classList.toggle('visible', current > 0);
    arrowDown.classList.toggle('visible', current < projects.length - 1);

    // Update Project Counter e.g. "02 / 06"
    const idx = String(current + 1).padStart(2, '0');
    const tot = String(projects.length).padStart(2, '0');
    counter.textContent = `${idx} / ${tot}`;

      // Re-enable transitions after first paint
    if (!animate) {
        requestAnimationFrame(() => {
            items.forEach(el => el.style.transition = '');
        });
    }
}

// NAVIGATE 
function navigate(dir) {
    if (isAnimating) return;
    const next = current + dir;
    if (next < 0 || next >= projects.length) return;
    isAnimating = true;
    current = next;
    render();
    setTimeout(() => isAnimating = false, 560);
}

// ── EVENT LISTENERS ───────────────────────────────────

// Mouse wheel
window.addEventListener('wheel', e => {
    navigate(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

// Touch swipe
let touchY = null;

window.addEventListener('touchstart', e => {
    touchY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', e => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 30) navigate(dy > 0 ? 1 : -1);
    touchY = null;
}, { passive: true });

// Arrow buttons
arrowUp.addEventListener('click',   () => navigate(-1));
arrowDown.addEventListener('click', () => navigate(1));

// Keyboard arrows
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(1);
});


render(false);