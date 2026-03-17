import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const defaultIcon = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const showToast = (icon, title) => {
    Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, timerProgressBar: true
    }).fire({ icon, title });
};

// Authentication & Profile Sync
onAuthStateChanged(auth, async (user) => {
    const isPortfolio = window.location.pathname.includes("portfolio.html");
    const imgElement = document.getElementById('userDP');

    if (user) {
        if (isPortfolio) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                document.getElementById('welcomeMessage').innerText = `Welcome, ${data.username}!`;
                document.getElementById('userEmailDisplay').innerText = data.email;
                
                // Set Image with Fallback
                imgElement.src = data.profilePic || defaultIcon;
                imgElement.onerror = () => { imgElement.src = defaultIcon; };
            }

            // --- Update Photo Logic ---
            document.getElementById('btnUpdatePhoto').onclick = async () => {
                const newUrl = document.getElementById('photoURLInput').value.trim();
                if (newUrl) {
                    try {
                        await updateDoc(userDocRef, { profilePic: newUrl });
                        imgElement.src = newUrl;
                        showToast('success', 'Profile Updated!');
                        document.getElementById('photoURLInput').value = ""; // Clear input
                    } catch (e) {
                        showToast('error', 'Update Failed!');
                    }
                } else {
                    showToast('warning', 'Please paste a link first!');
                }
            };
        }
    } else if (isPortfolio) {
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
