(function() {
    var canvas = document.getElementById('treeCanvas');
    var ctx = canvas.getContext('2d');

    function resizeCanvas() {
        var container = document.getElementById('earth-animation');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    var trees = [];
    var growth_rate = 0.61;
    var maximum_bend = 90 / 180 * Math.PI;
    var smallest_branch = 35;
    var maxTrees = 5;
    var treeLifespan = 50000; // Adjust this value to control how long a tree lives before disappearing

    function init() {
        resizeCanvas();
        // Plant initial trees
        for (var i = 0; i < maxTrees; i++) {
            plant_new_tree();
        }
        requestAnimationFrame(loop);

        // Initialize rain particles
        particlesJS('rain-particles', rainParticlesConfig);

        // Start the tree lifecycle
        setInterval(manageTreeLifecycle, treeLifespan);
    }

    function plant_new_tree() {
        var magnitude = canvas.height * 0.25, // Adjust tree height
            thickness = 4,
            theta = 0,
            origin = {
                x: Math.random() * canvas.width,
                y: canvas.height
            };

        var newTree = [create_branch(origin, magnitude, thickness, theta, 100)];
        newTree[0].tree = newTree;
        newTree[0].birthTime = Date.now();
        trees.push(newTree);
    }

    function manageTreeLifecycle() {
        if (trees.length > 0) {
            // Remove the oldest tree
            trees.shift();
        }
        // Plant a new tree
        plant_new_tree();
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    function update() {
        trees.forEach(tree => tree.forEach(grow_branch));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        trees.forEach(tree => {
            tree.forEach(function(branch) {
                var w = branch.thickness;
                var oX1 = branch.origin.x - w;
                var oX2 = branch.origin.x + w;
                var oY = branch.origin.y;
                var tX1 = branch.tip.x - w * 0.8;
                var tX2 = branch.tip.x + w * 0.8;
                var tY = branch.tip.y;
                var cpX1 = (oX1 + oX1 + tX1) / 3;
                var cpY1 = (oY + tY + tY) / 3;
                var cpX2 = (oX2 + oX2 + tX2) / 3;
                var cpY2 = (oY + tY + tY) / 3;
                ctx.beginPath();
                ctx.moveTo(oX1, oY);
                ctx.quadraticCurveTo(cpX1, cpY1, tX1, tY);
                ctx.lineTo(tX2, tY);
                ctx.quadraticCurveTo(cpX2, cpY2, oX2, oY);
                ctx.fillStyle = `rgba(255, 255, 255, ${branch.lightness / 100})`;
                ctx.fill();
            });
        });
    }

    function grow_branch(branch) {
        if (branch.done) return;

        var x = (branch.tip.x - branch.origin.x);
        var y = (branch.tip.y - branch.origin.y);
        var h = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        if (h >= branch.magnitude) {
            branch.done = true;

            if (branch.magnitude < smallest_branch) return;
            shoot(branch);

            return;
        }

        branch.tip.x = branch.tip.x + (Math.sin(branch.theta) * growth_rate);
        branch.tip.y = branch.tip.y - (Math.cos(branch.theta) * growth_rate);
    }

    function shoot(branch) {
        if (branch.sprouts <= 0) return;
        branch.sprouts -= 1;

        var theta2 = branch.theta + (Math.random() * maximum_bend - maximum_bend / 2);
        var magnitude2 = branch.magnitude * (Math.random() * 0.2 + 0.7);
        var lightness2 = branch.lightness * 0.9;

        var newBranch = create_branch({
            x: branch.tip.x,
            y: branch.tip.y
        }, magnitude2, branch.thickness * 0.6, theta2, lightness2);
        
        newBranch.tree = branch.tree;
        branch.tree.push(newBranch);

        shoot(branch);
    }

    function create_branch(origin, magnitude, thickness, theta, lightness) {
        return {
            origin: origin,
            thickness: thickness,
            theta: theta,
            magnitude: magnitude,
            tip: {
                x: origin.x,
                y: origin.y
            },
            lightness: lightness,
            sprouts: ((Math.random() * 4) + 1) >>> 0
        };
    }

    // Rain particles configuration
    const rainParticlesConfig = {
        particles: {
            number: { value: 400, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.8, random: true },
            size: { value: 2, random: true },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 13,
                direction: "bottom",
                random: false,
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

    window.addEventListener('load', init);
    window.addEventListener('resize', function() {
        resizeCanvas();
        particlesJS('rain-particles', rainParticlesConfig);
    });
})();