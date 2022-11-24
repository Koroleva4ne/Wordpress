$(document).ready(function() {
    $('input[name=phone]').mask("+7(999) 999-99-99");
});

window.addEventListener('DOMContentLoaded', () => {
    // Modal
    function closeModal(modalSelector) {
        const modal = document.querySelector(modalSelector);
    
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }
    
    function openModal(modalSelector) {
        const modal = document.querySelector(modalSelector);
    
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    function modal(triggerSelector, modalSelector) {
        const modalOpenBtns = document.querySelectorAll(triggerSelector),
              modal = document.querySelector(modalSelector);
    
        modalOpenBtns.forEach(btn => {
            btn.addEventListener('click', () => openModal(modalSelector));
        });
    
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                closeModal(modalSelector);
            }
        });
    }
    modal('.button', '.modal');

    // Form
    
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
        });
    
        return await res.json();
    };

    function forms(formSelector) {
        const forms = document.querySelectorAll(formSelector); 
    
        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        }; /* сообщение для пользователя */
    
        forms.forEach(item => {
            bindPostData(item);
        }); /* подвязываем к каждой из форм функцию, кот будет обработчиком событий при отправке */
    
        function bindPostData(form) { /* Функция отвечает за постинг данных */
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);
    
                const formData = new FormData(form);
                
                const json = JSON.stringify(Object.fromEntries(formData.entries()));
    
                postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
            });
        }
    
        function showThanksModal(message) {
            const prevModalDialog = document.querySelector('.modal__dialog');
    
            prevModalDialog.classList.add('hide'); /* скрываем предыдущее окно */
            openModal('.modal');
            
            const thanksModal = document.createElement('div'); /* создаем новое модал окно */
            thanksModal.classList.add('modal__dialog'); /* добавляем ему класс */
            thanksModal.innerHTML = `
                <div class="modal__content">
                    <div data-close class="modal__close">&times;</div>
                    <div class="modal__title">${message}</div>
                </div>
            `; /* прописываем внутренную структуру */
            document.querySelector('.modal').append(thanksModal); /* добавляем элемент в документ */
            setTimeout(() => {
                thanksModal.remove(); /* убирает новое модал окно */
                prevModalDialog.classList.remove('hide'); /* удвляет класс hide */
                closeModal('.modal'); /* закрывает модал окно */
            }, 4000); /* возвращает обратно форму */
        }
    }
    forms('form');
});