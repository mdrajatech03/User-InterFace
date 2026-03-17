import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
  authDomain: "portfolio-auth-19a5e.firebaseapp.com",
  projectId: "portfolio-auth-19a5e",
  storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
  messagingSenderId: "211741915178",
  appId: "1:211741915178:web:b96f48f37ef2477b83ab53",
  measurementId: "G-NXB4LBKFX2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Toast Function
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

// UI Elements
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.register-link');
const registerLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

if (btnPopup) btnPopup.onclick = () => wrapper.classList.add('active-popup');
if (iconClose) iconClose.onclick = () => wrapper.classList.remove('active-popup');
if (loginLink) loginLink.onclick = () => wrapper.classList.add('active');
if (registerLink) registerLink.onclick = () => wrapper.classList.remove('active');

// --- Registration ---
const registerForm = document.querySelector('.form-box.register form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('regPass').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                username, email, createdAt: new Date()
            });
            showToast('success', 'Account Created!');
            wrapper.classList.remove('active');
        } catch (error) { showToast('error', error.message); }
    });
}

// --- Login (Redirects to portfolio.html) ---
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('logPass').value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToast('success', 'Login Successful!');
                setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-credential') showToast('error', 'Galat Email ya Password!');
                else showToast('error', 'Login Failed!');
            });
    });
}

// --- Logout Logic Fix ---
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.onclick = () => {
        signOut(auth).then(() => {
            showToast('info', 'Logged Out!');
            setTimeout(() => {
                // Agar aapka login page 'index.html' hai, toh yahan wahi likhein
                // GitHub Pages par case-sensitive hota hai, isliye dhyan dein
                window.location.href = "index.html"; 
            }, 1500);
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    };
}


// --- Security Check (Route Protection) ---
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    if (!user && path.includes("portfolio.html")) {
        window.location.href = "login.html";
    }
});
