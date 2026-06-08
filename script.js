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
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Retrieve navLinks to check for mobile menu state
        const navLinks = document.querySelector('.nav-links');
        const isMobileMenuOpen = navLinks && navLinks.classList.contains('mobile-active');

        if (!isMobileMenuOpen) {
            navbar.classList.add('scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                navbar.classList.remove('scrolling');
            }, 250);
        } else {
            navbar.classList.remove('scrolling');
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

    // Scroll Image Sequence Animation
    const canvas = document.getElementById('scroll-canvas');
    const scrollSection = document.getElementById('scroll-sequence');

    if (canvas && scrollSection) {
        const context = canvas.getContext('2d', { alpha: false });
        
        // Use the scroll4 (300 frames) sequence for all viewport sizes (desktop and mobile)
        const frameCount = 300;
        const imgFolder = 'scroll4';
        
        let targetFrame = 0;
        let currentRenderedFrame = 0;
        
        // Enhance images by increasing contrast, saturation, and slightly sharpening
        context.filter = 'contrast(1.15) saturate(1.2) brightness(1.05)';

        const currentFrame = index => (
            `${imgFolder}/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
        );

        // Preload images into memory
        const images = [];
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // Setting canvas resolution based on container size
        let lastWidth = 0;
        let lastHeight = 0;

        const updateCanvasSize = () => {
            const container = canvas.parentElement;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            
            // On mobile, height changes due to address bar toggling on scroll.
            // We only resize if width changes or if there is a major height change (e.g. orientation change / address bar toggling > 50px).
            const widthChanged = Math.abs(rect.width - lastWidth) > 2;
            const heightChanged = Math.abs(rect.height - lastHeight) > 50;
            
            if (!widthChanged && !heightChanged && lastWidth > 0) {
                return;
            }
            
            lastWidth = rect.width;
            lastHeight = rect.height;
            
            const dpr = window.devicePixelRatio || 1;
            
            // Set internal backing store resolution
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            // Reapply filter after resize because context resets
            context.filter = 'contrast(1.15) saturate(1.2) brightness(1.05)';
            
            // Reset transform matrix before scaling to prevent cumulative scale bugs
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);
            
            // Draw current frame if available
            const currentFrameImg = images[Math.round(currentRenderedFrame)];
            if (currentFrameImg && currentFrameImg.complete && currentFrameImg.naturalWidth > 0) {
                renderImage(currentFrameImg);
            }
        };

        // Initialize size immediately
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Draw first frame when loaded (or immediately if already cached)
        if (images[0].complete) {
            updateCanvasSize();
        } else {
            images[0].onload = updateCanvasSize;
        }

        const renderImage = (imgElement) => {
            if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) return;
            
            // Calculate scale to cover canvas (like object-fit: cover)
            // Use CSS pixel dimensions for calculating scale
            const canvasCSSWidth = canvas.width / (window.devicePixelRatio || 1);
            const canvasCSSHeight = canvas.height / (window.devicePixelRatio || 1);
            
            // Always cover the viewport (object-fit: cover equivalent)
            const scale = Math.max(
                canvasCSSWidth / imgElement.width,
                canvasCSSHeight / imgElement.height
            );
            
            const x = (canvasCSSWidth / 2) - (imgElement.width / 2) * scale;
            const y = (canvasCSSHeight / 2) - (imgElement.height / 2) * scale;
            
            context.clearRect(0, 0, canvasCSSWidth, canvasCSSHeight);
            context.drawImage(imgElement, x, y, imgElement.width * scale, imgElement.height * scale);
        }
        window.addEventListener('scroll', () => {
            const rect = scrollSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;
            
            let scrollProgress = 0;
            
            // The section is sticky on all devices, so animate based on scroll distance past the top
            if (sectionTop <= 0) {
                const maxScroll = sectionHeight - viewportHeight;
                // Prevent divide by zero if maxScroll is 0
                scrollProgress = maxScroll > 0 ? Math.abs(sectionTop) / maxScroll : 0;
            }

            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            targetFrame = Math.floor(scrollProgress * (frameCount - 1));
        }, { passive: true });

        const renderLoop = () => {
            if (currentRenderedFrame !== targetFrame) {
                // Smooth interpolation between frames
                const diff = targetFrame - currentRenderedFrame;
                
                if (Math.abs(diff) < 0.5) {
                    currentRenderedFrame = targetFrame;
                } else {
                    currentRenderedFrame += diff * 0.15; // Smoothness factor
                }
                
                const frameIndex = Math.round(currentRenderedFrame);
                if (images[frameIndex]) {
                    renderImage(images[frameIndex]);
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
                    
                    // Reveal elements inside the active tab immediately
                    targetContent.querySelectorAll('.reveal').forEach(el => {
                        el.classList.add('active');
                    });
                }

                // Smoothly scroll page so the tabs stick under the navbar
                const subnavContainer = document.querySelector('.projects-subnav-container');
                if (subnavContainer) {
                    const isMobile = window.innerWidth <= 900;
                    const offset = isMobile ? 50 : 90; // Height of the scrolled navbar
                    
                    const elementRect = subnavContainer.getBoundingClientRect().top;
                    const absoluteElementTop = elementRect + window.scrollY;
                    const scrollToPosition = absoluteElementTop - offset;

                    window.scrollTo({
                        top: scrollToPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
