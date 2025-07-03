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

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Закрытие меню при клике на пункт
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header && window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else if (header) {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Modal functionality
function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
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

// Form submission with direct Telegram API
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultationForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Показываем загрузку
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;
            
            // Собираем данные формы
            const formData = {
                name: form.querySelector('input[name="name"]').value.trim(),
                phone: form.querySelector('input[name="phone"]').value.trim(),
                email: form.querySelector('input[name="email"]').value.trim(),
                message: form.querySelector('textarea[name="message"]').value.trim()
            };
            
            // Валидация
            if (!formData.name || !formData.phone) {
                alert('Пожалуйста, заполните имя и телефон');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Конфигурация Telegram
            const BOT_TOKEN = '7663496694:AAGgiCtObnpNgwQ_nU_26EsCQJ_7arJ2fkU';
            const CHAT_ID = '@luxconstructionleads';
            
            // Формируем сообщение
            const telegramMessage = `🏗️ Новая заявка с сайта LUX Construction

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}${formData.email ? `\n📧 Email: ${formData.email}` : ''}${formData.message ? `\n💬 Сообщение: ${formData.message}` : ''}

⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
🌐 Источник: luxconstruction.kz`;

            // Пробуем отправить через fetch с mode: 'no-cors'
            try {
                const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
                
                fetch(telegramUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: telegramMessage
                    })
                });
                
                // Показываем успех независимо от результата (no-cors не возвращает ответ)
                setTimeout(() => {
                    closeConsultationModal();
                    openSuccessModal();
                    form.reset();
                }, 500);
                
            } catch (error) {
                console.error('Telegram send error:', error);
                // Все равно показываем успех
                closeConsultationModal();
                openSuccessModal();
                form.reset();
            }
            
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
});



// Success Modal Functions
function openSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close success modal when clicking outside
window.addEventListener('click', function(event) {
    const successModal = document.getElementById('successModal');
    if (event.target === successModal) {
        closeSuccessModal();
    }
});

