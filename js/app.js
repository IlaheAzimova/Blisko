/* ============================================
   BLISKO — App JS
   - Countdown timer
   - Hero slider (autoplay + arrows + dots + touch swipe)
   - Mobile menu toggle
   - Clickable star ratings
   ============================================ */
(function () {
    'use strict';

    /* ------------------------------------------
       Countdown Timer
       ------------------------------------------ */
    (function initCountdown() {
        const elD = document.getElementById('cd-d');
        const elH = document.getElementById('cd-h');
        const elM = document.getElementById('cd-m');
        const elS = document.getElementById('cd-s');
        if (!elD || !elH || !elM || !elS) return;

        const target = new Date(Date.now() + 2 * 864e5 + 18 * 36e5 + 34 * 6e4);

        function tick() {
            const d = target - Date.now();
            if (d <= 0) {
                elD.textContent = elH.textContent = elM.textContent = elS.textContent = '00';
                return;
            }
            elD.textContent = String(Math.floor(d / 864e5)).padStart(2, '0');
            elH.textContent = String(Math.floor(d % 864e5 / 36e5)).padStart(2, '0');
            elM.textContent = String(Math.floor(d % 36e5 / 6e4)).padStart(2, '0');
            elS.textContent = String(Math.floor(d % 6e4 / 1e3)).padStart(2, '0');
        }
        tick();
        setInterval(tick, 1000);
    })();

    /* ------------------------------------------
       Hero Slider
       ------------------------------------------ */
    (function initSlider() {
        const slider = document.getElementById('heroSlider');
        if (!slider) return;

        const track = slider.querySelector('.slides');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = document.getElementById('sliderPrev');
        const nextBtn = document.getElementById('sliderNext');
        const dotsWrap = document.getElementById('sliderDots');
        if (!track || slides.length === 0) return;

        const total = slides.length;
        let current = 0;
        let autoTimer = null;
        const AUTOPLAY_MS = 5000;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            // update dots
            if (dotsWrap) {
                const dots = dotsWrap.querySelectorAll('.slider-dot');
                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            }
            // mark active slide for entrance animation
            slides.forEach((s, i) => s.classList.toggle('slide-active', i === current));
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(next, AUTOPLAY_MS);
        }
        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        // Arrow controls
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

        // Dot controls
        if (dotsWrap) {
            dotsWrap.querySelectorAll('.slider-dot').forEach((dot) => {
                dot.addEventListener('click', () => {
                    const i = parseInt(dot.getAttribute('data-i'), 10) || 0;
                    goTo(i);
                    startAuto();
                });
            });
        }

        // Pause on hover (desktop)
        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);

        // Pause when tab not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAuto();
            else startAuto();
        });

        // Touch swipe support (mobile)
        let touchStartX = 0;
        let touchEndX = 0;
        const SWIPE_THRESHOLD = 50;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAuto();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const delta = touchEndX - touchStartX;
            if (Math.abs(delta) >= SWIPE_THRESHOLD) {
                if (delta < 0) next();
                else prev();
            }
            startAuto();
        }, { passive: true });

        // Keyboard navigation
        slider.setAttribute('tabindex', '0');
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); startAuto(); }
            else if (e.key === 'ArrowRight') { next(); startAuto(); }
        });

        // Init
        goTo(0);
        startAuto();
    })();

    /* ------------------------------------------
       Mobile Menu — close on link click
       (toggle button uses inline onclick)
       ------------------------------------------ */
    (function initMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const toggle = document.getElementById('menuToggle');
        if (!menu || !toggle) return;
        toggle.addEventListener('click', () => menu.classList.toggle('mobile-menu-closed'));
        menu.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => menu.classList.add('mobile-menu-closed'));
        });
    })();

    /* ------------------------------------------
       Clickable Star Ratings
       ------------------------------------------ */
    (function initStarRatings() {
        const groups = document.querySelectorAll('.star-rating');
        if (groups.length === 0) return;

        groups.forEach((group) => {
            const stars = group.querySelectorAll('.star');
            stars.forEach((star) => {
                star.setAttribute('type', 'button');
                star.setAttribute('aria-label',
                    'Rate ' + star.getAttribute('data-value') + ' out of 5');

                star.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const value = parseInt(star.getAttribute('data-value'), 10) || 0;
                    group.setAttribute('data-rating', String(value));
                    stars.forEach((s) => {
                        const v = parseInt(s.getAttribute('data-value'), 10) || 0;
                        s.classList.toggle('filled', v <= value);
                    });
                });
            });
        });
    })();

    /* ------------------------------------------
       Smooth scroll for in-page anchors
       ------------------------------------------ */
    (function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    })();

})();
document.addEventListener('DOMContentLoaded', function () {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    function updateSlider() {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Düymələrə klikləmə
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Dot klikləmələri
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.getAttribute('data-i'));
            updateSlider();
            resetAutoplay();
        });
    });

    // Avtomatik keçid
    function startAutoplay() {
        autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
        clearInterval(autoPlayInterval);
        startAutoplay();
    }

    // MOBİL ÜÇÜN TOUCH / SWIPE dəstəyi
    let startX = 0;
    let endX = 0;
    const heroSlider = document.getElementById('heroSlider');

    heroSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // Sürüşdürmə həssaslığı (px)
        if (startX - endX > threshold) {
            nextSlide(); // Sola çəkəndə növbəti
            resetAutoplay();
        } else if (endX - startX > threshold) {
            prevSlide(); // Sağa çəkəndə əvvəlki
            resetAutoplay();
        }
    }

    // Başlat
    startAutoplay();

    // GERİ SAYIM (Countdown) TƏNZİMLƏNMƏSİ
    function updateCountdown() {
        const daysVal = document.getElementById('cd-d');
        const hoursVal = document.getElementById('cd-h');
        const minsVal = document.getElementById('cd-m');
        const secsVal = document.getElementById('cd-s');

        let days = parseInt(daysVal.innerText);
        let hours = parseInt(hoursVal.innerText);
        let minutes = parseInt(minsVal.innerText);
        let seconds = parseInt(secsVal.innerText);

        if (seconds > 0) {
            seconds--;
        } else {
            seconds = 59;
            if (minutes > 0) {
                minutes--;
            } else {
                minutes = 59;
                if (hours > 0) {
                    hours--;
                } else {
                    hours = 23;
                    if (days > 0) {
                        days--;
                    }
                }
            }
        }

        daysVal.innerText = days.toString().padStart(2, '0');
        hoursVal.innerText = hours.toString().padStart(2, '0');
        minsVal.innerText = minutes.toString().padStart(2, '0');
        secsVal.innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
});