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
        }, 200);

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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

    // Apartment Video play/pause functionality
    const apartmentSection = document.getElementById('apartment-video-section');
    const apartmentDesktopVideo = document.getElementById('apartment-desktop-video');
    const apartmentMobileVideo = document.getElementById('apartment-mobile-video');
    const apartmentPlayIcon = document.getElementById('apartment-play-icon');
    const apartmentPauseIcon = document.getElementById('apartment-pause-icon');

    if (apartmentSection && apartmentDesktopVideo && apartmentMobileVideo) {
        apartmentSection.addEventListener('click', () => {
            // Determine which video is currently active (desktop or mobile)
            const isMobile = window.innerWidth <= 900;
            const activeVideo = isMobile ? apartmentMobileVideo : apartmentDesktopVideo;
            const inactiveVideo = isMobile ? apartmentDesktopVideo : apartmentMobileVideo;

            if (activeVideo.paused) {
                activeVideo.play();
                inactiveVideo.play(); // Keep them in sync just in case
                apartmentSection.classList.remove('paused');
                apartmentPlayIcon.style.display = 'none';
                apartmentPauseIcon.style.display = 'block';
            } else {
                activeVideo.pause();
                inactiveVideo.pause();
                apartmentSection.classList.add('paused');
                apartmentPlayIcon.style.display = 'block';
                apartmentPauseIcon.style.display = 'none';
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
                    folder: 'vid portrait',
                    totalFrames: 1830,
                    step: 1829 / 299,
                    frameCount: 300,
                    getFilename: (frameNum) => `vid portrait/video (${frameNum}).jpg`
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
            
            // Use cover equivalent (object-fit: cover) for both desktop and mobile to fill the screen
            const scale = Math.max(
                canvasCSSWidth / imgElement.width,
                canvasCSSHeight / imgElement.height
            );
            
            const x = (canvasCSSWidth / 2) - (imgElement.width / 2) * scale;
            const y = (canvasCSSHeight / 2) - (imgElement.height / 2) * scale;
            
            context.clearRect(0, 0, canvasCSSWidth, canvasCSSHeight);
            context.drawImage(imgElement, x, y, imgElement.width * scale, imgElement.height * scale);
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
                images[0].onload = function() {
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
            let closestDist = Infinity;
            let closestIndex = -1;
            for (let k = 0; k < images.length; k++) {
                if (images[k] && images[k].complete && images[k].naturalWidth !== 0) {
                    const dist = Math.abs(k - frameIndex);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIndex = k;
                    }
                }
            }
            if (closestIndex !== -1) {
                renderImage(images[closestIndex]);
                lastDrawnFrameIndex = closestIndex;
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
                // Smooth interpolation between frames
                const diff = targetFrame - currentRenderedFrame;
                
                if (Math.abs(diff) < 0.1) {
                    currentRenderedFrame = targetFrame;
                } else {
                    currentRenderedFrame += diff * 0.04; // Smoothness factor
                }
                
                const frameIndex = Math.round(currentRenderedFrame);
                if (frameIndex !== lastDrawnFrameIndex && images[frameIndex]) {
                    const img = images[frameIndex];
                    if (img.complete && img.naturalWidth !== 0) {
                        renderImage(img);
                        lastDrawnFrameIndex = frameIndex;
                    } else {
                        // Fallback to nearest loaded frame
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

    // Gmail Compose Form Handler — Contact Page Form
    const contactForm = document.querySelector('.contact-full-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('input[placeholder="Your Name"]')?.value || '';
            const email = contactForm.querySelector('input[placeholder="Email Address"]')?.value || '';
            const phone = contactForm.querySelector('input[placeholder="Phone Number"]')?.value || '';
            const projectType = contactForm.querySelector('select')?.value || '';
            const message = contactForm.querySelector('textarea')?.value || '';

            const subject = `New Project Inquiry from ${name} — ${projectType || 'General'}`;
            const body = `Hello Tugboat Interiors,\n\nI would like to inquire about a project.\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n` +
                `Project Type: ${projectType || 'Not specified'}\n\n` +
                `Project Details:\n${message}\n\n` +
                `Looking forward to hearing from you.\n\nBest regards,\n${name}`;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@tugboatinteriors.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailUrl, '_blank');
        });
    }

    // Gmail Compose Form Handler — Index Page Form
    const indexForm = document.querySelector('.minimal-form');
    if (indexForm) {
        indexForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = indexForm.querySelector('#name')?.value || '';
            const email = indexForm.querySelector('#email')?.value || '';
            const inquiry = indexForm.querySelector('#inquiry')?.value || '';
            const message = indexForm.querySelector('#message')?.value || '';

            const subject = `New Inquiry from ${name} — ${inquiry || 'General'}`;
            const body = `Hello Tugboat Interiors,\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Project Type: ${inquiry || 'Not specified'}\n\n` +
                `Message:\n${message}\n\n` +
                `Best regards,\n${name}`;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@tugboatinteriors.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailUrl, '_blank');
        });
    }
});
