const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    appId: "YOUR_FIREBASE_APP_ID"
};
firebase.initializeApp(firebaseConfig);

// Password show/hide toggle function
function togglePassword(fieldId, iconEl) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
        iconEl.classList.remove("fa-eye-slash");
        iconEl.classList.add("fa-eye");
    } else {
        field.type = "password";
        iconEl.classList.remove("fa-eye");
        iconEl.classList.add("fa-eye-slash");
    }
}

// Handle Login Form
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
        window.location.href = 'index.html';
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
}

// Handle Signup Form
async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPassword').value;
    const confirmPass = document.getElementById('signupConfirmPassword').value;

    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        // Update user profile name if needed
        await userCredential.user.updateProfile({ displayName: name });
        window.location.href = 'index.html';
    } catch (error) {
        alert("Signup Failed: " + error.message);
    }
}

// Social Logins (Google / GitHub)
function socialLogin(providerType) {
    let provider;
    if (providerType === 'google') {
        provider = new firebase.auth.GoogleAuthProvider();
    } else if (providerType === 'github') {
        provider = new firebase.auth.GithubAuthProvider();
    } else {
        alert("Apple login requires specific configuration.");
        return;
    }

    firebase.auth().signInWithPopup(provider)
        .then(() => { window.location.href = 'index.html'; })
        .catch((error) => { alert("Error: " + error.message); });
}

// Auth State Protection
firebase.auth().onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('signup.html');
    
    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
    } else if (user && isAuthPage) {
        window.location.href = 'index.html';
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    });
}
