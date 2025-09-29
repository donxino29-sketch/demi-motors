document.addEventListener('DOMContentLoaded', function() {

    // =========================================================
    // 1. LOGICA SEQUENZA VIDEO HEADER
    // =========================================================

    const videoIds = ['video1', 'video2', 'video3']; // Assicurati che questi ID corrispondano al tuo HTML
    let currentVideoIndex = 0;

    // Funzione principale per passare al video successivo
    const playNextVideo = () => {
        // Nasconde il video corrente (se esiste)
        const currentVideo = document.getElementById(videoIds[currentVideoIndex]);
        if (currentVideo) {
            currentVideo.classList.add('hidden');
            currentVideo.onended = null; // Rimuove l'ascoltatore precedente
        }

        // Passa all'indice successivo
        currentVideoIndex++;

        // Controlla se ci sono ancora video nella sequenza
        if (currentVideoIndex < videoIds.length) {
            const nextVideo = document.getElementById(videoIds[currentVideoIndex]);

            if (nextVideo) {
                // Mostra il video successivo
                nextVideo.classList.remove('hidden');

                // Avvia la riproduzione e gestisce la riproduzione automatica bloccata
                nextVideo.play().catch(error => {
                    console.warn(`Riproduzione automatica di ${videoIds[currentVideoIndex]} bloccata.`, error);
                });

                // Imposta l'ascoltatore per quando questo video finisce
                nextVideo.onended = playNextVideo;
            }
        } else {
            // Sequenza terminata: opzionalmente, ricomincia da capo
            // currentVideoIndex = -1; 
            // playNextVideo(); 
            console.log("Sequenza video nell'header terminata.");
        }
    };

    // Avvia il PRIMO video della sequenza
    const firstVideo = document.getElementById(videoIds[0]);
    if (firstVideo) {
        firstVideo.classList.remove('hidden');
        firstVideo.onended = playNextVideo; // Imposta il trigger per il passaggio al video 2

        // Tenta di avviare la riproduzione automatica (necessita di 'muted' e 'playsinline' nell'HTML)
        firstVideo.play().catch(error => {
            console.warn(`Riproduzione automatica di ${videoIds[0]} bloccata.`, error);
            // Se bloccata, il video resta in pausa e aspetta l'interazione dell'utente
        });
    }

    // =========================================================
    // 2. LOGICA DELLE GALLERIE IMMAGINI (CODICE PREESISTENTE)
    // =========================================================

    // Funzione per inizializzare le gallerie su ogni sezione, inclusa la logica filtro colori Dynora
    function initializeGalleries() {
        const modelloAutoSections = document.querySelectorAll('.modello-auto');
        modelloAutoSections.forEach(section => {
            const galleryContainer = section.querySelector('.image-gallery-container');
            if (!galleryContainer) return;

            const colorButtons = galleryContainer.querySelectorAll('.btn-color');
            const imageContainers = galleryContainer.querySelectorAll('.image-container');
            const prevButton = galleryContainer.querySelector('.gallery-prev');
            const nextButton = galleryContainer.querySelector('.gallery-next');

            function showGallery(targetId) {
                imageContainers.forEach(container => {
                    container.classList.remove('active');
                    container.querySelectorAll('img').forEach(img => img.classList.remove('active'));
                });
                const targetContainer = galleryContainer.querySelector(`.image-container[data-color="${targetId}"]`);
                if (targetContainer) {
                    targetContainer.classList.add('active');
                    const firstImage = targetContainer.querySelector('img');
                    if (firstImage) {
                        firstImage.classList.add('active');
                    }
                }
            }

            // Inizializzazione: mostra la gallery del colore attivo o la prima
            if (colorButtons.length > 0) {
                const activeColorButton = galleryContainer.querySelector('.btn-color.active');
                if (activeColorButton) {
                    showGallery(activeColorButton.getAttribute('data-target'));
                } else {
                    showGallery(colorButtons[0].getAttribute('data-target'));
                }
            } else {
                const firstGallery = galleryContainer.querySelector('.image-container');
                if (firstGallery) {
                    firstGallery.classList.add('active');
                    const firstImage = firstGallery.querySelector('img');
                    if (firstImage) {
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
                    const activeContainer = galleryContainer.querySelector('.image-container.active');
                    if (activeContainer) {
                        const activeImage = activeContainer.querySelector('img.active');
                        const imagesInContainer = activeContainer.querySelectorAll('img');
                        let idx = Array.from(imagesInContainer).indexOf(activeImage);
                        activeImage.classList.remove('active');
                        if (idx > 0) {
                            imagesInContainer[idx - 1].classList.add('active');
                        } else {
                            imagesInContainer[imagesInContainer.length - 1].classList.add('active');
                        }
                    }
                });
                nextButton.addEventListener('click', function() {
                    const activeContainer = galleryContainer.querySelector('.image-container.active');
                    if (activeContainer) {
                        const activeImage = activeContainer.querySelector('img.active');
                        const imagesInContainer = activeContainer.querySelectorAll('img');
                        let idx = Array.from(imagesInContainer).indexOf(activeImage);
                        activeImage.classList.remove('active');
                        if (idx < imagesInContainer.length - 1) {
                            imagesInContainer[idx + 1].classList.add('active');
                        } else {
                            imagesInContainer[0].classList.add('active');
                        }
                    }
                });
            }
        });
    }


    // =========================================================
    // 3. LOGICA MODALE PER IMMAGINI E VIDEO (CODICE PREESISTENTE)
    // =========================================================

    // Funzione globale per zoom delle immagini gallery-img
    window.zoomGalleryImg = function(img) {
        if (!modal || !modalContent) return;
        // Trova tutte le immagini gallery-img visibili nella stessa image-row
        const row = img.closest('.image-row');
        if (row) {
            currentGalleryElements = Array.from(row.querySelectorAll('.gallery-img'));
        } else {
            currentGalleryElements = [img];
        }
        currentMediaIndex = currentGalleryElements.indexOf(img);
        openModal();
    };

    const modal = document.getElementById('media-modal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    const modalPrev = modal ? modal.querySelector('.modal-prev') : null;
    const modalNext = modal ? modal.querySelector('.modal-next') : null;

    let currentMediaIndex = 0;
    let currentGalleryElements = [];

    if (modal) {
        document.body.addEventListener('click', function(e) {
            let clickedElement = e.target;
            
            // Cerca l'elemento cliccato che sia un media
            if (clickedElement.closest('.concept-item')) {
                clickedElement = clickedElement.closest('.concept-item').querySelector('img, video');
            } else if (clickedElement.closest('.image-gallery-container') && clickedElement.tagName === 'IMG' && clickedElement.classList.contains('active')) {
                // Il check sull'immagine attiva è già corretto
            } else {
                return; // Se l'elemento non è rilevante, esce
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
                // Se il video ha il tag <source>, prende l'src da lì
                const videoSrc = currentMediaElement.querySelector('source') ? currentMediaElement.querySelector('source').src : currentMediaElement.src;
                
                videoElement.src = videoSrc;
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
            modalContent.querySelector('video')?.pause();
            currentMediaIndex = (currentMediaIndex - 1 + currentGalleryElements.length) % currentGalleryElements.length;
            updateModalContent();
        });

        modalNext.addEventListener('click', function() {
            modalContent.querySelector('video')?.pause();
            currentMediaIndex = (currentMediaIndex + 1) % currentGalleryElements.length;
            updateModalContent();
        });
    }


    // =========================================================
    // 4. ESECUZIONE INIZIALE E ANIMAZIONI ON-SCROLL
    // =========================================================

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