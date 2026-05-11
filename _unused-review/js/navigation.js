function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    // Click: smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Immediate active state feedback
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Scroll: update active nav link based on visible section
    const updateActiveLink = () => {
        const navHeight = document.querySelector('.navbar')?.offsetHeight ?? 60;
        const scrollY   = window.scrollY + navHeight + 80;

        // Include footer (#contact) in scroll tracking
        const allTargets = [
            ...Array.from(sections),
            document.getElementById('contact')
        ].filter(Boolean);

        let currentId = '';
        allTargets.forEach(el => {
            if (el.offsetTop <= scrollY) {
                currentId = el.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentId}`);
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // run once on load

    // Auto-load first project when #projects section scrolls into view
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const detailsEl = document.getElementById('project-details');
                    if (detailsEl && detailsEl.children.length === 0) {
                        if (typeof showProjectDetails === 'function') {
                            showProjectDetails('datamerger');
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(projectsSection);
    }
}
