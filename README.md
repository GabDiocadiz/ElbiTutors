# ElbiTutors

### 🧭 **ElbiTutors – System Overview**

**ElbiTutors** is a **peer-to-peer tutoring and academic support platform** designed for students of the **University of the Philippines Los Baños (UPLB)**. It connects tutees, tutors, and Learning Resource Center (LRC) staff in one centralized system to make tutoring more accessible, organized, and accountable.

---

### 🎯 **Main Goals**

* Provide students with **easy access to academic help**.
* **Unify** peer tutoring, group sessions, and official LRC review classes in one platform.
* **Promote collaborative learning** and academic preparedness within the UPLB community.

---

### 👥 **User Roles**

1. **Tutee** – Regular student who books sessions and gives feedback.
2. **LRC-Certified Tutor** – Verified tutor who can host one-on-one and group sessions.
3. **Admin (LRC Staff)** – Manages users, approves bookings, verifies tutors, and handles reports.

---

### ⚙️ **Core Features**

| Feature                         | Description                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| **Tutee Account Creation**      | Login via UP Mail (Google OAuth) and register as a tutee.                                  |
| **Admin Account Creation**      | Secure admin accounts with permission flags for management tasks.                          |
| **Admin Interface**             | Dashboard to manage users, approve sessions, and resolve reports.                          |
| **Tutor Profile Management**    | Tutors can set expertise, availability, and profile info.                                  |
| **Session Booking**             | Tutees book one-on-one sessions; admins review and approve.                                |
| **Tutor Evaluation & Feedback** | Tutees rate tutors via Likert-scale after sessions.                                        |
| **Group Tutoring Sessions**     | Tutors can host group review sessions with limited slots.                                  |
| **Reporting & Issue Handling**  | Both tutees and tutors can report misconduct or issues; admins review and enforce actions. |

---

### 🔒 **Nonfunctional Highlights**

* **Security:** Role-based access, UP Mail login, data protection.
* **Performance:** Real-time schedule checking and validation to avoid double bookings.
* **Reliability:** All actions (bookings, reports, role changes) are logged for accountability.
* **Usability:** Simple and consistent UI designed for UPLB students and staff.

---

### 🧩 **System Context**

* **Frontend:** Web application for tutees, tutors, and admins.
* **Backend:** Handles authentication, booking logic, and database operations.
* **Integration:** Google OAuth (UP Mail), optional email notifications for bookings.

---

### 💡 **In Summary**

> **ElbiTutors** is an academic support web app that streamlines peer tutoring at UPLB.
> It allows students to connect with verified tutors, book sessions, give feedback, and participate in LRC-backed reviews — all while giving administrators control over verification, scheduling, and conduct enforcement.
