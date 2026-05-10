// Existing particles configuration
function getParticlesConfig(number, color) {
    return {
        particles: {
            number: { value: number, density: { enable: true, value_area: 800 } },
            color: { value: color },
            shape: { type: "circle" },
            opacity: { value: 0.7, random: false },
            size: { value: 3, random: true, anim: { enable: false } },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 10,
                direction: "bottom",
                random: true,
                straight: true,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: false },
                onclick: { enable: false },
                resize: true
            }
        },
        retina_detect: true
    };
}

// New rain particles configuration
const rainParticlesConfig = {
    particles: {
        number: { value: 200, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.7, random: false },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: { enable: false },
        move: {
            enable: true,
            speed: 10,
            direction: "bottom",
            random: true,
            straight: true,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
        }
    },
    retina_detect: true
};