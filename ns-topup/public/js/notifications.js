// Toast Notification System
class ToastManager {
    constructor() {
        this.container = this.createContainer();
        this.toasts = [];
    }
    
    createContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(message, type = 'info', title = '', duration = 5000) {
        const toast = this.createToast(message, type, title);
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            this.remove(toast);
        }, duration);
        
        return toast;
    }
    
    createToast(message, type, title) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const titles = {
            success: title || 'Berhasil!',
            error: title || 'Error!',
            warning: title || 'Peringatan!',
            info: title || 'Info'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="toastManager.remove(this.parentElement)">×</button>
        `;
        
        // Add click to dismiss
        toast.addEventListener('click', () => {
            this.remove(toast);
        });
        
        return toast;
    }
    
    remove(toast) {
        if (toast && toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
                this.toasts = this.toasts.filter(t => t !== toast);
            }, 300);
        }
    }
    
    success(message, title = '') {
        return this.show(message, 'success', title);
    }
    
    error(message, title = '') {
        return this.show(message, 'error', title);
    }
    
    warning(message, title = '') {
        return this.show(message, 'warning', title);
    }
    
    info(message, title = '') {
        return this.show(message, 'info', title);
    }
    
    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}

// Initialize toast manager
const toastManager = new ToastManager();

// Loading Manager
class LoadingManager {
    constructor() {
        this.overlay = null;
        this.isLoading = false;
    }
    
    show(message = 'Memuat...') {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.innerHTML = `
            <div class="modal" style="text-align: center; max-width: 300px;">
                <div class="loading-spinner large" style="margin: 0 auto 20px;"></div>
                <div style="font-size: 16px; font-weight: 600; color: #333;">${message}</div>
                <div style="font-size: 14px; color: #666; margin-top: 8px;">Mohon tunggu sebentar...</div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        document.body.style.overflow = 'hidden';
    }
    
    hide() {
        if (!this.isLoading || !this.overlay) return;
        
        this.isLoading = false;
        this.overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        setTimeout(() => {
            if (this.overlay && this.overlay.parentElement) {
                this.overlay.parentElement.removeChild(this.overlay);
            }
            document.body.style.overflow = '';
            this.overlay = null;
        }, 300);
    }
}

// Initialize loading manager
const loadingManager = new LoadingManager();

// Progress Bar Manager
class ProgressManager {
    constructor(element) {
        this.element = element;
        this.progress = 0;
    }
    
    setProgress(percent) {
        this.progress = Math.max(0, Math.min(100, percent));
        const fill = this.element.querySelector('.progress-fill');
        if (fill) {
            fill.style.width = `${this.progress}%`;
        }
    }
    
    increment(amount = 10) {
        this.setProgress(this.progress + amount);
    }
    
    complete() {
        this.setProgress(100);
        setTimeout(() => {
            this.reset();
        }, 1000);
    }
    
    reset() {
        this.setProgress(0);
    }
}

// Form Enhancement Functions
function enhanceForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    // Add loading state on submit
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Memproses...';
            submitBtn.disabled = true;
            
            // Re-enable after 10 seconds as fallback
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 10000);
        }
    });
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateInput(this);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let message = '';
    
    // Required validation
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        message = 'Field ini wajib diisi';
    }
    
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Format email tidak valid';
        }
    }
    
    // Password validation
    else if (input.name === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            message = 'Password minimal 8 karakter';
        }
    }
    
    // Phone validation
    else if (input.name === 'phone' && value) {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            message = 'Format nomor telepon tidak valid';
        }
    }
    
    // Update UI
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (feedback) feedback.style.display = 'none';
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (feedback) {
            feedback.textContent = `❌ ${message}`;
            feedback.style.display = 'block';
        }
    }
    
    return isValid;
}

// Auto-hide alerts
function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.animation = 'slideOutUp 0.3s ease-out forwards';
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.parentElement.removeChild(alert);
                }
            }, 300);
        }, 5000);
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide alerts
    autoHideAlerts();
    
    // Enhance forms
    enhanceForm('form');
    
    // Show welcome message for new users
    if (window.location.search.includes('registered=1')) {
        toastManager.success('Akun berhasil dibuat! Selamat datang di NS Games 🎮', 'Selamat Datang!');
    }
    
    // Show login success message
    if (window.location.search.includes('login=1')) {
        toastManager.success('Login berhasil! Selamat datang kembali 👋', 'Selamat Datang!');
    }
    
    // Handle AJAX errors globally
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        toastManager.error('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.', 'Error');
    });
});

// Export for global use
window.toast = toastManager;
window.loading = loadingManager;
window.ProgressManager = ProgressManager;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-20px);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .is-valid {
        border-color: #27ae60 !important;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1) !important;
    }
    
    .is-invalid {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
`;
document.head.appendChild(style);