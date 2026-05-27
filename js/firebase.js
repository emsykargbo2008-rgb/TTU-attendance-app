// Firebase Configuration
// Replace with your actual Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDO31l65zhCfpPMOVuOQ9qcDPFjHZd6p94",
    authDomain: "attendance-system-11184.firebaseapp.com",
    databaseURL: "https://attendance-system-11184-default-rtdb.firebaseio.com",
    projectId: "attendance-system-11184",
    storageBucket: "attendance-system-11184.firebasestorage.app",
    messagingSenderId: "581378423856",
    appId: "1:581378423856:web:89e9176eefd791f73881f5"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth();
window.db = firebase.firestore();
window.db.settings({ ignoreUndefinedProperties: true });

function getFirestore() {
    return window.db;
}

function getAuth() {
    return window.auth;
}

function collection(db, name) {
    return { collectionName: name };
}

function query(col, ...conditions) {
    return {
        collectionName: col.collectionName,
        conditions
    };
}

function where(field, operator, value) {
    return {
        type: 'where',
        field,
        operator,
        value
    };
}

function orderBy(field, direction = 'asc') {
    return {
        type: 'orderBy',
        field,
        direction
    };
}

function limit(value) {
    return {
        type: 'limit',
        value
    };
}

async function getDocs(queryObj) {
    const collRef = window.db.collection(queryObj.collectionName);
    let firestoreQuery = collRef;

    if (queryObj.conditions) {
        queryObj.conditions.forEach(condition => {
            if (condition.type === 'where') {
                firestoreQuery = firestoreQuery.where(condition.field, condition.operator, condition.value);
            }
            if (condition.type === 'orderBy') {
                firestoreQuery = firestoreQuery.orderBy(condition.field, condition.direction || 'asc');
            }
            if (condition.type === 'limit') {
                firestoreQuery = firestoreQuery.limit(condition.value);
            }
        });
    }

    return firestoreQuery.get();
}

async function addDoc(collectionObj, data) {
    return window.db.collection(collectionObj.collectionName).add(data);
}

async function updateDoc(ref, data) {
    if (ref && typeof ref.update === 'function') {
        return ref.update(data);
    }

    if (ref && ref._key) {
        const [collectionName, id] = ref._key.path.segments;
        return window.db.collection(collectionName).doc(id).update(data);
    }

    if (ref && ref.path) {
        return window.db.doc(ref.path).update(data);
    }

    throw new Error('Invalid document reference');
}

async function deleteDoc(ref) {
    if (ref && typeof ref.delete === 'function') {
        return ref.delete();
    }

    if (ref && ref._key) {
        const [collectionName, id] = ref._key.path.segments;
        return window.db.collection(collectionName).doc(id).delete();
    }

    if (ref && ref.path) {
        return window.db.doc(ref.path).delete();
    }

    throw new Error('Invalid document reference');
}
