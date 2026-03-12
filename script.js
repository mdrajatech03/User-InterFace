const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.register-link');
const registerLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// Switch to Register Form
loginLink.onclick = (e) => {
    e.preventDefault();
    wrapper.classList.add('active');
};

// Switch to Login Form
registerLink.onclick = (e) => {
    e.preventDefault();
    wrapper.classList.remove('active');
};

// Open Popup
btnPopup.onclick = () => {
    wrapper.classList.add('active-popup');
};

// Close Popup
iconClose.onclick = () => {
    wrapper.classList.remove('active-popup');
};

// Password Show/Hide Toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.onclick = function() {
        const inputId = this.getAttribute('data-target');
        const input = document.getElementById(inputId);
        
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'password';
            this.classList.replace('fa-eye', 'fa-eye-slash');
        }
    };
});

