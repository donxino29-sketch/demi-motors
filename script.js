document.addEventListener('DOMContentLoaded', function() {

    // Gestione della navigazione tra le sezioni
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const pages = document.querySelectorAll('.page');
                
                pages.forEach(page => {
                    page.classList.remove('active');
                });
                
                const targetPage = document.getElementById(targetId);
                if (targetPage) {
                    targetPage.classList.add('active');
                    window.scrollTo(0, 0);
                }
            }
        });
    });

    // Funzione per inizializzare le gallerie su ogni sezione
    function initializeGalleries() {
        const modelloAutoSections = document.querySelectorAll('.modello-auto');
        
        modelloAutoSections.forEach(section => {
            const galleryContainer = section.querySelector('.image-gallery-container');
            if (!galleryContainer) return;

            const colorButtons = section.querySelectorAll('.btn-color');
            const imageContainers = section.querySelectorAll('.image-container');
            const prevButton = galleryContainer.querySelector('.gallery-prev');
            const nextButton = galleryContainer.querySelector('.gallery-next');

            function showGallery(targetId) {
                imageContainers.forEach(container => {
                    container.classList.remove('active');
                    container.querySelectorAll('img').forEach(img => img.classList.remove('active'));
                });
                const targetContainer = section.querySelector(`#${targetId}`);
                if (targetContainer) {
                    targetContainer.classList.add('active');
                    const firstImage = targetContainer.querySelector('img');
                    if (firstImage) {
                        firstImage.classList.add('active');
                    }
                }
            }

            if (colorButtons.length > 0) {
                 const activeColorButton = section.querySelector('.btn-color.active');
                 if (activeColorButton) {
                    showGallery(activeColorButton.getAttribute('data-target'));
                 }
            } else {
                const firstGallery = section.querySelector('.image-container');
                if (firstGallery) {
                    firstGallery.classList.add('active');
                    const firstImage = firstGallery.querySelector('img');
                    if(firstImage) {
                        firstImage.classList.add('active');
                    }
                }
            }

            colorButtons.forEach(button => {
                button.addEventListener('click', function() {
                    colorButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    showGallery(this.getAttribute('data-target'));
                });
            });

            if (prevButton && nextButton) {
                prevButton.addEventListener('click', function() {
                    const activeContainer = section.querySelector('.image-container.active');
                    if (activeContainer) {
                        const activeImage = activeContainer.querySelector('img.active');
                        const prevImage = activeImage.previousElementSibling;
                        if (prevImage) {
                            activeImage.classList.remove('active');
                            prevImage.classList.add('active');
                        } else {
                            activeImage.classList.remove('active');
                            const imagesInContainer = activeContainer.querySelectorAll('img');
                            imagesInContainer[imagesInContainer.length - 1].classList.add('active');
                        }
                    }
                });

                nextButton.addEventListener('click', function() {
                    const activeContainer = section.querySelector('.image-container.active');
                    if (activeContainer) {
                        const activeImage = activeContainer.querySelector('img.active');
                        const nextImage = activeImage.nextElementSibling;
                        if (nextImage) {
                            activeImage.classList.remove('active');
                            nextImage.classList.add('active');
                        } else {
                            activeImage.classList.remove('active');
                            activeContainer.firstElementChild.classList.add('active');
                        }
                    }
                });
            }
        });
    }

    // Aggiungi la logica per la modale delle immagini
    const modal = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);

    const images = document.querySelectorAll('.image-container img, .concept-image-item img');
    let currentImageIndex = 0;
    let currentGalleryImages = [];

    images.forEach(img => {
        img.addEventListener('click', function() {
            const container = this.closest('.image-container');
            const conceptScroller = this.closest('.concept-images-scroller');
            
            if (container) {
                currentGalleryImages = Array.from(container.querySelectorAll('img'));
            } else if (conceptScroller) {
                 currentGalleryImages = Array.from(conceptScroller.querySelectorAll('img'));
            } else {
                currentGalleryImages = [this];
            }

            currentImageIndex = currentGalleryImages.indexOf(this);
            openModal(this.src);
        });
    });

    function openModal(imageSrc) {
        modal.innerHTML = `
            <span class="modal-close">&times;</span>
            <div class="modal-nav">
                <span class="modal-prev">&lt;</span>
                <span class="modal-next">&gt;</span>
            </div>
            <div class="modal-content">
                <img src="${imageSrc}" alt="">
            </div>
        `;
        modal.style.display = 'flex';
        
        modal.querySelector('.modal-close').onclick = () => {
            modal.style.display = 'none';
        };

        modal.querySelector('.modal-prev').onclick = () => {
            currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            modal.querySelector('.modal-content img').src = currentGalleryImages[currentImageIndex].src;
        };

        modal.querySelector('.modal-next').onclick = () => {
            currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
            modal.querySelector('.modal-content img').src = currentGalleryImages[currentImageIndex].src;
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
    
    // Inizializza le gallerie al caricamento della pagina
    initializeGalleries();

});