// Student Management Module

async function saveStudent(studentId, data) {
    try {
        const db = getFirestore();
        if (studentId) {
            const studentRef = window.db.collection('students').doc(studentId);
            await updateDoc(studentRef, data);
            return { id: studentId, ...data };
        } else {
            const result = await addDoc(collection(db, 'students'), {
                ...data,
                createdAt: Date.now()
            });
            return { id: result.id, ...data, createdAt: Date.now() };
        }
    } catch (error) {
        throw error;
    }
}

async function deleteStudent(studentId) {
    try {
        await window.db.collection('students').doc(studentId).delete();
    } catch (error) {
        throw error;
    }
}

async function getStudent(studentId) {
    try {
        const studentDoc = await window.db.collection('students').doc(studentId).get();
        return studentDoc.exists ? { id: studentDoc.id, ...studentDoc.data() } : null;
    } catch (error) {
        throw error;
    }
}

async function getAllStudents() {
    try {
        const db = getFirestore();
        const snap = await getDocs(query(collection(db, 'students')));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw error;
    }
}

async function searchStudents(searchQuery) {
    try {
        const students = await getAllStudents();
        const normalized = searchQuery.toLowerCase();
        return students.filter(s =>
            (s.name || '').toLowerCase().includes(normalized) ||
            (s.indexNumber || '').toLowerCase().includes(normalized)
        );
    } catch (error) {
        throw error;
    }
}

async function loadStudents() {
    try {
        const students = await getAllStudents();
        const tbody = document.getElementById('studentsTableBody');

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No students found. Add a student to get started.</td></tr>';
        } else {
            tbody.innerHTML = students.map(student => `
                <tr>
                    <td>${student.indexNumber || ''}</td>
                    <td>${student.name || ''}</td>
                    <td>${student.department || ''}</td>
                    <td>${student.level || ''}</td>
                    <td>
                        <button class="btn-small" onclick="editStudent('${student.id}', '${student.name}', '${student.indexNumber}', '${student.department}', '${student.level}')">Edit</button>
                        <button class="btn-small btn-danger" onclick="removeStudent('${student.id}', '${student.name}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="5" class="empty-state">Error loading students</td></tr>';
    }
}

function editStudent(studentId, name, indexNumber, department, level) {
    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('studentName').value = name;
    document.getElementById('studentIndex').value = indexNumber;
    document.getElementById('studentDept').value = department;
    document.getElementById('studentLevel').value = level;
    document.getElementById('studentForm').dataset.studentId = studentId;
    document.getElementById('studentModal').style.display = 'block';
}

async function removeStudent(studentId, studentName) {
    if (confirm(`Are you sure you want to delete ${studentName}?`)) {
        try {
            await deleteStudent(studentId);
            showToast('Student deleted successfully', 'success');
            loadStudents();
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    }
}
