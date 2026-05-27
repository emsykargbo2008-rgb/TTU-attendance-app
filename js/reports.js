// Reports Module

async function getStudentAttendanceReport(studentId) {
    try {
        const db = getFirestore();
        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('studentId', '==', studentId)));
        const studentDoc = await window.db.collection('students').doc(studentId).get();
        const sessionsSnap = await getDocs(query(collection(db, 'sessions')));

        const attendance = attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const student = studentDoc.exists ? { id: studentDoc.id, ...studentDoc.data() } : null;
        const sessions = sessionsSnap.docs.length;
        const attended = attendance.filter(a => a.status === 'present').length;
        const percentage = sessions > 0 ? Math.round((attended / sessions) * 100) : 0;

        return {
            student,
            attended,
            total: sessions,
            percentage,
            attendance
        };
    } catch (error) {
        throw error;
    }
}

async function getClassAttendanceReport(sessionId) {
    try {
        const db = getFirestore();
        const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('sessionId', '==', sessionId)));
        const attendance = attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const present = attendance.filter(a => a.status === 'present').length;
        const absent = attendance.filter(a => a.status === 'absent').length;

        return {
            present,
            absent,
            total: present + absent,
            percentage: attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0,
            attendance: attendance.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        };
    } catch (error) {
        throw error;
    }
}

async function getAbsentStudents(minAbsences = 5) {
    try {
        const db = getFirestore();
        const studentsSnap = await getDocs(query(collection(db, 'students')));
        const attendanceSnap = await getDocs(query(collection(db, 'attendance')));
        const sessionsSnap = await getDocs(query(collection(db, 'sessions')));

        const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const attendance = attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sessionsCount = sessionsSnap.docs.length;

        const studentStats = students.map(student => {
            const studentAttendance = attendance.filter(a => a.studentId === student.id);
            const present = studentAttendance.filter(a => a.status === 'present').length;
            const absent = sessionsCount - present;

            return {
                student,
                present,
                absent,
                percentage: sessionsCount > 0 ? Math.round((present / sessionsCount) * 100) : 0
            };
        });

        return studentStats
            .filter(s => s.absent >= minAbsences)
            .sort((a, b) => b.absent - a.absent);
    } catch (error) {
        throw error;
    }
}

async function getAttendanceTrend() {
    try {
        const db = getFirestore();
        const sessionsSnap = await getDocs(query(collection(db, 'sessions'), orderBy('createdAt', 'asc')));
        const sessions = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const trend = [];
        for (const session of sessions) {
            const attendanceSnap = await getDocs(query(collection(db, 'attendance'), where('sessionId', '==', session.id)));
            const attendance = attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const present = attendance.filter(a => a.status === 'present').length;
            const total = attendance.length;

            trend.push({
                session: session.courseName,
                week: session.week,
                present,
                absent: total - present,
                percentage: total > 0 ? Math.round((present / total) * 100) : 0
            });
        }

        return trend;
    } catch (error) {
        throw error;
    }
}

async function generateFullReport(filters = {}) {
    try {
        const db = getFirestore();
        const studentsSnap = await getDocs(query(collection(db, 'students')));
        const sessionsSnap = await getDocs(query(collection(db, 'sessions')));
        const attendanceSnap = await getDocs(query(collection(db, 'attendance')));

        let students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        let sessions = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        let attendance = attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (filters.department) {
            students = students.filter(s => s.department === filters.department);
        }

        if (filters.sessionId) {
            sessions = sessions.filter(s => s.id === filters.sessionId);
            attendance = attendance.filter(a => a.sessionId === filters.sessionId);
        }

        if (filters.courseId) {
            sessions = sessions.filter(s => s.id === filters.courseId);
            attendance = attendance.filter(a => a.sessionId === filters.courseId);
        }

        const sessionIds = sessions.map(s => s.id);
        attendance = attendance.filter(a => sessionIds.includes(a.sessionId));

        const report = {
            generatedAt: new Date(),
            filters,
            summary: {
                totalStudents: students.length,
                totalSessions: sessions.length,
                totalAttendanceRecords: attendance.length
            },
            students: students.map(student => {
                const studentAttendance = attendance.filter(a => a.studentId === student.id);
                const present = studentAttendance.filter(a => a.status === 'present').length;
                const absences = sessionIds.length - present;

                return {
                    ...student,
                    attended: present,
                    total: sessionIds.length,
                    absences,
                    percentage: sessionIds.length > 0 ? Math.round((present / sessionIds.length) * 100) : 0
                };
            }),
            sessions: sessions.map(session => {
                const sessionAttendance = attendance.filter(a => a.sessionId === session.id);
                const present = sessionAttendance.filter(a => a.status === 'present').length;

                return {
                    ...session,
                    present,
                    absent: sessionAttendance.length - present,
                    total: sessionAttendance.length,
                    percentage: sessionAttendance.length > 0 ? Math.round((present / sessionAttendance.length) * 100) : 0
                };
            })
        };

        return report;
    } catch (error) {
        throw error;
    }
}

async function exportReportToCSV(report, filename = 'attendance-report.csv') {
    try {
        let csv = 'Attendance Report\n';
        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        csv += 'STUDENT ATTENDANCE\n';
        csv += 'Index Number,Name,Department,Level,Sessions Attended,Total Sessions,Absences,Percentage\n';

        report.students.forEach(student => {
            csv += `"${student.indexNumber || ''}","${student.name || ''}","${student.department || ''}","${student.level || ''}",${student.attended},${student.total},${student.absences},${student.percentage}%\n`;
        });

        csv += '\n\nSESSION SUMMARY\n';
        csv += 'Course,Week,Present,Absent,Total,Percentage\n';

        report.sessions.forEach(session => {
            csv += `"${session.courseName || ''}",${session.week || ''},${session.present},${session.absent},${session.total},${session.percentage}%\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error;
    }
}
