document.addEventListener('DOMContentLoaded', () => {
    // Создаем элемент для уведомлений
    const notification = document.createElement('div');
    notification.className = 'notification';
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        fontSize: '16px',
        zIndex: '1000',
        display: 'none',
        maxWidth: '300px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'inherit'
    });
    document.body.appendChild(notification);

    // Функция показа уведомления
    function showNotification(message, isSuccess) {
        notification.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
        notification.style.color = 'white';
        notification.style.display = 'block';

        // Плавное появление
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => notification.style.opacity = '1', 10);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Phone number mask
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let phone = this.value.replace(/\D/g, '');
            if (phone.length > 0) {
                phone = '+' + phone;
                if (phone.length > 2) {
                    phone = phone.substring(0, 2) + ' (' + phone.substring(2);
                }
                if (phone.length > 7) {
                    phone = phone.substring(0, 7) + ') ' + phone.substring(7);
                }
                if (phone.length > 12) {
                    phone = phone.substring(0, 12) + '-' + phone.substring(12);
                }
                if (phone.length > 15) {
                    phone = phone.substring(0, 15) + '-' + phone.substring(15);
                }
            }
            this.value = phone;
        });
    }

    // Функция для открытия Telegram
    function openTelegram() {
        const username = 'Juciby';
        
        // Пробуем открыть в приложении Telegram
        window.location.href = `tg://resolve?domain=${username}`;
        
        // Через секунду пробуем открыть в браузере, если приложение не открылось
        setTimeout(() => {
            window.location.href = `https://t.me/${username}`;
        }, 1000);
    }

    // Обработка отправки формы
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                // Собираем данные формы
                const formData = new FormData(form);
                const name = formData.get('name');
                const telegram = formData.get('telegram');
                const email = formData.get('email');
                const message = formData.get('message');

                // Базовая валидация
                if (!name || name.trim() === '') {
                    showNotification('Пожалуйста, укажите ваше имя', false);
                    return;
                }

                if (!message || message.trim() === '') {
                    showNotification('Пожалуйста, напишите сообщение', false);
                    return;
                }

                if (!telegram && !email) {
                    showNotification('Укажите хотя бы один способ связи: Telegram или Email', false);
                    return;
                }

                // Блокируем кнопку и меняем текст
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';

                // Отправляем данные
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    showNotification('Спасибо! Ваша заявка успешно отправлена', true);
                    form.reset();
                    // Открываем Telegram через 1.5 секунды
                    setTimeout(openTelegram, 1500);
                } else {
                    throw new Error(result.message || 'Произошла ошибка при отправке формы');
                }
            } catch (error) {
                showNotification(error.message || 'Произошла ошибка при отправке формы', false);
            } finally {
                // Возвращаем кнопку в исходное состояние
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}); 