// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen after completion
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                
                // Initialize particles after loading
                initParticles();
                initAnimations();
            }, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 100);
    
    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Initialize scroll spy for navigation
    function initScrollSpy() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            // Handle home section
            if (scrollPosition < 100) {
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.nav-link[href="#home"]').classList.add('active');
            }
        });
    }
    
    // Initialize skill bars animation
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = `${width}%`;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    // Initialize contact form
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && message) {
                // In a real application, you would send this data to a server
                // For now, we'll just show an alert
                alert(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`);
                contactForm.reset();
                
                // Reset labels
                document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
                    field.dispatchEvent(new Event('change'));
                });
            } else {
                alert('Please fill in all fields before submitting.');
            }
        });
        
        // Handle form field focus/blur for label animation
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
            field.addEventListener('change', function() {
                if (this.value) {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            });
            
            // Trigger change event on load for prefilled values (if any)
            field.dispatchEvent(new Event('change'));
        });
    }
    
    // Initialize animations on scroll
    function initAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements to animate
        document.querySelectorAll('.stat-card, .skill-card, .timeline-content, .education-content').forEach(el => {
            observer.observe(el);
        });
        
        // Add animation class for fade-in effect
        const style = document.createElement('style');
        style.textContent = `
            .stat-card, .skill-card, .timeline-content, .education-content {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize particles background
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle system
        const particles = [];
        const particleCount = 80;
        const connectionDistance = 150;
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.7)' : 'rgba(255, 0, 255, 0.7)';
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Boundary check
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
                
                // Keep within bounds
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Draw connecting lines between particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animation loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            drawConnections();
            
            requestAnimationFrame(animateParticles);
        }
        
        // Start animation
        animateParticles();
    }
    
    // Initialize download resume button
    function initDownloadResume() {
        const downloadBtn = document.querySelector('.download-btn');
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Resume download would start here. In a real implementation, this would link to a PDF file.');
            // In a real scenario, you would link to an actual PDF:
            // window.open('path/to/resume.pdf', '_blank');
        });
    }
    
    // Initialize all functions
    initScrollSpy();
    initSkillBars();
    initContactForm();
    initDownloadResume();
    
    // Add active class to home nav link on initial load
    document.querySelector('.nav-link[href="#home"]').classList.add('active');
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add hover effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const x = e.pageX - this.offsetLeft;
            const y = e.pageY - this.offsetTop;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});