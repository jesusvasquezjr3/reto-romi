document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input');
    const submitBtn = document.querySelector('.btn-submit');
    
    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Función de validación
    function validateField(field) {
        const value = field.value.trim();
        
        // Remover clases previas
        field.classList.remove('valid', 'invalid');
        
        switch(field.type) {
            case 'text':
                if (value.length >= 2) {
                    field.classList.add('valid');
                } else if (value.length > 0) {
                    field.classList.add('invalid');
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    field.classList.add('valid');
                } else if (value.length > 0) {
                    field.classList.add('invalid');
                }
                break;
                
            case 'password':
                if (value.length >= 6) {
                    field.classList.add('valid');
                } else if (value.length > 0) {
                    field.classList.add('invalid');
                }
                break;
        }
    }
    
    // Prevenir envío si hay campos inválidos
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showMessage('Por favor, completa todos los campos', 'error');
        } else {
            // Animación de loading en el botón
            submitBtn.textContent = 'Registrando...';
            submitBtn.disabled = true;
        }
    });
    
    // Función para mostrar mensajes
    function showMessage(text, type) {
        // Remover mensajes existentes
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear nuevo mensaje
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insertar antes del formulario
        const formContainer = document.querySelector('.form-container');
        const h1 = formContainer.querySelector('h1');
        h1.insertAdjacentElement('afterend', message);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    // Auto-ocultar mensajes flash después de 5 segundos
    const flashMessages = document.querySelectorAll('.message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
});
