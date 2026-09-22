// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Initialize theme from localStorage or default to dark
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

initializeTheme();

// ============================================
// ANIMATED COUNTERS
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const increment = target / 50; // 50 steps for smooth animation
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };

                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

document.addEventListener('DOMContentLoaded', animateCounters);

// ============================================
// SCROLL SPY NAVIGATION
// ============================================

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// SMOOTH SCROLL
// ============================================

navItems.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            updateActiveNav();
        }
    });
});

// ============================================
// YEAR IN FOOTER
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ============================================
// SMOOTH ANIMATIONS ON SCROLL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe experience items and project items
document.querySelectorAll('.experience-item, .project-item').forEach(item => {
    item.style.opacity = '0.7';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const sectionIds = Array.from(sections).map(s => s.getAttribute('id'));
    const currentIndex = sectionIds.indexOf(
        document.querySelector('.nav-item.active')?.getAttribute('href').substring(1)
    );

    let nextIndex;

    // Arrow Down or Page Down
    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentIndex < sectionIds.length - 1) {
        nextIndex = currentIndex + 1;
        e.preventDefault();
    }
    // Arrow Up or Page Up
    else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIndex > 0) {
        nextIndex = currentIndex - 1;
        e.preventDefault();
    }

    if (nextIndex !== undefined) {
        const nextSection = document.getElementById(sectionIds[nextIndex]);
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// ============================================
// FOCUS MANAGEMENT
// ============================================

// Add skip to main content link (hidden but accessible)
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--accent-primary);
        padding: 8px;
        z-index: 1000;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.prepend(skipLink);
}

addSkipLink();

// ============================================
// EXTERNAL LINKS
// ============================================

document.querySelectorAll('a[href*="//"]:not([href*="javascript"])').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ============================================
// PAGE VISIBILITY
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'Come back! | ' + document.title.split(' | ')[1];
    } else {
        document.title = 'Hithesh Burugala - Data Engineer Portfolio';
    }
});

// ============================================
// LAZY LOAD IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PRINT STYLES
// ============================================

window.addEventListener('beforeprint', () => {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
});

// ============================================
// STICKY CTA BUTTON (TOP-RIGHT)
// ============================================

const stickyCta = document.getElementById('sticky-cta');

// Show sticky button immediately on page load
document.addEventListener('DOMContentLoaded', () => {
    stickyCta.classList.add('show');
});

// ============================================
// PIPELINE SCROLL ANIMATION
// ============================================

function animatePipelineOnScroll() {
    const engineeringSvg = document.querySelector('.engineering-svg');

    if (!engineeringSvg) return;

    window.addEventListener('scroll', () => {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

        // Activate processing stages based on scroll
        const stageBoxes = engineeringSvg.querySelectorAll('.stage-box');
        stageBoxes.forEach((stage, index) => {
            const stageProgress = index / stageBoxes.length;

            if (scrollProgress >= stageProgress) {
                stage.style.fill = 'rgba(79, 209, 197, 0.25)';
                stage.style.strokeWidth = '3';
            } else {
                stage.style.fill = 'rgba(79, 209, 197, 0.08)';
                stage.style.strokeWidth = '2';
            }
        });

        // Update data flow intensity
        const dataFlows = engineeringSvg.querySelectorAll('.data-flow, .pipeline-pipe');
        dataFlows.forEach(flow => {
            flow.style.opacity = 0.4 + (scrollProgress * 0.6);
            flow.style.strokeWidth = 2 + (scrollProgress * 2);
        });

        // Update metrics based on scroll
        const throughputValue = (2.5 + scrollProgress * 7.5).toFixed(1);
        const latencyValue = (500 - scrollProgress * 350).toFixed(0);
        const qualityValue = (99.8 + scrollProgress * 0.2).toFixed(2);
        const uptimeValue = (99.95 + scrollProgress * 0.05).toFixed(2);

        // Update metric displays if they exist
        const metrics = engineeringSvg.querySelectorAll('.metric-value');
        if (metrics.length >= 4) {
            metrics[0].textContent = throughputValue + 'M rows/min';
            metrics[1].textContent = '<' + latencyValue + 'ms';
            metrics[2].textContent = qualityValue + '%';
            metrics[3].textContent = uptimeValue + '%';
        }
    });
}

document.addEventListener('DOMContentLoaded', animatePipelineOnScroll);

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c👋 Welcome to my portfolio!', 'font-size: 16px; font-weight: bold; color: #4FD1C5;');
console.log('%cLooking at the code? I\'d love to hear from you! 📧', 'font-size: 12px; color: #94A3B8;');
