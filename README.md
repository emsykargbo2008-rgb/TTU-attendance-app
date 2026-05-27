# TTU Smart Attendance System

Live demo: https://emsykargbo2008-rgb.github.io/TTU-attendance-app/

A modern, production-ready Progressive Web App (PWA) for managing student attendance at Takoradi Technical University. Built with vanilla HTML5, CSS3, JavaScript, and Firebase.

## 🚀 Features

### ✅ Authentication & Security
- Email/Password login with Firebase Authentication
- Role-based access control (Main Admin, Assistant Admin)
- Secure session management
- Protected routes and data access

### 👥 Student Management
- Add, edit, and delete students
- Manage 300+ students efficiently
- Search students by name or index number
- Filter by department
- Display student information (name, index number, department, level)

### 📅 Session Management
- Create lecture sessions with course details
- Track lecturer names, week numbers, and dates
- Organize sessions chronologically
- Edit and delete sessions
- Bulk session operations

### ✓ Attendance System
- Fast, intuitive attendance marking with checkboxes
- Real-time counters (present/absent/total)
- Quick actions: Mark all present, Clear all
- Search students during attendance marking
- Auto-save functionality
- Offline support

### 📊 Reports & Analytics
- Student attendance history and percentages
- Most absent students list
- Filter by course, session, and department
- Export reports to CSV
- Attendance trends and statistics
- Session summaries

### 🔑 Admin Management
- Create and manage admin accounts
- Assign roles (Main Admin, Assistant Admin)
- Edit admin profiles
- Delete admin accounts
- Activity tracking

### 📱 PWA Capabilities
- **Installable**: Install on home screen like a native app
- **Offline Ready**: Works offline with automatic sync
- **Fast**: Optimized performance with caching
- **Responsive**: Perfect on phones, tablets, and desktops
- **Modern UI**: Professional SaaS design
- **Mobile Install**: Add to Home Screen on Android via Chrome and on iPhone via Safari Share menu

## 📋 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **PWA**: Service Workers, Web Manifest
- **Storage**: LocalStorage for session management

## 🏗️ Project Structure

```
TTU-attendance-app/
│
├── index.html                 # Landing page
├── login.html                 # Admin login
├── dashboard.html             # Main dashboard
├── students.html              # Student management
├── sessions.html              # Session management
├── attendance.html            # Mark attendance
├── reports.html               # Reports & analytics
├── admins.html                # Admin management
│
├── css/
│   └── style.css             # Main stylesheet (responsive design)
│
├── js/
│   ├── firebase.js           # Firebase configuration & helpers
│   ├── auth.js               # Authentication logic
│   ├── students.js           # Student CRUD operations
│   ├── sessions.js           # Session management
│   ├── attendance.js         # Attendance tracking
│   ├── reports.js            # Report generation
│   └── admins.js             # Admin management
│
├── manifest.json             # PWA manifest
├── service-worker.js         # Service worker for offline support
│
├── assets/
│   └── (icons and images)
│
└── README.md                  # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account and project

### Website Name and Search
- App name: `TTU Attendance`
- Website search keywords: `TTU Attendance`, `TTU attendance system`, `Takoradi Technical University attendance`

### How People Find the Website
Once you deploy the site to a public host, users can search for `TTU Attendance` in their browser and find it by name.
- Use a unique site title and description
- Publish to Firebase Hosting or another web host
- Add root-level `robots.txt` if you want search engines to index the site

### Step 1: Download or Clone
```bash
git clone https://github.com/emsykargbo2008-rgb/TTU-attendance-app.git
cd TTU-attendance-app
```

### Step 2: Configure Firebase
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create a **Firestore** database
4. Get your Firebase config
5. Update `js/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 3: Local Development
Open `index.html` in a web browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using VS Code Live Server
# Just right-click and select "Open with Live Server"
```

Access at `http://localhost:8000` or `http://localhost:5500`

### Step 4: Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy with existing config
firebase deploy
```

> I already added hosting config files in this project:
> - `firebase.json`
> - `.firebaserc` (project: `attendance-system-11184`)

If you want to connect a different Firebase project, run:
```bash
firebase use --add
```

## 👤 Demo Credentials

### Main Admin
- **Email**: `admin@ttu.edu.gh`
- **Password**: `Admin@123`

### Assistant Admin
- **Email**: `assistant@ttu.edu.gh`
- **Password**: `Assistant@123`

## 📖 Usage Guide

### For Admin: Dashboard
1. Log in with your credentials
2. View system statistics and recent sessions
3. Access quick actions for students, sessions, and attendance
4. Check online/offline status

### For Admin: Student Management
1. Go to **Students** page
2. Click **➕ Add Student** to add new students
3. Enter student details (name, index number, department, level)
4. Search students using the search bar
5. Edit or delete students using action buttons
6. Filter by department

### For Admin: Session Management
1. Go to **Sessions** page
2. Click **➕ New Session** to create a lecture session
3. Enter course name, lecturer name, week number, and date/time
4. Sessions appear as cards
5. Edit or delete sessions as needed

### For Admin: Mark Attendance
1. Go to **Mark Attendance** page
2. Select a session from the dropdown
3. Student list loads automatically
4. Check boxes to mark students as present
5. Use quick actions:
   - **✓ Mark All Present**: Check all boxes
   - **✕ Clear All**: Uncheck all boxes
   - **💾 Save Attendance**: Save changes to database
6. Real-time counters show present/absent/total
7. Search to quickly find students

### For Admin: Reports
1. Go to **Reports** page
2. Apply filters (session, course, department)
3. View student attendance details with percentages
4. See students with low attendance
5. Click **📥 Export Report** to download CSV file
6. Share reports with management

### For Admin: Admin Management
1. Go to **Admins** page (Main Admin only)
2. Add new admin accounts
3. Assign roles (Main Admin or Assistant Admin)
4. Edit admin profiles
5. Delete admin accounts if needed

## 🌐 Progressive Web App

### Install the App
1. Open the app in a modern browser
2. Look for **"Install"** or **"Add to Home Screen"** prompt
3. Click to install as a native app
4. The app appears on your home screen

### Offline Features
- View cached pages offline
- Access previously loaded data
- Changes sync automatically when online
- Works without internet connection

## 🔐 Security Features

- Secure authentication with Firebase
- Email/password encryption
- Role-based access control
- Protected API endpoints
- Input validation and sanitization
- Secure session storage

## 📊 Database Schema

### Users Collection
```javascript
{
  id: string,
  email: string,
  password: string (hashed),
  role: "main_admin" | "assistant_admin",
  createdAt: timestamp
}
```

### Students Collection
```javascript
{
  id: string,
  name: string,
  indexNumber: string,
  department: string,
  level: string,
  createdAt: timestamp
}
```

### Sessions Collection
```javascript
{
  id: string,
  courseName: string,
  lecturerName: string,
  week: number,
  dateTime: string,
  createdAt: timestamp
}
```

### Attendance Collection
```javascript
{
  id: string,
  studentId: string,
  sessionId: string,
  name: string,
  indexNumber: string,
  status: "present" | "absent",
  timestamp: timestamp
}
```

## 🎨 UI/UX Features

- **Modern Dashboard**: SaaS-style interface
- **Responsive Design**: Works on all devices
- **Blue & White Theme**: Professional appearance
- **Smooth Animations**: Polished user experience
- **Toast Notifications**: Real-time feedback
- **Loading States**: Visual feedback for actions
- **Accessibility**: Semantic HTML and ARIA labels

## ⚡ Performance

- Optimized for 300+ students
- Fast search and filtering
- Efficient database queries
- Caching strategy for offline support
- Minimal data transfer
- Quick load times

## 🐛 Troubleshooting

### App not loading?
- Clear browser cache and reload
- Check internet connection
- Ensure Firebase is configured correctly

### Data not saving?
- Check Firebase credentials
- Verify Firestore rules allow read/write
- Check browser console for errors

### Search not working?
- Ensure students are loaded first
- Check spelling of search terms
- Try clearing the search box

### Attendance not saving?
- Select a session first
- Ensure all required fields are filled
- Check Firebase connection

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance Optimization

- Service worker caching
- Lazy loading of components
- Optimized images and assets
- Minified CSS and JavaScript
- Efficient database queries
- Local storage for session data

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributors

- TTU Software Engineering Department

## 📞 Support

For issues, feature requests, or questions:
1. Check the troubleshooting section
2. Review the user guide
3. Contact TTU IT Department

## 🎯 Future Enhancements

- [ ] Biometric attendance (fingerprint/face recognition)
- [ ] SMS notifications for admins
- [ ] QR code attendance marking
- [ ] Integration with university management system
- [ ] Attendance rules and policies
- [ ] Student attendance appeals
- [ ] Dashboard customization
- [ ] Multi-language support
- [ ] Email report distribution
- [ ] Advanced analytics

## 📄 Version History

### v1.0.0 (Current)
- Initial release
- Core features: Students, Sessions, Attendance, Reports
- PWA support
- Offline functionality
- Admin management

---

**Last Updated**: 2026
**Status**: Production Ready

Enjoy using TTU Smart Attendance System! 🎓

