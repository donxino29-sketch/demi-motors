document.addEventListener('DOMContentLoaded', function() {

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
                const targetContainer = section.querySelector(`.image-container[data-color="${targetId}"]`);
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
                 } else {
                     showGallery(colorButtons[0].getAttribute('data-target'));
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

    // Aggiungi la logica per la modale di immagini e video
    const modal = document.getElementById('media-modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    
    let currentMediaIndex = 0;
    let currentGalleryElements = [];

    document.body.addEventListener('click', function(e) {
        let clickedElement = e.target;
        if (clickedElement.closest('.concept-item')) {
            clickedElement = clickedElement.closest('.concept-item').querySelector('img, video');
        } else if (clickedElement.closest('.image-gallery-container') && clickedElement.tagName === 'IMG' && clickedElement.classList.contains('active')) {
            clickedElement = clickedElement;
        } else {
            return;
        }

        const container = clickedElement.closest('.image-gallery-container');
        const conceptScroller = clickedElement.closest('.concept-images-scroller');
        
        if (container) {
            currentGalleryElements = Array.from(container.querySelectorAll('.image-container.active img'));
        } else if (conceptScroller) {
            currentGalleryElements = Array.from(conceptScroller.querySelectorAll('.concept-item img, .concept-item video'));
        } else {
            currentGalleryElements = [clickedElement];
        }

        currentMediaIndex = currentGalleryElements.indexOf(clickedElement);
        openModal();
    });

    function openModal() {
        updateModalContent();
        modal.style.display = 'flex';
    }

    function updateModalContent() {
        const currentMediaElement = currentGalleryElements[currentMediaIndex];
        const isVideo = currentMediaElement.tagName.toLowerCase() === 'video';
        
        modalContent.innerHTML = '';
        
        if (isVideo) {
            const videoElement = document.createElement('video');
            videoElement.src = currentMediaElement.querySelector('source').src;
            videoElement.controls = true;
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement.loop = true;
            modalContent.appendChild(videoElement);
        } else {
            const imgElement = document.createElement('img');
            imgElement.src = currentMediaElement.src;
            imgElement.alt = currentMediaElement.alt;
            modalContent.appendChild(imgElement);
        }
    }
    
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
        modalContent.querySelector('video')?.pause();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalContent.querySelector('video')?.pause();
        }
    });

    modalPrev.addEventListener('click', function() {
        currentMediaIndex = (currentMediaIndex - 1 + currentGalleryElements.length) % currentGalleryElements.length;
        updateModalContent();
    });

    modalNext.addEventListener('click', function() {
        currentMediaIndex = (currentMediaIndex + 1) % currentGalleryElements.length;
        updateModalContent();
    });

    // Inizializza le gallerie al caricamento della pagina
    initializeGalleries();

    // Animazioni On-Scroll
    const elementsToAnimate = document.querySelectorAll('.modello-auto, .modello-item, .concept-section, .home-intro');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });

    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});