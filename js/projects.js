function initializeProjects() {
    const projectLinks = document.querySelectorAll('.projects-sidebar a, .project-card .btn');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project') || link.getAttribute('href').substring(1);
            
            if (link.closest('.project-card')) {
                document.querySelector('.nav-link[href="#projects"]').click();
            }
            
            showProjectDetails(projectId);
        });
    });
}

function showProjectDetails(projectId) {
    const project = projects[projectId];
    const projectDetails = document.getElementById('project-details');
    
    projectDetails.classList.add('fade-out');
    
    setTimeout(() => {
        projectDetails.innerHTML = generateProjectHTML(project);
        projectDetails.classList.remove('fade-out');
        
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });

        // Set up lightbox functionality
        setupProjectLightbox(project);
    }, 300);

    document.querySelectorAll('.project-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.project-link[href="#${projectId}"]`).classList.add('active');
}

function generateProjectHTML(project) {
    const mainMediaHTML = project.mainMedia 
        ? renderMedia(project.mainMedia)
        : `<img src="${project.mainImage}" alt="${project.title} Main Interface" class="main-image img-fluid rounded">`;

    return `
        <h2>${project.title}</h2>
        
        <div class="project-gallery mb-4">
            ${mainMediaHTML}
            <div class="thumbnail-gallery">
                ${project.thumbnails.map((thumb, index) => `<img src="${thumb}" alt="Feature thumbnail" class="project-thumbnail" data-index="${index}">`).join('')}
            </div>
        </div>
        
        <div class="project-description">
            ${project.overview ? `<div class="full-width-text mb-4">${project.overview}</div>` : ''}
            
            ${project.sections.map((section, index) => `
                <div class="container-fluid p-0">
                    <div class="row align-items-center mb-4">
                        <div class="col-md-6 ${index % 2 === 0 ? 'order-md-2' : ''}">
                            ${section.media ? renderMedia(section.media) : `<img src="${section.image}" alt="${section.title}" class="img-fluid rounded section-image" data-index="${index}">`}
                        </div>
                        <div class="col-md-6 ${index % 2 === 0 ? 'order-md-1' : ''}">
                            <h3>${section.title}</h3>
                            ${section.type === 'list' 
                                ? `<ul>${section.content.map(item => `<li>${item}</li>`).join('')}</ul>`
                                : `<p>${section.content}</p>`
                            }
                        </div>
                    </div>
                </div>
            `).join('')}
            
            <div class="project-actions">
                <a href="${project.downloadLink}" class="btn btn-primary">Download</a>
                <a href="${project.manualLink}" class="btn btn-secondary">User Manual</a>
            </div>
        </div>
    `;
}

function renderMedia(media) {
    if (media.type === "video") {
        return `<video src="${media.src}" controls class="img-fluid rounded">Your browser does not support the video tag.</video>`;
    } else {
        return `<img src="${media.src}" alt="Project media" class="img-fluid rounded">`;
    }
}

function setupProjectLightbox(project) {
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.project-thumbnail');
    const sectionImages = document.querySelectorAll('.section-image');

    if (mainImage) {
        mainImage.addEventListener('click', () => openProjectLightbox(project, -1));
    }

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => openProjectLightbox(project, index));
    });

    sectionImages.forEach((img, index) => {
        img.addEventListener('click', () => openProjectLightbox(project, index, true));
    });
}

function openProjectLightbox(project, index, isSection = false) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('project-lightbox');
    
    let images;
    let currentImage;

    if (isSection) {
        images = project.sections.map(section => section.image || (section.media && section.media.src));
        currentImage = images[index];
    } else {
        images = [project.mainImage || (project.mainMedia && project.mainMedia.src), ...project.thumbnails];
        currentImage = index === -1 ? images[0] : images[index + 1];
    }

    lightbox.innerHTML = `
        <div class="project-lightbox-content">
            <img src="${currentImage}" alt="Enlarged image">
            <button class="project-lightbox-close">&times;</button>
            <button class="project-lightbox-nav prev">&lt;</button>
            <button class="project-lightbox-nav next">&gt;</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.project-lightbox-close');
    const prevBtn = lightbox.querySelector('.project-lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.project-lightbox-nav.next');

    closeBtn.addEventListener('click', closeProjectLightbox);
    prevBtn.addEventListener('click', () => navigateProjectLightbox(images, index, -1));
    nextBtn.addEventListener('click', () => navigateProjectLightbox(images, index, 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeProjectLightbox();
    });

    document.addEventListener('keydown', handleProjectKeyPress);
}

function navigateProjectLightbox(images, currentIndex, direction) {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;

    const lightboxImg = document.querySelector('.project-lightbox-content img');
    lightboxImg.src = images[newIndex];
}

function closeProjectLightbox() {
    const lightbox = document.querySelector('.project-lightbox');
    if (lightbox) {
        lightbox.remove();
        document.removeEventListener('keydown', handleProjectKeyPress);
    }
}

function handleProjectKeyPress(e) {
    const lightbox = document.querySelector('.project-lightbox');
    if (!lightbox) return;

    switch(e.key) {
        case 'Escape':
            closeProjectLightbox();
            break;
        case 'ArrowLeft':
            lightbox.querySelector('.project-lightbox-nav.prev').click();
            break;
        case 'ArrowRight':
            lightbox.querySelector('.project-lightbox-nav.next').click();
            break;
    }
}

const projects = {
    datamerger: {
        title: "DataMerger",
        mainImage: "Images/DataMerger/DataMerger.jpg",
        overview: "DataMerger is a versatile data manipulation and visualization tool born from a personal need to streamline common data science tasks at DTU. This hobby project evolved into a powerful application that simplifies complex data operations, including merging datasets, filtering based on various criteria, and performing grouping and aggregation tasks. Key features include easy data visualization in tabular format, connection to local SQL servers for direct data extraction, advanced filtering and merging capabilities based on primary keys, spatial data visualization and analysis, built-in statistics and analysis tools, and flexible data import and export options. The core functionality revolves around loading a main dataset and multiple secondary datasets, allowing users to perform a wide range of operations to create a refined, merged dataset tailored to their specific needs.",
        thumbnails: [
            "Images/DataMerger/DataMergerFilter.jpg",
            "Images/DataMerger/DataMergerGroupAndAggregate.jpg",
        ],
        sections: [
            {
                title: "Map",
                image: "Images/DataMerger/DataMergerMap.jpg",
                content: "The Map tab leverages Leaflet.js to provide a robust spatial visualization tool. Users can plot up to 50,000 points on the map by selecting latitude and longitude columns from their data. Key features include customizable popup content for each point, a polygon drawing tool for creating and exporting custom areas, import functionality for .geojson and .shp files, spatial join filtering to keep only points within defined polygons, layer management and style customization options, and export capability to save maps as .html files. Note: There are current limitations on the size of imported polygons and the number of plotted points.",
                type: "text"
            },
            {
                title: "Statistics",
                image: "Images/DataMerger/DataMergerStatistics.jpg",
                content: [
                    "Detailed statistics table showing metrics like data type, missing values, unique values, and mode for each column",
                    "Overall dataset statistics",
                    "Dynamic column-specific statistics that update based on user selection",
                    "Visualizations for missing value counts and data type distribution"
                ],
                type: "list"
            },
            {
                title: "Analysis",
                image: "Images/DataMerger/DataMergerAnalysis.jpg",
                content: "The Analysis tab introduces a powerful feature allowing users to apply filters to their data without altering the original dataset. Users can select specific columns to analyze, revealing insights such as value counts based on applied filters. This non-destructive analysis approach enables users to explore various scenarios and hypotheses without risking data integrity.",
                type: "text"
            },
            {
                title: "Plots",
                image: "Images/DataMerger/DataMergerPlotsWIP.jpg",
                content: "While still under development, the Plots tab aims to provide a flexible and semi-advanced plotting tool. The goal is to offer users the ability to create a variety of customized visualizations directly from their data. This feature is continuously evolving to meet diverse data visualization needs.",
                type: "text"
            }
        ],
        downloadLink: "https://drive.google.com/drive/folders/1LXid9MsNKbMyI96VcK_o-Pz2Nb9Or4XP?usp=drive_link",
        manualLink: "datamerger-manual.pdf"
    },
    headanalyser: {
        title: "HeadAnalyser",
        mainMedia: { type: "video", src: "videos/HeadAnalyser_demo.mp4" },
        thumbnails: [
            "https://via.placeholder.com/100x100",
            "https://via.placeholder.com/100x100",
            "https://via.placeholder.com/100x100"
        ],
        sections: [
            {
                title: "Project Overview",
                media: { type: "video", src: "videos/HeadAnalyser_demo.mp4" },
                content: "HeadAnalyser is an advanced tool for analyzing head movements using computer vision and machine learning techniques. Watch the demo video to see it in action!",
                type: "text"
            },
            {
                title: "Key Features",
                media: { type: "image", src: "https://via.placeholder.com/600x400" },
                content: [
                    "Real-time head pose estimation",
                    "Movement pattern recognition",
                    "Data visualization of head movement metrics",
                    "Integration with popular video processing libraries"
                ],
                type: "list"
            },
            {
                title: "Technical Details",
                image: "https://via.placeholder.com/600x400",
                content: "HeadAnalyser is built using Python with libraries such as OpenCV, TensorFlow, and Matplotlib. It uses deep learning algorithms to analyze head movements and provides real-time visualization of the results.",
                type: "text"
            }
        ],
        downloadLink: "headanalyser-download.zip",
        manualLink: "headanalyser-manual.pdf"
    },
    kmlcomrade: {
        title: "KMLComrade",
        mainImage: "https://via.placeholder.com/600x400",
        thumbnails: [
            "https://via.placeholder.com/100x100",
            "https://via.placeholder.com/100x100",
            "https://via.placeholder.com/100x100"
        ],
        sections: [
            {
                title: "Project Overview",
                image: "https://via.placeholder.com/600x400",
                content: "EcoTracker is an innovative environmental monitoring and data analysis platform designed to help researchers and conservationists track ecosystem changes over time.",
                type: "text"
            },
            {
                title: "Key Features",
                image: "https://via.placeholder.com/600x400",
                content: [
                    "Real-time data collection from various environmental sensors",
                    "Advanced geospatial analysis and visualization",
                    "Machine learning algorithms for predictive modeling",
                    "Collaborative tools for sharing and analyzing data across research teams"
                ],
                type: "list"
            },
            {
                title: "Technical Details",
                image: "https://via.placeholder.com/600x400",
                content: "EcoTracker is built using a combination of Python for backend processing, React for the frontend interface, and PostgreSQL with PostGIS for spatial data storage. It leverages cloud computing for scalable data processing and analysis.",
                type: "text"
            },
            {
                title: "Impact",
                image: "https://via.placeholder.com/600x400",
                content: "EcoTracker has been successfully deployed in several national parks and protected areas, helping researchers monitor biodiversity, track climate change impacts, and inform conservation strategies.",
                type: "text"
            }
        ],
        downloadLink: "ecotracker-demo.zip",
        manualLink: "ecotracker-manual.pdf"
    }
};