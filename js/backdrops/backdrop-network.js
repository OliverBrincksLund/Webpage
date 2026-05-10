document.addEventListener('DOMContentLoaded', function () {
    if (typeof particlesJS === 'undefined') return;

    particlesJS('bg-particles', {
        particles: {
            number: {
                value: 90,
                density: { enable: true, value_area: 900 }
            },
            color: {
                value: ['#C49040', '#D4AB68', '#38A898', '#52BFB0', '#E2DDD6']
            },
            shape: { type: 'circle' },
            opacity: {
                value: 0.7,
                random: true,
                anim: { enable: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: false }
            },
            line_linked: {
                enable: true,
                distance: 160,
                color: '#C49040',
                opacity: 0.18,
                width: 1
            },
            move: {
                enable: true,
                speed: 0.6,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: false },
                onclick: { enable: false },
                resize: true
            }
        },
        retina_detect: true
    });
});
