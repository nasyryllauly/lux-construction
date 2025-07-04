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

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Modal functionality
function openConsultationModal() {
    document.getElementById('consultationModal').style.display = 'block';
}

function closeConsultationModal() {
    document.getElementById('consultationModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('consultationModal');
    if (event.target === modal) {
        closeConsultationModal();
    }
});

// Form submission with Netlify Function
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для модальной формы
    const modalForm = document.getElementById('consultationForm');
    
    if (modalForm) {
        modalForm.addEventListener('submit', async function(e) {
            await handleFormSubmission(e, modalForm, true); // true означает модальная форма
        });
    }
    
    // Обработчик для основной формы на странице
    const mainForm = document.getElementById('mainContactForm');
    
    if (mainForm) {
        mainForm.addEventListener('submit', async function(e) {
            await handleFormSubmission(e, mainForm, false); // false означает основная форма
        });
    }
});

// Универсальная функция обработки отправки формы
async function handleFormSubmission(e, form, isModal) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(form);
    const name = formData.get('name')?.trim() || form.querySelector('input[placeholder*="имя"], input[placeholder*="Имя"]')?.value?.trim();
    const phone = formData.get('phone')?.trim() || form.querySelector('input[placeholder*="телефон"], input[placeholder*="Телефон"]')?.value?.trim();
    const email = formData.get('email')?.trim() || form.querySelector('input[placeholder*="email"], input[placeholder*="Email"]')?.value?.trim();
    const message = formData.get('message')?.trim() || form.querySelector('textarea')?.value?.trim();
    
    // Валидация
    if (!name || !phone) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Получаем кнопку отправки
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    const originalText = submitBtn.textContent;
    
    // Показываем состояние загрузки
    submitBtn.textContent = 'ОТПРАВЛЯЕМ...';
    submitBtn.disabled = true;
    
    // Добавляем таймаут для предотвращения зависания
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
    
    try {
        // Основной endpoint
        let response;
        let lastError;
        
        try {
            // Отправляем данные на постоянный Flask endpoint
            response = await fetch('https://5000-iswsnh2lveij3xt9596sd-620ec329.manusvm.computer/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email || '',
                    message: message || ''
                }),
                signal: controller.signal
            });
        } catch (primaryError) {
            console.warn('Primary endpoint failed, trying backup...', primaryError);
            lastError = primaryError;
            
            // Резервный endpoint (развернутый сайт)
            try {
                response = await fetch('https://wdtlctzl.manus.space/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email || '',
                        message: message || ''
                    }),
                    signal: controller.signal
                });
            } catch (backupError) {
                console.error('Both endpoints failed');
                throw lastError; // Бросаем первоначальную ошибку
            }
        }
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Показываем модальное окно успеха
            openSuccessModal();
            
            // Очищаем форму
            form.reset();
            
            // Если это модальная форма, закрываем её
            if (isModal) {
                closeConsultationModal();
            }
        } else {
            throw new Error(result.message || 'Неизвестная ошибка');
        }
        
    } catch (error) {
        console.error('Error sending form:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'AbortError') {
            showNotification('Превышено время ожидания. Попробуйте еще раз.', 'error');
        } else if (error.message.includes('Failed to fetch')) {
            showNotification('Проблема с подключением к серверу. Проверьте интернет-соединение.', 'error');
        } else if (error.message.includes('HTTP error')) {
            showNotification('Ошибка сервера. Попробуйте еще раз через несколько минут.', 'error');
        } else {
            showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
        }
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        clearTimeout(timeoutId);
    }
}

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

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#2ed573'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Добавляем CSS анимацию
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}


// Алиас для совместимости
function showSuccessModal() {
    openSuccessModal();
}

// Дополнительная проверка загрузки
console.log('LUX Construction script loaded successfully');
console.log('Available functions:', {
    openConsultationModal: typeof openConsultationModal,
    closeConsultationModal: typeof closeConsultationModal,
    openSuccessModal: typeof openSuccessModal,
    closeSuccessModal: typeof closeSuccessModal,
    showSuccessModal: typeof showSuccessModal,
    handleFormSubmission: typeof handleFormSubmission
});

