// Enhanced form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state to login button
    const loginForm = document.querySelector('form[action*="login"]');
    const loginButton = document.querySelector('.btn-login');
    
    if (loginForm && loginButton) {
        loginForm.addEventListener('submit', function() {
            loginButton.innerHTML = '🔄 Memproses...';
            loginButton.disabled = true;
            loginButton.style.opacity = '0.7';
        });
    }
    
    // Add floating label effect
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Add password visibility toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.innerHTML = '👁️';
        toggleButton.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        `;
        
        // Make parent relative
        input.parentElement.style.position = 'relative';
        input.style.paddingRight = '45px';
        
        toggleButton.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '🙈';
            } else {
                input.type = 'password';
                this.innerHTML = '👁️';
            }
        });
        
        toggleButton.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });
        
        toggleButton.addEventListener('mouseleave', function() {
            this.style.opacity = '0.6';
        });
        
        input.parentElement.appendChild(toggleButton);
    });
    
    // Add success/error message animations
    const alerts = document.querySelectorAll('.invalid-feedback');
    alerts.forEach(alert => {
        alert.style.animation = 'slideInUp 0.3s ease-out';
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .form-group.focused label {
        color: #667eea !important;
        transform: translateY(-2px);
    }
    
    .form-group {
        transition: all 0.3s ease;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);