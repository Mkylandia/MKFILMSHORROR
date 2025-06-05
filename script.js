function openFilm(url) {
    const clickedCard = event.currentTarget;

    // Klick-Animation: leichter Zoom & 3D-Rotation
    clickedCard.style.transform = 'scale(0.95) rotateX(10deg)';
    clickedCard.style.transition = 'transform 0.15s ease-out';

    // Erzeuge blutroten Ripple-Effekt
    createAdvancedRipple(event);

    setTimeout(() => {
        clickedCard.style.transform = '';
        clickedCard.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        window.open(url, '_blank');
    }, 150);
}

function createAdvancedRipple(event) {
    const ripple = document.createElement('div');
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = 
        `position: absolute;
         left: ${x}px;
         top: ${y}px;
         width: ${size}px;
         height: ${size}px;
         border-radius: 50%;
         background: radial-gradient(
             circle,
             rgba(139,0,0,0.6) 0%,
             rgba(255,0,0,0.2) 50%,
             transparent 100%
         );
         transform: scale(0);
         animation: advancedRipple 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
         pointer-events: none;
         z-index: 1000;`;
    
    event.currentTarget.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 800);
}

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer: Einblendung der Karten beim Scrollen
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
            }
        });
    }, observerOptions);

    // Beobachte alle Filmkarten
    const filmCards = document.querySelectorAll('.film-card');
    filmCards.forEach(card => observer.observe(card));

    // Parallax-Effekt für Hintergrund-Elemente
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.floating-element').forEach((el, idx) => {
            const speed = 0.1 + idx * 0.08;
            const rot  = scrolled * (0.05 + idx * 0.02);
            el.style.transform = `translateY(${scrolled * speed}px) rotate(${rot}deg)`;
        });
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // 3D-Mouse-Tracking für Filmkarten
    filmCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect    = card.getBoundingClientRect();
            const x       = e.clientX - rect.left;
            const y       = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            card.style.transform = 
                `perspective(1000px) 
                 rotateX(${rotateX}deg) 
                 rotateY(${rotateY}deg) 
                 translateY(-20px) 
                 scale(1.03)
                 translateZ(50px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Titel-Scramble-Effekt beim Hovern
    const title = document.querySelector('.logo');
    const titleText = title.textContent;
    let scrambleAnimation;
    title.addEventListener('mouseenter', () => {
        if (scrambleAnimation) return;
        let iteration = 0;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        scrambleAnimation = setInterval(() => {
            title.textContent = titleText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return titleText[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");
            if (iteration >= titleText.length) {
                clearInterval(scrambleAnimation);
                scrambleAnimation = null;
            }
            iteration += 1/3;
        }, 50);
    });

    // Sanfte Header-Einblendung
    setTimeout(() => {
        const header = document.querySelector('.header');
        header.style.opacity = '0';
        header.style.transform = 'translateY(50px)';
        header.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        requestAnimationFrame(() => {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        });
    }, 100);

    // Custom Cursor für interaktive Elemente
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = 
        `position: fixed;
         width: 18px;
         height: 18px;
         background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%);
         border-radius: 50%;
         pointer-events: none;
         z-index: 9999;
         transition: transform 0.1s ease;
         display: none;`;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 9 + 'px';
        cursor.style.top  = e.clientY - 9 + 'px';
    });
    document.querySelectorAll('.film-card, .watch-btn, .social-icon').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
            cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
            cursor.style.transform = 'scale(1)';
        });
    });

    // Injektion zusätzlicher CSS-Regeln (Ripple & Cursor)
    const styleSheet = document.createElement('style');
    styleSheet.textContent = 
        `@keyframes advancedRipple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        .custom-cursor {
            mix-blend-mode: difference;
        }
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }`;
    document.head.appendChild(styleSheet);
});
