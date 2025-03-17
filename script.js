document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Set up mouse interaction
    initMouseInteraction();
    
    // Hero section animations
    initHeroAnimations();
    
    // Scroll-triggered animations
    initScrollAnimations();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize buttons & event listeners
    initEventListeners();
    
    // Initialize theme toggle
    initThemeToggle();
});

// Interactive particle system that responds to mouse movement
function initMouseInteraction() {
    const canvas = document.getElementById('mouse-interaction');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.baseX = x;
            this.baseY = y;
            this.density = Math.random() * 30 + 1;
            this.distance = 0;
            this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update(mouseX, mouseY) {
            // Check mouse position
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.distance = distance;
            
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = 100;
            const force = (maxDistance - distance) / maxDistance;
            
            // If within influence range
            if (distance < maxDistance) {
                this.x -= forceDirectionX * force * this.density;
                this.y -= forceDirectionY * force * this.density;
            } else {
                // Return to original position
                if (this.x !== this.baseX) {
                    const dx = this.baseX - this.x;
                    this.x += dx / 20;
                }
                if (this.y !== this.baseY) {
                    const dy = this.baseY - this.y;
                    this.y += dy / 20;
                }
            }
        }
    }
    
    // Initialize particles
    let particleArray = [];
    const particleCount = 100;
    
    const initParticles = () => {
        particleArray = [];
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particleArray.push(new Particle(x, y));
        }
    };
    
    initParticles();
    window.addEventListener('resize', initParticles);
    
    // Animation
    let mouseX = undefined;
    let mouseY = undefined;
    
    window.addEventListener('mousemove', (event) => {
        mouseX = event.x;
        mouseY = event.y;
    });
    
    // Touch support
    window.addEventListener('touchmove', (event) => {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouseX = undefined;
        mouseY = undefined;
    });
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set a gradient fill for particles
        // Get RGB values from CSS variables for better color control
        const primaryColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb').trim();
        const secondaryColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color-rgb').trim();
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(${primaryColorRGB}, 0.4)`);
        gradient.addColorStop(1, `rgba(${secondaryColorRGB}, 0.4)`);
        ctx.fillStyle = gradient;
        
        // Update and draw particles
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update(mouseX, mouseY);
            particleArray[i].draw();
        }
        
        // Connect particles with lines
        connectParticles();
        
        requestAnimationFrame(animate);
    };
    
    // Connect nearby particles with lines
    const connectParticles = () => {
        const maxDistance = 150;
        for (let i = 0; i < particleArray.length; i++) {
            for (let j = i; j < particleArray.length; j++) {
                const dx = particleArray[i].x - particleArray[j].x;
                const dy = particleArray[i].y - particleArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Set opacity based on distance
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particleArray[i].x, particleArray[i].y);
                    ctx.lineTo(particleArray[j].x, particleArray[j].y);
                    ctx.stroke();
                }
            }
        }
    };
    
    animate();
}

// Hero section animations
function initHeroAnimations() {
    gsap.to('.hero h1', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
    gsap.to('.hero h2', { opacity: 1, y: 0, duration: 0.8, delay: 0.4 });
    gsap.to('.hero p', { opacity: 1, y: 0, duration: 0.8, delay: 0.6 });
    gsap.to('.cta-btn', { opacity: 1, y: 0, duration: 0.8, delay: 0.8 });
    gsap.to('.scroll-down', { opacity: 1, duration: 0.8, delay: 1 });
    
    // Add typing animation to hero text (optional)
    const heroText = document.querySelector('.hero h1 .highlight');
    const originalText = heroText.textContent;
    heroText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroText.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Scroll-triggered animations
function initScrollAnimations() {
    // About section animation
    gsap.to('.about-content', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8
    });
    
    // Flowchart animations (Experience section)
    gsap.utils.toArray('.flow-item').forEach((item, i) => {
        gsap.set(item, {
            opacity: 0,
            x: item.classList.contains('flow-right') ? 100 : -100
        });
        
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.2,
            ease: "power2.out"
        });
    });
    
    // Animate the flowchart lines
    gsap.utils.toArray('.flowchart-line').forEach(line => {
        gsap.fromTo(line, 
            { height: 0 },
            {
                height: '100%',
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Animate the dots in the flowchart
    gsap.utils.toArray('.flow-dot').forEach((dot, i) => {
        gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                delay: 0.5 + (i * 0.2),
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: dot.closest('.flow-item'),
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Animate the connectors in the flowchart
    gsap.utils.toArray('.flow-connector').forEach((connector, i) => {
        const isRight = connector.closest('.flow-item').classList.contains('flow-right');
        
        gsap.fromTo(connector,
            { width: 0 },
            {
                width: '60px',
                duration: 0.5,
                delay: 0.7 + (i * 0.2),
                ease: "power1.out",
                scrollTrigger: {
                    trigger: connector.closest('.flow-item'),
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Project cards animations
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.2
        });
    });
    
    // Contact section animation
    gsap.to('.contact-container', {
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8
    });
}

// Mobile navigation
function initMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeIn 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        });
    });
}

// Initialize event listeners
function initEventListeners() {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // CTA button action
    document.querySelector('.cta-btn').addEventListener('click', () => {
        document.querySelector('#projects').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Form submission handler
    const contactForm = document.querySelector('.contact-form form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // You would typically send the form data to a server here
        // For now, we'll just show a success message
        const formData = new FormData(this);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        console.log('Form data:', formObject);
        
        // Reset form and show success message
        this.reset();
        alert('Thank you for your message! I will get back to you soon.');
    });
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}

// Animation for floating background shapes
const shapes = document.querySelectorAll('.floating-shape, .circle');
shapes.forEach(shape => {
    // Random starting position within bounds
    const randomX = Math.random() * 20 - 10;
    const randomY = Math.random() * 20 - 10;
    const randomRotate = Math.random() * 360;
    
    // Apply random starting position
    shape.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
});
