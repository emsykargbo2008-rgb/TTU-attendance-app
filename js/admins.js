// Admin Management Module

async function createAdmin(email, password, role = 'assistant_admin') {
    try {
        const db = getFirestore();
        const existing = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
        if (!existing.empty) {
            throw new Error('Email already exists');
        }

        const result = await addDoc(collection(db, 'users'), {
            email,
            role,
            createdAt: Date.now()
        });

        return { id: result.id, email, role, createdAt: Date.now() };
    } catch (error) {
        throw error;
    }
}

async function updateAdmin(adminId, data) {
    try {
        const userRef = window.db.collection('users').doc(adminId);
        await updateDoc(userRef, data);
        return { id: adminId, ...data };
    } catch (error) {
        throw error;
    }
}

async function deleteAdmin(adminId) {
    try {
        const db = getFirestore();
        const mainAdminsSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'main_admin')));
        const mainAdminCount = mainAdminsSnap.docs.length;
        const adminDoc = await window.db.collection('users').doc(adminId).get();

        if (adminDoc.exists && adminDoc.data().role === 'main_admin' && mainAdminCount === 1) {
            throw new Error('Cannot delete the last main admin');
        }

        await window.db.collection('users').doc(adminId).delete();
    } catch (error) {
        throw error;
    }
}

async function getAdmin(adminId) {
    try {
        const adminDoc = await window.db.collection('users').doc(adminId).get();
        return adminDoc.exists ? { id: adminDoc.id, ...adminDoc.data() } : null;
    } catch (error) {
        throw error;
    }
}

async function getAllAdmins() {
    try {
        const db = getFirestore();
        const snap = await getDocs(query(collection(db, 'users')));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw error;
    }
}

async function getAdminActivityLog(adminId) {
    return [];
}

async function changePassword(adminId, oldPassword, newPassword) {
    try {
        const currentUser = firebase.auth().currentUser;
        if (!currentUser || currentUser.uid !== adminId) {
            throw new Error('Unable to change password for this user. Please sign in as the correct admin first.');
        }

        await currentUser.updatePassword(newPassword);
    } catch (error) {
        throw error;
    }
}
