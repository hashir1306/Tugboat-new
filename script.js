document.addEventListener('DOMContentLoaded', () => {
    // Video Preloader Logic
    const preloader = document.getElementById('video-preloader');
    const introVideo = document.getElementById('intro-video');

    if (preloader && introVideo) {
        document.body.classList.add('loading');

        const hidePreloader = () => {
            if (document.body.classList.contains('loading')) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.classList.remove('loading');
            }
        };

        // When video ends, hide preloader
        introVideo.addEventListener('ended', hidePreloader);

        // Fallback in case video fails to load or play after 10 seconds
        setTimeout(hidePreloader, 10000);
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let isScrollingTimeout;

    const updateNavbarHeight = () => {
        if (navbar) {
            const height = navbar.offsetHeight;
            if (height > 0) {
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight, { passive: true });

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Hide navbar immediately when scrolling starts/continues
        navbar.classList.add('hidden');
        document.body.classList.add('nav-hidden');

        // Clear previous timeout
        window.clearTimeout(isScrollingTimeout);

        // Show navbar after user stops scrolling (200ms debounce)
        isScrollingTimeout = setTimeout(() => {
            navbar.classList.remove('hidden');
            document.body.classList.remove('nav-hidden');
            updateNavbarHeight();
        }, 200);

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateNavbarHeight();
    }, { passive: true });

    // Mobile Menu Initialization
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    if (navContainer && navLinks && !document.querySelector('.mobile-menu-btn')) {
        const mobileBtn = document.createElement('div');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;

        // Insert mobile button before the nav-links
        navContainer.insertBefore(mobileBtn, navLinks);

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');

            // Animate hamburger to close button if active
            if (navLinks.classList.contains('mobile-active')) {
                mobileBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            } else {
                mobileBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            }
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                mobileBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            });
        });
    }

    // Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Video play/pause functionality
    const heroVideo = document.getElementById('hero-video');
    const videoContainer = document.getElementById('video-container');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (heroVideo) {
        // Dynamically load video source based on screen size (Video8.mp4 for desktop, Video8_portrait.mp4 for mobile)
        const isMobile = window.innerWidth <= 900;
        const videoSrc = isMobile ? 'Video8_portrait.mp4' : 'Video8.mp4';
        
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        heroVideo.appendChild(source);
        heroVideo.load();
    }

    if (heroVideo && videoContainer) {
        videoContainer.addEventListener('click', () => {
            if (heroVideo.paused) {
                heroVideo.play();
                videoContainer.classList.remove('paused');
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                heroVideo.pause();
                videoContainer.classList.add('paused');
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });
    }

    // Scroll Image Sequence Animation
    const canvas = document.getElementById('scroll-canvas');
    const scrollSection = document.getElementById('scroll-sequence');

    if (canvas && scrollSection) {
        const context = canvas.getContext('2d', { alpha: false });

        let config = null;
        let images = [];
        let isMobileDevice = window.innerWidth <= 900;
        let targetFrame = 0;
        let currentRenderedFrame = 0;
        let lastDrawnFrameIndex = -1;
        let canvasCSSWidth = 0;
        let canvasCSSHeight = 0;

        const getSequenceConfig = (isMobile) => {
            if (isMobile) {
                return {
                    folder: 'frames1',
                    totalFrames: 1783,
                    step: 1782 / 299,
                    frameCount: 300,
                    getFilename: (frameNum) => `frames1/frames (${frameNum}).webp`
                };
            } else {
                return {
                    folder: 'frames',
                    totalFrames: 2313,
                    step: 2312 / 299,
                    frameCount: 300,
                    getFilename: (frameNum) => `frames/frame_${String(frameNum).padStart(4, '0')}.webp`
                };
            }
        };

        const renderImage = (imgElement) => {
            if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) return;

            // Use cover equivalent (object-fit: cover) to fill the full canvas without white bars
            const scale = Math.max(
                canvasCSSWidth / imgElement.width,
                canvasCSSHeight / imgElement.height
            );

            const drawW = imgElement.width * scale;
            const drawH = imgElement.height * scale;
            const x = (canvasCSSWidth - drawW) / 2;
            const y = (canvasCSSHeight - drawH) / 2;

            context.drawImage(imgElement, x, y, drawW, drawH);
        };

        const loadSequence = () => {
            images = [];
            config = getSequenceConfig(isMobileDevice);
            lastDrawnFrameIndex = -1;

            for (let i = 0; i < config.frameCount; i++) {
                const img = new Image();
                const frameNum = Math.round(i * config.step) + 1;
                img.src = config.getFilename(frameNum);
                images.push(img);
            }

            // Draw first frame when loaded
            if (images[0]) {
                images[0].onload = function () {
                    if (Math.round(currentRenderedFrame) === 0) {
                        renderImage(images[0]);
                        lastDrawnFrameIndex = 0;
                    }
                };
            }
        };

        const updateCanvasSize = () => {
            const container = canvas.parentElement;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvasCSSWidth = rect.width;
            canvasCSSHeight = rect.height;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';

            context.setTransform(dpr, 0, 0, dpr, 0, 0); // Explicitly reset transform matrix and apply scale

            // Force redraw of current frame
            const frameIndex = Math.round(currentRenderedFrame);
            if (images[frameIndex] && images[frameIndex].complete && images[frameIndex].naturalWidth !== 0) {
                renderImage(images[frameIndex]);
                lastDrawnFrameIndex = frameIndex;
            } else {
                drawNearestLoaded(frameIndex);
            }
        };

        const drawNearestLoaded = (frameIndex) => {
            if (images[frameIndex] && images[frameIndex].complete && images[frameIndex].naturalWidth !== 0) {
                renderImage(images[frameIndex]);
                lastDrawnFrameIndex = frameIndex;
                return;
            }
            // Fast outward search (up to 30 frames) instead of checking full array
            for (let r = 1; r < 30; r++) {
                const prev = frameIndex - r;
                if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth !== 0) {
                    renderImage(images[prev]);
                    lastDrawnFrameIndex = prev;
                    return;
                }
                const next = frameIndex + r;
                if (next < images.length && images[next] && images[next].complete && images[next].naturalWidth !== 0) {
                    renderImage(images[next]);
                    lastDrawnFrameIndex = next;
                    return;
                }
            }
        };

        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 900;
            if (newIsMobile !== isMobileDevice) {
                isMobileDevice = newIsMobile;
                loadSequence();
            }
            updateCanvasSize();
        };

        // Initialize sequence
        loadSequence();
        window.addEventListener('resize', handleResize);
        updateCanvasSize();

        window.addEventListener('scroll', () => {
            if (!config) return;
            const rect = scrollSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;

            let scrollProgress = 0;

            if (sectionTop <= 0) {
                const maxScroll = sectionHeight - viewportHeight;
                scrollProgress = maxScroll > 0 ? Math.abs(sectionTop) / maxScroll : 0;
            }

            targetFrame = Math.max(0, Math.min(config.frameCount - 1, scrollProgress * (config.frameCount - 1)));
        }, { passive: true });

        const renderLoop = () => {
            if (config) {
                // Fluid, responsive interpolation without scroll lag
                const diff = targetFrame - currentRenderedFrame;

                if (Math.abs(diff) < 0.05) {
                    currentRenderedFrame = targetFrame;
                } else {
                    currentRenderedFrame += diff * 0.18; // Increased from 0.04 to 0.18 for smooth responsive tracking
                }

                const frameIndex = Math.round(currentRenderedFrame);
                if (frameIndex !== lastDrawnFrameIndex) {
                    if (images[frameIndex] && images[frameIndex].complete && images[frameIndex].naturalWidth !== 0) {
                        renderImage(images[frameIndex]);
                        lastDrawnFrameIndex = frameIndex;
                    } else {
                        drawNearestLoaded(frameIndex);
                    }
                }
            }
            requestAnimationFrame(renderLoop);
        };

        requestAnimationFrame(renderLoop);
    }

    // Projects Page Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Add active class to corresponding content
                const tabId = btn.getAttribute('data-tab');
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Map Modal logic for Contact Page
    const viewMapBtns = document.querySelectorAll('.view-map');
    const mapModal = document.getElementById('map-modal');

    if (viewMapBtns.length > 0 && mapModal) {
        const closeBtn = mapModal.querySelector('.map-modal-close');
        const overlay = mapModal.querySelector('.map-modal-overlay');

        const openModal = (e) => {
            e.preventDefault();
            mapModal.classList.add('active');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            mapModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        viewMapBtns.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);

        // Close on Escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mapModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Toast Notification System
    function showToast(title, message) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast reveal fade-bottom active';
        toast.innerHTML = `
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => toast.remove());

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // FormSubmit Handlers for Contact and Index/Projects Pages
    const submitForms = document.querySelectorAll('form[target="hidden-iframe"]');
    if (submitForms.length > 0) {
        submitForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                // Let the native submit action happen to target the background hidden-iframe
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;

                // Change button state to sending
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'SENDING...';

                // Get name for personalized message if available
                let name = form.querySelector('input[name="Name"]')?.value || 'there';

                // After submission completes in the background iframe, restore UI, reset form, and display success toast
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    form.reset();

                    showToast(
                        "Profile Submitted",
                        `Thank you, ${name}. Your request has been sent! Check your inbox/spam for a quick verification from FormSubmit if this is the first submission.`
                    );
                }, 1800);
            });
        });
    }

    // Interactive Lightbox / Image Viewer System
    function initLightbox() {
        let lightbox = document.getElementById('global-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'global-lightbox';
            lightbox.className = 'lightbox-modal';
            lightbox.innerHTML = `
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-nav-btn lightbox-prev" aria-label="Previous">&larr;</button>
                <button class="lightbox-nav-btn lightbox-next" aria-label="Next">&rarr;</button>
                <div class="lightbox-content">
                    <div class="lightbox-image-wrapper">
                        <img class="lightbox-image" src="" alt="Lightbox View">
                    </div>
                    <div class="lightbox-caption">
                        <span class="lightbox-title"></span>
                        <span class="lightbox-counter"></span>
                    </div>
                </div>
            `;
            document.body.appendChild(lightbox);
        }

        const imgEl = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const titleEl = lightbox.querySelector('.lightbox-title');
        const counterEl = lightbox.querySelector('.lightbox-counter');

        let currentGallery = [];
        let currentIndex = 0;

        function updateLightbox(index) {
            if (index < 0 || index >= currentGallery.length) return;
            currentIndex = index;
            const targetItem = currentGallery[currentIndex];
            imgEl.src = targetItem.src;
            imgEl.alt = targetItem.alt || 'Gallery Image';
            imgEl.classList.remove('zoomed');

            if (titleEl) titleEl.textContent = targetItem.alt || '';
            if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

            prevBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        }

        function openLightbox(galleryImages, index) {
            currentGallery = galleryImages;
            updateLightbox(index);
            lightbox.classList.add('active');
            document.body.classList.add('modal-open');
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.classList.remove('modal-open');
            imgEl.classList.remove('zoomed');
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightbox(newIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentIndex + 1) % currentGallery.length;
            updateLightbox(newIndex);
        });

        // Click on image to toggle zoom
        imgEl.addEventListener('click', (e) => {
            e.stopPropagation();
            imgEl.classList.toggle('zoomed');
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                const newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
                updateLightbox(newIndex);
            }
            if (e.key === 'ArrowRight') {
                const newIndex = (currentIndex + 1) % currentGallery.length;
                updateLightbox(newIndex);
            }
        });

        // Delegate click events on all gallery images
        document.body.addEventListener('click', (e) => {
            const targetImg = e.target.closest('.gallery-grid img, .gallery-grid-5 img, .photo-frame img, .project-gallery img');
            if (!targetImg) return;

            // Find parent gallery container
            const galleryContainer = targetImg.closest('.gallery-grid, .gallery-grid-5, .project-gallery-col, .project-gallery');
            const imagesInGallery = Array.from((galleryContainer || document).querySelectorAll('img'));
            
            const galleryList = imagesInGallery.map(img => ({
                src: img.src,
                alt: img.alt || 'Project Image'
            }));

            const clickIndex = imagesInGallery.indexOf(targetImg);
            openLightbox(galleryList, clickIndex >= 0 ? clickIndex : 0);
        });
    }

    initLightbox();
});
