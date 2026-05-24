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
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    });

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
        const frameCount = 300;
        
        // Enhance images by increasing contrast, saturation, and slightly sharpening
        context.filter = 'contrast(1.15) saturate(1.2) brightness(1.05)';

        const currentFrame = index => (
            `scroll4/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
        );

        // Preload images into memory
        const images = [];
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // Draw first frame when loaded
        images[0].onload = function() {
            // Setting canvas resolution based on window size
            const updateCanvasSize = () => {
                // Use device pixel ratio for sharper images on retina screens
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                
                // Reapply filter after resize because context resets
                context.filter = 'contrast(1.15) saturate(1.2) brightness(1.05)';
                context.scale(dpr, dpr);
                
                renderImage(images[Math.round(currentRenderedFrame)]);
            };
            
            window.addEventListener('resize', updateCanvasSize);
            updateCanvasSize();
        }

        const renderImage = (imgElement) => {
            if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) return;
            
            // Calculate scale to cover canvas (like object-fit: cover)
            // Use CSS pixel dimensions for calculating scale
            const canvasCSSWidth = canvas.width / (window.devicePixelRatio || 1);
            const canvasCSSHeight = canvas.height / (window.devicePixelRatio || 1);
            
            const scale = Math.max(
                canvasCSSWidth / imgElement.width,
                canvasCSSHeight / imgElement.height
            );
            
            const x = (canvasCSSWidth / 2) - (imgElement.width / 2) * scale;
            const y = (canvasCSSHeight / 2) - (imgElement.height / 2) * scale;
            
            context.fillRect(0, 0, canvasCSSWidth, canvasCSSHeight);
            context.drawImage(imgElement, x, y, imgElement.width * scale, imgElement.height * scale);
        }

        let targetFrame = 0;
        let currentRenderedFrame = 0;

        window.addEventListener('scroll', () => {
            const rect = scrollSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;
            
            let scrollProgress = 0;
            if (sectionTop <= 0) {
                const maxScroll = sectionHeight - viewportHeight;
                scrollProgress = Math.abs(sectionTop) / maxScroll;
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
                }
            });
        });
    }
});
