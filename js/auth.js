// Authentication Module

async function loginUser(email, password) {
    try {
        const credentials = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = credentials.user;
        const db = getFirestore();

        const usersSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
        let role = 'assistant_admin';
        if (!usersSnap.empty) {
            const userDoc = usersSnap.docs[0].data();
            role = userDoc.role || role;
        }

        const userData = {
            uid: user.uid,
            email: user.email,
            role
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        await firebase.auth().signOut();
        localStorage.removeItem('user');
    } catch (error) {
        throw error;
    }
}

async function registerUser(email, password, role = 'assistant_admin') {
    try {
        const authResult = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = authResult.user;
        const db = getFirestore();

        await addDoc(collection(db, 'users'), {
            uid: user.uid,
            email,
            role,
            createdAt: Date.now()
        });

        return { success: true, userId: user.uid };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return JSON.parse(user);
}

function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'main_admin' || user.role === 'assistant_admin';
}

function isMainAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'main_admin';
}
