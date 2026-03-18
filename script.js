import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
    authDomain: "portfolio-auth-19a5e.firebaseapp.com",
    projectId: "portfolio-auth-19a5e",
    storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
    messagingSenderId: "211741915178",
    appId: "1:211741915178:web:b96f48f37ef2477b83ab53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// Open/Close Popup
btnPopup.onclick = () => { wrapper.classList.add('active-popup'); wrapper.classList.remove('active'); };
iconClose.onclick = () => wrapper.classList.remove('active-popup');

// Slide Switch Logic
registerLink.onclick = (e) => { e.preventDefault(); wrapper.classList.add('active'); };
loginLink.onclick = (e) => { e.preventDefault(); wrapper.classList.remove('active'); };

// Register Submit
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { username: name, email: email, uid: res.user.uid });
        
        Swal.fire({ icon: 'success', title: 'Registration Successful!', background: '#1e293b', color: '#fff', timer: 1500, showConfirmButton: false });
        
        // AUTO SWITCH TO LOGIN
        document.getElementById('registerForm').reset();
        setTimeout(() => { wrapper.classList.remove('active'); }, 1500);
    } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: 'Registration failed or user exists!', background: '#1e293b', color: '#fff' }); }
};

// Login Submit
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        Swal.fire({ icon: 'success', title: 'Welcome Back!', background: '#1e293b', color: '#fff', timer: 1500, showConfirmButton: false });
        setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
    } catch (err) { Swal.fire({ icon: 'error', title: 'Oops...', text: 'Wrong Email or Password!', background: '#1e293b', color: '#fff' }); }
};
