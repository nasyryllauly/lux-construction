// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !phone) {
        alert('Пожалуйста, заполните обязательные поля (имя и телефон)');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    // Email validation (if provided)
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Пожалуйста, введите корректный email адрес');
            return;
        }
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Отправляется...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert('Спасибо за заявку! Мы свяжемся с вами в течение 24 часов.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Animate stats on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                if (numericValue) {
                    animateNumber(target, 0, numericValue, finalValue);
                }
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, suffix) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + suffix.replace(/\d/g, '').replace(current.toString(), '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = suffix;
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateStats();
    
    // Add loading animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add click handlers for social links
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Add analytics tracking here if needed
        console.log('Social link clicked:', this.href);
    });
});

// Highlight unique license banner
function highlightUniqueFeature() {
    const banner = document.querySelector('.unique-banner');
    const specialCards = document.querySelectorAll('.service-card.special, .license-card.special');
    
    // Add pulse effect to special elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'pulse 2s ease-in-out 3';
            }
        });
    });
    
    specialCards.forEach(card => observer.observe(card));
}

// Initialize special effects
document.addEventListener('DOMContentLoaded', highlightUniqueFeature);

// Add smooth reveal animation for sections
function addSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
}

// Add CSS for section animations
const style = document.createElement('style');
style.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .section-hidden,
        .section-visible {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;
document.head.appendChild(style);

// Initialize section animations
document.addEventListener('DOMContentLoaded', addSectionAnimations);


// Modal functionality
function openConsultationModal() {
    document.getElementById('consultationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeConsultationModal() {
    document.getElementById('consultationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('consultationModal');
    if (event.target === modal) {
        closeConsultationModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeConsultationModal();
    }
});

// Form submission
document.getElementById('consultationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Here you would typically send the data to your server
    // For now, we'll just show a success message
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    
    // Reset form and close modal
    this.reset();
    closeConsultationModal();
});

// Floating widgets animation on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const widgets = document.querySelector('.floating-widgets');
    
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        widgets.style.transform = 'translateY(-50%) translateX(10px)';
    } else {
        // Scrolling up
        widgets.style.transform = 'translateY(-50%) translateX(0)';
    }
    
    lastScrollTop = scrollTop;
});

// WhatsApp and Telegram click tracking
document.querySelector('.whatsapp-btn').addEventListener('click', function() {
    // Track WhatsApp click (you can add analytics here)
    console.log('WhatsApp clicked');
});

document.querySelector('.telegram-btn').addEventListener('click', function() {
    // Track Telegram click (you can add analytics here)
    console.log('Telegram clicked');
});

// Phone number formatting
document.querySelector('input[name="phone"]').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('7')) {
        value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
    } else if (value.startsWith('8')) {
        value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
    }
    e.target.value = value;
});

