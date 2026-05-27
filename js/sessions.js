// Session Management Module

async function saveSession(sessionId, data) {
    try {
        const db = getFirestore();
        if (sessionId) {
            const sessionRef = window.db.collection('sessions').doc(sessionId);
            await updateDoc(sessionRef, data);
            return { id: sessionId, ...data };
        } else {
            const result = await addDoc(collection(db, 'sessions'), {
                ...data,
                createdAt: Date.now()
            });
            return { id: result.id, ...data, createdAt: Date.now() };
        }
    } catch (error) {
        throw error;
    }
}

async function deleteSession(sessionId) {
    try {
        const db = getFirestore();
        const sessionRef = window.db.collection('sessions').doc(sessionId);
        await sessionRef.delete();

        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('sessionId', '==', sessionId)));
        const batch = window.db.batch();
        attendanceSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    } catch (error) {
        throw error;
    }
}

async function getSession(sessionId) {
    try {
        const sessionDoc = await window.db.collection('sessions').doc(sessionId).get();
        return sessionDoc.exists ? { id: sessionDoc.id, ...sessionDoc.data() } : null;
    } catch (error) {
        throw error;
    }
}

async function getAllSessions() {
    try {
        const db = getFirestore();
        const snap = await getDocs(query(collection(db, 'sessions'), orderBy('createdAt', 'desc')));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw error;
    }
}

async function loadSessions() {
    try {
        const sessions = await getAllSessions();
        const container = document.getElementById('sessionsContainer');

        if (sessions.length === 0) {
            container.innerHTML = '<p class="empty-state">No sessions created yet. Create a new session to get started.</p>';
        } else {
            container.innerHTML = sessions.map(session => {
                const sessionDate = new Date(session.dateTime).toLocaleString();
                return `
                    <div class="session-card">
                        <h3>${session.courseName}</h3>
                        <p><strong>Lecturer:</strong> ${session.lecturerName}</p>
                        <p><strong>Week:</strong> ${session.week}</p>
                        <p><strong>Date/Time:</strong> ${sessionDate}</p>
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            <button class="btn-small" onclick="editSession('${session.id}', '${session.courseName}', '${session.lecturerName}', '${session.week}', '${session.dateTime}')">Edit</button>
                            <button class="btn-small btn-danger" onclick="removeSession('${session.id}', '${session.courseName}')">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading sessions:', error);
        document.getElementById('sessionsContainer').innerHTML = '<p class="empty-state">Error loading sessions</p>';
    }
}

function editSession(sessionId, courseName, lecturerName, week, dateTime) {
    document.getElementById('modalTitle').textContent = 'Edit Session';
    document.getElementById('courseName').value = courseName;
    document.getElementById('lecturerName').value = lecturerName;
    document.getElementById('weekNumber').value = week;
    document.getElementById('sessionDate').value = dateTime;
    document.getElementById('sessionForm').dataset.sessionId = sessionId;
    document.getElementById('sessionModal').style.display = 'block';
}

async function removeSession(sessionId, sessionName) {
    if (confirm(`Are you sure you want to delete the session "${sessionName}"? This will also delete all attendance records for this session.`)) {
        try {
            await deleteSession(sessionId);
            showToast('Session deleted successfully', 'success');
            loadSessions();
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    }
}
