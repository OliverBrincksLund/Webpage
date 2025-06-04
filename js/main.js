document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeProjects();
    initializeGallery();
    initializeCarousels();

    AOS.init({
        duration: 1000,
        once: true
    });

    particlesJS("particles-js-1", getParticlesConfig(220, "#ffffff"));

    lazyLoadImages();
});

function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
        if (isElementInViewport(el)) {
            el.classList.add('is-visible');
        }
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

window.addEventListener('scroll', animateOnScroll);

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, options);

    images.forEach(img => observer.observe(img));
}

function getParticlesConfig(number, color) {
    return {
        particles: {
            number: { value: number },
            color: { value: color },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: color, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    };
}