import projectsData from '../assets/portfolio/projectsData.js';

document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const modal = document.getElementById('modal');
    const modalMainImg = document.getElementById('modal-main-img');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalLiveDemo = document.getElementById('modal-live-demo');
    const modalSourceCode = document.getElementById('modal-source-code');
    const closeButton = document.querySelector('.close-button');

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const liveDemoButton = project.liveDemo
            ? `<a href="${project.liveDemo}" target="_blank" class="btn btn-primary">Live Demo</a>`
            : '';

        card.innerHTML = `
            <img src="${project.images[0]}" alt="${project.title} - Project by Kevin Pramudya Mahardika">
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-card-buttons">
                    ${liveDemoButton}
                    <a href="${project.sourceCode}" target="_blank" class="btn btn-secondary">Source Code</a>
                </div>
            </div>
        `;
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                openModal(project);
            }
        });
        return card;
    }

    function openModal(project) {
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;

        // Populate gallery
        modalMainImg.src = project.images[0];
        modalThumbnails.innerHTML = ''; // Clear previous thumbnails

        project.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `${project.title} - Project by Kevin Pramudya Mahardika - Screenshot ${index + 1}`;
            if (index === 0) {
                thumb.classList.add('active');
            }
            thumb.addEventListener('click', () => {
                modalMainImg.src = imgSrc;
                document.querySelectorAll('.modal-thumbnails img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            modalThumbnails.appendChild(thumb);
        });

        if (project.liveDemo) {
            modalLiveDemo.href = project.liveDemo;
            modalLiveDemo.style.display = 'inline-block';
        } else {
            modalLiveDemo.style.display = 'none';
        }
        modalSourceCode.href = project.sourceCode;
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    projectsData.forEach(project => {
        projectsGrid.appendChild(createProjectCard(project));
    });

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});