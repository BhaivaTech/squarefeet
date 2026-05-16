document.addEventListener('DOMContentLoaded', () => {
    // Init AOS
    AOS.init({ duration: 800, once: true, offset: 100 });

    // Services Swiper
    const servicesSwiper = new Swiper('.services-swiper', {
        slidesPerView: 1.15,
        spaceBetween: 20,
        speed: 600,
        grabCursor: true,
        navigation: {
            prevEl: '.services-prev',
            nextEl: '.services-next',
        },
        scrollbar: {
            el: '.services-scrollbar',
            draggable: true,
            snapOnRelease: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1.8,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
        },
    });

    // Packages tab switching
    const pkgTabs = document.querySelectorAll('.pkg-tab');
    const pkgPanels = document.querySelectorAll('.pkg-panel');

    pkgTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            pkgTabs.forEach(t => t.classList.remove('active'));
            pkgPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const panel = document.querySelector(`.pkg-panel[data-panel="${target}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    // Counter animation
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // Process line animation
    const processSteps = document.querySelector('.process-steps');
    if (processSteps) {
        const lineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-line');
                    lineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        lineObserver.observe(processSteps);
    }

    // Header shrink on scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll-spy: highlight active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('[data-nav]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle with hamburger animation
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            mobileMenuBtn.classList.toggle('open');
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId !== '#top') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    if (navMenu && navMenu.classList.contains('mobile-open')) {
                        navMenu.classList.remove('mobile-open');
                        mobileMenuBtn.classList.remove('open');
                    }
                }
            } else if (targetId === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
});
