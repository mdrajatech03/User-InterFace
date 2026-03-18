import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// UI Selectors
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// Popup Controls
if(btnPopup) btnPopup.onclick = () => { wrapper.classList.add('active-popup'); wrapper.classList.remove('active'); };
if(iconClose) iconClose.onclick = () => wrapper.classList.remove('active-popup');
if(registerLink) registerLink.onclick = () => wrapper.classList.add('active');
if(loginLink) loginLink.onclick = () => wrapper.classList.remove('active');

const toast = (icon, title) => Swal.fire({ icon, title, background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });

// REGISTER LOGIC
const regForm = document.getElementById('registerForm');
if(regForm) {
    regForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), { username: name, email, uid: res.user.uid, profilePic: "" });
            toast('success', 'Account Created! Now Login.');
            
            // FIX: Force switch to Login Box
            setTimeout(() => { wrapper.classList.remove('active'); }, 500);
            regForm.reset();
        } catch (err) { toast('error', 'Error: ' + err.message); }
    };
}

// LOGIN LOGIC
const logForm = document.getElementById('loginForm');
if(logForm) {
    logForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, document.getElementById('logEmail').value, document.getElementById('logPass').value);
            toast('success', 'Welcome Back!');
            setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
        } catch (err) { toast('error', 'Invalid Credentials!'); }
    };
}

// PORTFOLIO DATA FETCH
onAuthStateChanged(auth, async (user) => {
    if (user && window.location.pathname.includes("portfolio.html")) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('userName').innerText = data.username;
            document.getElementById('userEmail').innerText = data.email;
            if(data.profilePic) document.getElementById('userDP').src = data.profilePic;
        }
    } else if (!user && window.location.pathname.includes("portfolio.html")) {
        window.location.href = "index.html";
    }
});

// LOGOUT
const logoutBtn = document.getElementById('btnLogout');
if(logoutBtn) logoutBtn.onclick = () => signOut(auth).then(() => window.location.href = "index.html");
