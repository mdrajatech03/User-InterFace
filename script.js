// 1. Firebase Libraries Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
  authDomain: "portfolio-auth-19a5e.firebaseapp.com",
  projectId: "portfolio-auth-19a5e",
  storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
  messagingSenderId: "211741915178",
  appId: "1:211741915178:web:b96f48f37ef2477b83ab53",
  measurementId: "G-NXB4LBKFX2"
};

// Initialize Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. UI Selectors
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.register-link');
const registerLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// 4. Toast Notification Setup (SweetAlert2)
const showToast = (icon, title) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
    Toast.fire({ icon, title });
};

// 5. UI Toggle Logic (Isse Form khulega aur band hoga)
if (btnPopup) {
    btnPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
    });
}

if (iconClose) {
    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', () => {
        wrapper.classList.add('active');
    });
}

if (registerLink) {
    registerLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });
}

// 6. Registration Logic
const registerForm = document.querySelector('.form-box.register form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('regPass').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: new Date()
            });

            showToast('success', 'Account Created & Data Saved!');
            wrapper.classList.remove('active');
        } catch (error) {
            showToast('error', error.message);
        }
    });
}

// 7. Login Logic
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('logPass').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToast('success', 'Login Successful!');
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 1500);
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/invalid-credential') {
                    showToast('error', 'Galat Email ya Password!');
                } else {
                    showToast('error', 'Login Failed!');
                }
            });
    });
}

// 8. Password Show/Hide Toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.onclick = function() {
        const input = document.getElementById(this.getAttribute('data-target'));
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'password';
            this.classList.replace('fa-eye', 'fa-eye-slash');
        }
    };
});
