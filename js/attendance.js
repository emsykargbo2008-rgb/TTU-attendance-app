// Attendance Module

async function saveAttendance(studentId, sessionId, status) {
    try {
        const db = getFirestore();
        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('studentId', '==', studentId), where('sessionId', '==', sessionId)));
        const studentDoc = await window.db.collection('students').doc(studentId).get();
        const student = studentDoc.exists ? { id: studentDoc.id, ...studentDoc.data() } : null;

        if (!student) {
            throw new Error('Student not found');
        }

        if (!attendanceSnap.empty) {
            const attendanceRef = attendanceSnap.docs[0].ref;
            await updateDoc(attendanceRef, { status, timestamp: Date.now() });
        } else {
            await addDoc(collection(db, 'attendance'), {
                studentId,
                sessionId,
                name: student.name,
                indexNumber: student.indexNumber,
                status,
                timestamp: Date.now()
            });
        }
    } catch (error) {
        throw error;
    }
}

async function getSessionAttendance(sessionId) {
    try {
        const db = getFirestore();
        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('sessionId', '==', sessionId)));
        return attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw error;
    }
}

async function getStudentAttendance(studentId) {
    try {
        const db = getFirestore();
        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('studentId', '==', studentId)));
        return attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw error;
    }
}

async function getAttendanceStats(sessionId) {
    try {
        const attendance = await getSessionAttendance(sessionId);
        const present = attendance.filter(a => a.status === 'present').length;
        const absent = attendance.filter(a => a.status === 'absent').length;

        return {
            present,
            absent,
            total: present + absent,
            percentage: attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0
        };
    } catch (error) {
        throw error;
    }
}

async function bulkMarkAttendance(sessionId, attendanceMap) {
    try {
        const db = getFirestore();
        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('sessionId', '==', sessionId)));
        const batch = window.db.batch();

        attendanceSnap.forEach(doc => batch.delete(doc.ref));

        const studentsSnap = await getDocs(query(collection(db, 'students')));
        const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        students.forEach(student => {
            const status = attendanceMap.get ? attendanceMap.get(student.id) : attendanceMap[student.id];
            if (status) {
                const recordRef = window.db.collection('attendance').doc();
                batch.set(recordRef, {
                    studentId: student.id,
                    sessionId,
                    name: student.name,
                    indexNumber: student.indexNumber,
                    status,
                    timestamp: Date.now()
                });
            }
        });

        await batch.commit();
    } catch (error) {
        throw error;
    }
}
