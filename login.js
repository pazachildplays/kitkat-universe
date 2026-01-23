// Password for admin panel
const ADMIN_PASSWORD = 'kitkat09';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Focus on password input
    passwordInput.focus();

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const enteredPassword = passwordInput.value;
        
        // Verify password
        if (enteredPassword === ADMIN_PASSWORD) {
            // Set authentication in session storage (for current browser session)
            sessionStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminAuthTime', Date.now().toString());
            
            // Show success feedback
            errorMessage.classList.remove('show');
            loginForm.style.opacity = '0.5';
            loginForm.style.pointerEvents = 'none';
            
            // Redirect to admin panel
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 500);
        } else {
            // Show error
            errorMessage.textContent = '❌ Incorrect password. Please try again.';
            errorMessage.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();
            
            // Add shake animation to input
            passwordInput.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 300);
        }
    });

    // Clear error on input
    passwordInput.addEventListener('input', () => {
        if (errorMessage.classList.contains('show')) {
            errorMessage.classList.remove('show');
        }
    });
});

// Animation for error shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);
