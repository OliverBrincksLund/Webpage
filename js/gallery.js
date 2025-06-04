function initializeGallery() {
    populateGallery();
}

function populateGallery() {
    const plotGallery = document.querySelector('#plot-gallery');
    const mapGallery = document.querySelector('#map-gallery');
    
    galleryItems.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        if (item.category === 'plot') {
            plotGallery.appendChild(galleryItem);
        } else if (item.category === 'map') {
            mapGallery.appendChild(galleryItem);
        }
    });
}

function createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <img src="placeholder.jpg" data-src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="overlay">
            <i class="fas fa-search-plus"></i>
        </div>
    `;
    galleryItem.addEventListener('click', () => openLightbox(index));
    return galleryItem;
}

function lazyLoadGalleryImages() {
    const images = document.querySelectorAll('.gallery-item img[data-src]');
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

function openLightbox(index) {
    const currentItem = galleryItems[index];
    currentCategoryItems = galleryItems.filter(item => item.category === currentItem.category);
    currentImageIndex = currentCategoryItems.findIndex(item => item === currentItem);

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-carousel">
                ${currentCategoryItems.map(item => `
                    <div class="lightbox-slide">
                        <img src="${item.src}" alt="${item.title}">
                        <div class="lightbox-info">
                            <h3>${item.title}</h3>
                            <p class="lightbox-type">${item.type}</p>
                            <p class="lightbox-description">${item.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <button class="lightbox-nav prev">&lt;</button>
        <button class="lightbox-nav next">&gt;</button>
    `;
    document.body.appendChild(lightbox);
    
    const carousel = lightbox.querySelector('.lightbox-carousel');
    const prevButton = lightbox.querySelector('.lightbox-nav.prev');
    const nextButton = lightbox.querySelector('.lightbox-nav.next');

    function updateCarousel() {
        const slides = lightbox.querySelectorAll('.lightbox-slide');
        slides.forEach((slide, i) => {
            if (i === currentImageIndex) {
                slide.style.display = 'flex';
            } else {
                slide.style.display = 'none';
            }
        });
        updateArrowVisibility();
    }

    function updateArrowVisibility() {
        prevButton.style.display = currentImageIndex > 0 ? 'block' : 'none';
        nextButton.style.display = currentImageIndex < currentCategoryItems.length - 1 ? 'block' : 'none';
    }

    prevButton.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentImageIndex < currentCategoryItems.length - 1) {
            currentImageIndex++;
            updateCarousel();
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', handleKeyPress);

    setTimeout(() => {
        lightbox.classList.add('open');
        updateCarousel();
    }, 50);
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('open');
    setTimeout(() => {
        lightbox.remove();
        document.removeEventListener('keydown', handleKeyPress);
    }, 300);
}

function handleKeyPress(e) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const prevButton = lightbox.querySelector('.lightbox-nav.prev');
    const nextButton = lightbox.querySelector('.lightbox-nav.next');

    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            prevButton.click();
            break;
        case 'ArrowRight':
            nextButton.click();
            break;
    }
}


// Gallery functionality
const galleryItems = [
    // Plots
    {
        src: 'Images/Gallery/Plots/plot1.png',
        title: 'Sample Plot 1',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the first plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot2.png',
        title: 'Sample Plot 2',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot3.png',
        title: 'Sample Plot 3',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot4.png',
        title: 'Sample Plot 4',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot5.png',
        title: 'Sample Plot 5',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot6.png',
        title: 'Sample Plot 6',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot7.png',
        title: 'Sample Plot 7',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    {
        src: 'Images/Gallery/Plots/plot8.png',
        title: 'Sample Plot 8',
        type: 'Plot',
        category: 'plot',
        description: 'This is a description of the second plot.'
    },
    // Maps
    {
        src: 'Images/Gallery/Maps/map1.png',
        title: 'Sample Map 1',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the first map.'
    },
    {
        src: 'Images/Gallery/Maps/map2.png',
        title: 'Sample Map 2',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map3.png',
        title: 'Sample Map 3',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map4.png',
        title: 'Sample Map 4',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map5.jpg',
        title: 'Sample Map 5',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map6.png',
        title: 'Sample Map 6',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map7.png',
        title: 'Sample Map 7',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map8.png',
        title: 'Sample Map 8',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map9.png',
        title: 'Sample Map 9',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map10.png',
        title: 'Sample Map 10',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    },
    {
        src: 'Images/Gallery/Maps/map11.png',
        title: 'Sample Map 11',
        type: 'Map',
        category: 'map',
        description: 'This is a description of the second map.'
    }
    // Add more items as needed
    ];