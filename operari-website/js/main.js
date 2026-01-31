// --- Configuration ---
const CONFIG = {
    colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        bg: '#050507'
    }
};

// --- DOM Elements ---
const $ = (selector) => document.querySelector(selector);

// --- State Management (Optional but good practice) ---
const State = {
    isScrolling: false,
    mouseX: 0,
    mouseY: 0,
    isHoveringCard: false,
    currentScroll: 0
};

// --- Utilities ---
const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

// --- Core Application ---
const App = {
    init() {
        this.cacheDOM();
        this.initHeroCanvas();
        this.initMagneticButtons();
        this.initScrollObserver();
        this.initTiltCards();
        this.initFormHandler();
        
        // Trigger animations
        this.animateHero();
    },

    cacheDOM() {
        this.dom = {
            header: $('#header'),
            heroContent: $('.hero-content'),
            toast: $('#toast'),
            form: $('#contactForm'),
            forms: $('.form-control'),
            cards: $('.card')
        };
    },

    initHeroCanvas() {
        const canvas = $('#hero-canvas')[0];
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let particlesArray;
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            
            update() {
                if (this.x > canvasWidth || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvasHeight || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particlesArray = [];
            let numberOfParticles = (canvasHeight * canvasWidth) / 9000;
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#3b82f6'; // Use CONFIG.colors.primary
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvasWidth/7) * (canvasHeight/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particlesArray.forEach(p => p.update());
            connect();
        };

        // Resize listener
        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        init();
        animate();
    },

    initMagneticButtons() {
        const btns = document.querySelectorAll('.magnetic-btn');
        
        btns.forEach(btn => {
            btn.addEventListener('mousemove', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = e.pageX - rect.left - rect.width / 2;
                const y = e.pageY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', function() {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    },

    initTiltCards() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                // Debounce for performance
                const handleMove = (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left; 
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
                    const rotateY = ((x - centerX) / centerX) * 10;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                };

                card.addEventListener('mousemove', debounce(handleMove));
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            });
        });
    },

    initScrollObserver() {
        const elements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if(entry.target.classList.contains('hero-content')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));

        // Initial trigger for hero content
        const heroContent = $('.hero-content');
        setTimeout(() => {
            heroContent.css({ opacity: 1, transform: 'translateY(0)' });
        }, 100);

        // Header Scroll Effect
        window.addEventListener('scroll', () => {
            const header = this.dom.header;
            if (window.scrollY > 50) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }
        });

        // Smooth Scroll Links
        document.querySelectorAll('[data-scroll-to]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-scroll-to');
                if (targetId) {
                    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                e.preventDefault(); // Prevent jump if inside a list
                // Logic to update active state on scroll could be added here
            });
        });
    },

    initFormHandler() {
        const form = this.dom.form;
        const toast = this.dom.toast;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show Toast
            toast[0].className = "show";
            
            // Reset Form
            this.dom.forms.val('');

            // Hide Toast after 3 seconds
            setTimeout(function(){ 
                toast.removeClass("show"); 
            }, 3000);
        });
    }
};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
