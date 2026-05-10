export const WaterAnimation = function(params) {
    const VELOCITY_SCALE = 0.011;
    const MAX_PARTICLE_AGE = 100;
    const PARTICLE_LINE_WIDTH = 1;
    const PARTICLE_MULTIPLIER = 1/1000;
    const NULL_VECTOR = [NaN, NaN, null];

    let canvas, ctx;
    let width, height;
    let particles = [];
    let colorStyles;

    function init(canvasElement) {
        canvas = canvasElement;
        ctx = canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;
        
        const particleCount = Math.round(width * height * PARTICLE_MULTIPLIER);
        colorStyles = [
            "rgba(0, 90, 190, 0.4)",
            "rgba(0, 120, 240, 0.6)",
            "rgba(70, 170, 255, 0.9)"
        ];

        resetParticles(particleCount);
    }

    function resetParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(randomParticle());
        }
    }

    function randomParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            age: Math.floor(Math.random() * MAX_PARTICLE_AGE),
            speed: Math.random() * 2 + 1
        };
    }

    function evolve() {
        particles.forEach(particle => {
            if (particle.age >= MAX_PARTICLE_AGE) {
                Object.assign(particle, randomParticle());
            }
            particle.x += Math.sin(particle.y * 0.01) * particle.speed * VELOCITY_SCALE;
            particle.y += particle.speed * VELOCITY_SCALE;
            if (particle.x < 0) particle.x += width;
            if (particle.x > width) particle.x -= width;
            if (particle.y > height) {
                particle.y = 0;
                particle.x = Math.random() * width;
            }
            particle.age += 1;
        });
    }

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 30, 0.95)";
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = PARTICLE_LINE_WIDTH;
        particles.forEach(particle => {
            ctx.strokeStyle = colorStyles[particle.age % colorStyles.length];
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x, particle.y + 10);
            ctx.stroke();
        });
    }

    function animate() {
        evolve();
        draw();
        requestAnimationFrame(animate);
    }

    return {
        start: function(canvasElement) {
            init(canvasElement);
            animate();
        }
    };
};