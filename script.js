import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Firebase Configuration (Wahi purana)
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

// Toast Function
const showToast = (icon, title) => {
    Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, timerProgressBar: true
    }).fire({ icon, title });
};

// --- LOGIN LOGIC (FIXED) ---
// Yahan dhyan dein ki aapka login form selector sahi hai
const loginForm = document.querySelector('.form-box.login form');

if (loginForm) {
    console.log("Login form mil gaya!"); // Check karne ke liye
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('logPass').value;

        console.log("Login attempt for:", email);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showToast('success', 'Login Ho Gaya!');
                setTimeout(() => { 
                    window.location.href = "portfolio.html"; 
                }, 1500);
            })
            .catch((error) => {
                console.error("Login Error:", error.code);
                showToast('error', 'Galat Email ya Password!');
            });
    });
} else {
    console.error("Login form nahi mila! Check your HTML classes.");
}

// --- LOGOUT & AUTH STATE ---
onAuthStateChanged(auth, async (user) => {
    const isPortfolioPage = window.location.pathname.includes("portfolio.html");
    
    if (user && isPortfolioPage) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('welcomeMessage').innerText = `Welcome, ${data.username}!`;
            document.getElementById('userEmailDisplay').innerText = data.email;
            if (data.profilePic) document.getElementById('userDP').src = data.profilePic;
        }

        // Photo Update
        const btnUpdate = document.getElementById('btnUpdatePhoto');
        if(btnUpdate) {
            btnUpdate.onclick = async () => {
                const url = document.getElementById('photoURLInput').value;
                if (url) {
                    await updateDoc(userDocRef, { profilePic: url });
                    document.getElementById('userDP').src = url;
                    showToast('success', 'Photo Updated!');
                }
            };
        }
    } else if (!user && isPortfolioPage) {
        window.location.href = "index.html";
    }
});

// Logout
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.onclick = () => {
        signOut(auth).then(() => {
            window.location.href = "index.html";
        });
    };
}

