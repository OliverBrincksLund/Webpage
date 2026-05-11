class SoftwareDevelopmentAnimation {
    constructor(canvasId, particlesId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particlesContainer = document.getElementById(particlesId);
        
        this.codeStreams = [];
        this.circuits = [];
        this.time = 0;
        this.animationId = null;
        
        // Configuration
        this.config = {
            streamCount: 12,
            streamSpeed: 1.2,
            fontSize: 14,
            circuitCount: 8,
            codeChars: ['0', '1', '{', '}', '(', ')', ';', '=', '<', '>', '/', '*', '+', '-', 'α', 'β', 'γ', 'δ', 'λ', 'π'],
            colors: {
                primary: 'rgba(0, 255, 150, 0.9)',
                secondary: 'rgba(100, 200, 255, 0.7)',
                accent: 'rgba(255, 255, 255, 0.8)',
                fade: 'rgba(0, 255, 150, 0.3)'
            }
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createCodeStreams();
        this.createCircuits();
        this.animate();
        this.initDigitalParticles();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        // Recreate elements on resize
        this.createCodeStreams();
        this.createCircuits();
    }
    
    createCodeStreams() {
        this.codeStreams = [];
        const streamWidth = this.canvas.width / this.config.streamCount;
        
        for (let i = 0; i < this.config.streamCount; i++) {
            this.codeStreams.push({
                x: (i + 0.5) * streamWidth,
                characters: [],
                speed: 0.8 + Math.random() * 0.8,
                lastSpawn: 0,
                spawnDelay: 100 + Math.random() * 200
            });
        }
    }
    
    createCircuits() {
        this.circuits = [];
        for (let i = 0; i < this.config.circuitCount; i++) {
            this.circuits.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                targetX: Math.random() * this.canvas.width,
                targetY: Math.random() * this.canvas.height,
                progress: 0,
                speed: 0.005 + Math.random() * 0.01,
                pulse: Math.random() * Math.PI * 2,
                connections: []
            });
        }
        
        // Create connections between circuits
        this.circuits.forEach((circuit, i) => {
            const connectionCount = 1 + Math.floor(Math.random() * 3);
            for (let j = 0; j < connectionCount; j++) {
                const targetIndex = Math.floor(Math.random() * this.circuits.length);
                if (targetIndex !== i) {
                    circuit.connections.push(targetIndex);
                }
            }
        });
    }
    
    updateCodeStreams() {
        this.codeStreams.forEach(stream => {
            // Spawn new characters
            if (this.time - stream.lastSpawn > stream.spawnDelay) {
                const char = this.config.codeChars[Math.floor(Math.random() * this.config.codeChars.length)];
                stream.characters.push({
                    char: char,
                    y: -this.config.fontSize,
                    opacity: 1,
                    age: 0
                });
                stream.lastSpawn = this.time;
                stream.spawnDelay = 50 + Math.random() * 150;
            }
            
            // Update existing characters
            stream.characters.forEach(char => {
                char.y += stream.speed * this.config.streamSpeed;
                char.age += 1;
                
                // Fade out as they fall
                char.opacity = Math.max(0, 1 - (char.age / 120));
            });
            
            // Remove characters that are off screen or too old
            stream.characters = stream.characters.filter(char => 
                char.y < this.canvas.height + this.config.fontSize && char.opacity > 0.1
            );
        });
    }
    
    updateCircuits() {
        this.circuits.forEach(circuit => {
            // Move towards target
            circuit.progress += circuit.speed;
            
            if (circuit.progress >= 1) {
                // Reached target, set new target
                circuit.x = circuit.targetX;
                circuit.y = circuit.targetY;
                circuit.targetX = Math.random() * this.canvas.width;
                circuit.targetY = Math.random() * this.canvas.height;
                circuit.progress = 0;
            } else {
                // Interpolate position
                const currentX = circuit.x + (circuit.targetX - circuit.x) * circuit.progress;
                const currentY = circuit.y + (circuit.targetY - circuit.y) * circuit.progress;
                circuit.currentX = currentX;
                circuit.currentY = currentY;
            }
            
            circuit.pulse += 0.1;
        });
    }
    
    drawCodeStreams() {
        this.ctx.font = `${this.config.fontSize}px "Courier New", monospace`;
        this.ctx.textAlign = 'center';
        
        this.codeStreams.forEach(stream => {
            stream.characters.forEach((char, index) => {
                // Leading character is brighter
                const isLeading = index === stream.characters.length - 1;
                let color = isLeading ? this.config.colors.primary : this.config.colors.fade;
                
                // Modify opacity
                const alpha = char.opacity * (isLeading ? 1 : 0.6);
                color = color.replace(/[\d\.]+\)$/g, `${alpha})`);
                
                this.ctx.fillStyle = color;
                this.ctx.fillText(char.char, stream.x, char.y);
                
                // Add glow for leading character
                if (isLeading) {
                    this.ctx.shadowColor = this.config.colors.primary;
                    this.ctx.shadowBlur = 8;
                    this.ctx.fillText(char.char, stream.x, char.y);
                    this.ctx.shadowBlur = 0;
                }
            });
        });
    }
    
    drawCircuits() {
        // Draw connections
        this.circuits.forEach((circuit, i) => {
            const x = circuit.currentX || circuit.x;
            const y = circuit.currentY || circuit.y;
            
            circuit.connections.forEach(connectionIndex => {
                const target = this.circuits[connectionIndex];
                const targetX = target.currentX || target.x;
                const targetY = target.currentY || target.y;
                
                // Animated line
                const pulseOffset = Math.sin(this.time * 0.01 + circuit.pulse) * 0.3 + 0.7;
                this.ctx.strokeStyle = this.config.colors.secondary.replace(/[\d\.]+\)$/g, `${pulseOffset * 0.4})`);
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(targetX, targetY);
                this.ctx.stroke();
                
                // Data packet traveling along line
                const packetProgress = (this.time * 0.02 + i * 0.3) % 1;
                const packetX = x + (targetX - x) * packetProgress;
                const packetY = y + (targetY - y) * packetProgress;
                
                this.ctx.beginPath();
                this.ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = this.config.colors.accent;
                this.ctx.fill();
            });
        });
        
        // Draw circuit nodes
        this.circuits.forEach(circuit => {
            const x = circuit.currentX || circuit.x;
            const y = circuit.currentY || circuit.y;
            const pulse = Math.sin(circuit.pulse) * 0.3 + 0.7;
            
            // Outer glow
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.colors.primary.replace(/[\d\.]+\)$/g, `${pulse * 0.3})`);
            this.ctx.fill();
            
            // Inner core
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.colors.accent;
            this.ctx.fill();
            
            // Center dot
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.colors.primary;
            this.ctx.fill();
        });
    }
    
    initDigitalParticles() {
        // Digital particle configuration
        const digitalParticlesConfig = {
            particles: {
                number: { 
                    value: Math.min(100, Math.floor(this.canvas.width * 0.15)), 
                    density: { enable: true, value_area: 1500 } 
                },
                color: { value: ["#00ff96", "#64c8ff", "#ffffff"] },
                shape: { 
                    type: ["circle", "triangle"],
                    stroke: { width: 1, color: "#00ff96" }
                },
                opacity: { 
                    value: 0.6, 
                    random: true,
                    anim: { enable: true, speed: 2, opacity_min: 0.1, sync: false }
                },
                size: { 
                    value: 3, 
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.5, sync: false }
                },
                line_linked: { 
                    enable: true,
                    distance: 120,
                    color: "#00ff96",
                    opacity: 0.3,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "bounce",
                    bounce: true,
                    attract: { enable: false }
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
        
        if (this.particlesContainer) {
            particlesJS(this.particlesContainer.id, digitalParticlesConfig);
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.time += 1;
        
        this.updateCodeStreams();
        this.updateCircuits();
        
        this.drawCircuits();
        this.drawCodeStreams();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize the animation when DOM is ready
function initSoftwareDevelopmentAnimation() {
    const canvas = document.getElementById('treeCanvas');
    const particlesContainer = document.getElementById('rain-particles');
    
    if (canvas && particlesContainer) {
        // Clear any existing content
        particlesContainer.innerHTML = '';
        
        new SoftwareDevelopmentAnimation('treeCanvas', 'rain-particles');
        console.log('Software development animation initialized');
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoftwareDevelopmentAnimation);
} else {
    initSoftwareDevelopmentAnimation();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.softwareDevAnimation) {
        window.softwareDevAnimation.cleanup();
    }
}); 