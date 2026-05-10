function initializeCarousels() {
    initializeCarousel('.project-carousel', '.project-card');
    initializeCarousel('.plot-carousel', '.plot-card');
    initializeCarousel('.map-carousel', '.map-card');
}

function initializeCarousel(carouselSelector, cardSelector) {
    const carouselContainer = document.querySelector(carouselSelector);
    if (!carouselContainer) return;

    const cardsContainer = carouselContainer.querySelector('.project-cards-container, .plot-cards-container, .map-cards-container');
    const carousel = cardsContainer.querySelector('.project-cards, .plot-cards, .map-cards');
    const prevButton = carouselContainer.querySelector('.carousel-arrow.prev');
    const nextButton = carouselContainer.querySelector('.carousel-arrow.next');
    
    if (!carousel || !prevButton || !nextButton) return;

    const cards = carousel.querySelectorAll(cardSelector);
    if (cards.length === 0) return;

    let currentPosition = 0;
    const cardWidth = cards[0].offsetWidth;
    const visibleCards = Math.floor(carouselContainer.offsetWidth / cardWidth);

    function updateCarousel(smooth = true) {
        carousel.style.transition = smooth ? 'transform 0.3s ease' : 'none';
        carousel.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
        updateArrowVisibility();
    }

    function updateArrowVisibility() {
        prevButton.style.display = currentPosition > 0 ? 'block' : 'none';
        nextButton.style.display = currentPosition + visibleCards < cards.length ? 'block' : 'none';
    }

    prevButton.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPosition + visibleCards < cards.length) {
            currentPosition++;
            updateCarousel();
        }
    });

    // Initial setup
    updateArrowVisibility();

    // Handle window resize
    window.addEventListener('resize', () => {
        currentPosition = 0;
        updateCarousel(false);
    });
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarousels);