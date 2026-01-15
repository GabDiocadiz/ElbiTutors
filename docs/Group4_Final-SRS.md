

# **Software Requirements Specification**

# **for**

# **ELBITutors**

**Version 5.0 approved**

**Prepared by**  
Banzuela, Eitan Andrei  
Cabatingan, Joanne Maryz  
Cubelo, Angeline  
Diocadiz, Gabrielle Therese  
Matira, Eron Jay  
Navarro, Roy Kevin  
Ortiz, Gavin Josh  
Perus, Lance Joseph

**Young Software Engineers’ Society**

**September 12, 2025**

**Table of Contents**

**[1\. Introduction	1](#introduction)**

[1.1 Purpose	1](#purpose)

[1.2 Document Conventions	1](#heading=)

[1.3 Intended Audience and Reading Suggestions	1](#heading=)

[1.4 Product Scope	1](#heading=)

[1.5 References	2](#heading=)

[**2\. Overall Description**	2](#heading=)

[2.1 Product Perspective	2](#product-perspective)

[2.2 Product Functions	2](#heading=)

[2.3 User Classes and Characteristics	3](#heading=)

[2.4 Operating Environment	4](#heading=)

[2.5 Design and Implementation Constraints	4](#heading=)

[2.6 User Documentation	5](#heading=)

[2.7 Assumptions and Dependencies	5](#heading=)

[**3\. External Interface Requirements**	5](#heading=)

[3.1 Hardware Interfaces	6](#heading=)

[3.2 Software Interfaces	6](#heading=)

[3.3 Communications Interfaces	7](#heading=)

[**4\. System Features**	7](#heading=)

[4.1 Tutee Account Creation	7](#heading=)

[4.2 Admin Account Creation	8](#admin-account-creation)

[4.3 Admin Interface	9](#admin-interface)

[4.4 Tutor Profile Management	10](#heading=)

[4.5 Session Booking	11](#session-booking)

[4.6 Tutor Evaluation and Feedback	11](#tutor-evaluation-and-feedback)

[4.7 Group Tutoring Session	12](#group-tutoring-session)

[4.8 Reporting and Issue Handling	13](#reporting-and-issue-handling)

[**5\. Other Nonfunctional Requirements	14**](#other-nonfunctional-requirements)

[5.1 Performance Requirements	14](#performance-requirements)

[5.2 Safety Requirements	14](#heading=)

[5.3 Security Requirements	14](#heading=)

[5.4 Software Quality Attributes	14](#heading=)

[5.5 Business Rules	15](#heading=)

**Revision History**

| Name | Date | Reason For Changes | Version |
| :---- | :---- | :---- | :---- |
| Eitan | 09/15/2025 |  Did not specify what the admin's creation account is and what the admin's interface is  | 2.0 |
| Eitan and Gabby | 9/15/2025 | Vague Points on specific stuff | 2.0 |
| Group 4 | 9/16/2025 | Specification on subjects | 3.0 |
| Gababies | 9/19/2025 | Changes after consultation with LRC Office | 4.0 |
| Gababies | 10/28/2025 | Changes after the Project Presentation during the final deliberations | 5.0 |

1. # **Introduction** {#introduction}

   1. ## **Purpose**  {#purpose}

This document specifies the software requirements for **ElbiTutor v1.0**, a peer-to-peer tutoring and academic support platform designed for the **University of the Philippines Los Baños (UPLB)**. The purpose of this SRS is to define the system’s features, behavior, and constraints, serving as a guide for the development team, project stakeholders, and university partners.

The scope of this SRS includes the **ElbiTutor application**, which encompasses peer-to-peer tutoring, group study session listings, and integration with the UPLB Learning Resource Center (LRC) for lecture and review sessions. This document does not include backend infrastructure specifications or third-party integrations beyond UP Mail authentication and scheduling notifications.

2. ## **Document Conventions**

The title page of this document is written in Arial font, sizes 32 and 20 for the title, and 14 for the subtitles. Headers are written in bold, with section headers at size 18 and subheaders at size 14, and is written in Times New Roman. The rest of the text in this document is in size 11\.

3. ## **Intended Audience and Reading Suggestions**

This document is designed not only for the reference of the **Development Team**, but also for further information of concerned users, such as **students, and the Learning Resource Center**. This document is also intended for **developers integrating Google OAuth**, and for **LRC staff managing tutor verification**. Readers knowledgeable of the system may refer to the **“Table of Contents”** then move on to the specific section.

4. ## **Product Scope**

**ElbiTutor** is a digital application that centralizes academic support within UPLB by connecting students with learning opportunities. It provides three core services:

1. **Group Study Sessions:** Students may book small group tutoring sessions.

2. **LRC Lecture/Review Sessions:** The Learning Resource Center may list official review classes conducted by their trained tutors.

The goals of ElbiTutor are to:

* Improve access to academic help through a centralized platform.  
* Foster a collaborative and supportive learning environment.  
* Strengthen academic preparedness by integrating peer-based and institution-backed tutoring.

By providing these services, ElbiTutor contributes to UPLB’s mission of promoting **academic excellence, community support, and student development**.

5. ## **References**

   APA PsycNet. (n.d.). https://psycnet.apa.org/record/1984-21611-001?ref=socos.org

   Kim, S. C., Jillapali, R., & Boyd, S. (2021). Impacts of peer tutoring on academic performance of elbitutorsfirst-year baccalaureate nursing students: A quasi-experimental study. Nurse Education Today, 96, 104658\. [https://doi.org/10.1016/j.nedt.2020.104658](https://doi.org/10.1016/j.nedt.2020.104658)

   

   Peer Tutorial \- Office of the Vice Chancellor for Student Affairs. (n.d.). [https://uplbosa.org/peertutor](https://uplbosa.org/peertutor)

   Sullivan, G. M., & Artino, A. R., Jr (2013). Analyzing and interpreting data from likert-type scales. Journal of graduate medical education, 5(4), 541–542. [https://doi.org/10.4300/JGME-5-4-18](https://doi.org/10.4300/JGME-5-4-18)

2. # **Overall Description**

   1. ## **Product Perspective** {#product-perspective}

This platform is designed to improve the Learning Resource Center’s system for booking tutors—to streamline the process through a single booking system instead of having tutees book for the administrators and the tutors separately.

2. ## **Product Functions**

The major functions of the ELBITutors platform are summarized as follows:

1. **User Accounts & Profiles**  
   * Upon entering ELBITutors, students can choose between becoming a tutee or expressing interest in becoming a tutor.  
   * Upon choosing the former, tutees can create and manage their own profile.  
   * Tutors’ profiles are created by the LRC, showing the tutors’ availability and specializations as they appear in the LRC’s tutor database.  
2. **Tutor Discovery & Search**  
   * Tutees can search for tutors based on subject offering and availability.  
   * Course codes serve as searchable tags to filter results.

3. **Session Booking & Scheduling**  
   * Tutees can book tutoring sessions.  
   * Tutees input their booking details through the booking button attached to their chosen tutor's profile.  
   * The admin receives the booking details and relays them to the tutor once the booking is confirmed.

4. **Group Tutoring Sessions**  
   * Tutees can increase the number of participants when booking a session.   
   * The maximum number of participants are determined by the LRC Administrators.  
       
5. **Feedback**  
   * Tutees can provide feedback on tutors through a Likert-scale questionnaire, questions of which will be formulated by the LRC, as well as through general comments.  
   * Feedback is tied to individual sessions, and is required to be given to mark a booking as done.  
   * Only admins can see tutees’ feedback once they are submitted.  
       
6. **Reporting & Issue Handling**  
   * Both tutors and tutees can report problematic behavior (e.g., last-minute cancellations, misconduct).  
   * Reports help maintain accountability and quality of service.  
   * Admins can validate reports through the investigation of session histories and internal arrangements.  
   * Three warnings given to a single account will temporarily leave them unable to use ELBITutors.

   3. ## **User Classes and Characteristics**

Users would be classified into three groups:

* **Tutees**  
  * Students using the system (by default).  
  * Has role based on classification  
  * Can search and filter tutors according to their needs.  
  * Can book or cancel tutoring sessions based on the LRC rules.  
  * Can provide feedback and ratings to evaluate tutor performance.

* **LRC-Trained Tutors**  
  * A subclass of tutees.  
  * Can have group study sessions.

* **Admins (LRC Staff)**  
  * Authorized personnel who oversee and regulate the use of the system.  
  * Responsible for  the creation of the tutors’ accounts to ensure authenticity and safety.  
  * Can oversee system activity and tutor evaluations, handle user reports, and enforce policies.  
  * Can mark tutor accounts as Inactive when appropriate.  
  * Can update roles of tutees to tutors  
  * Has authority to accept or deny a booking from a tutee.

  4. ## **Operating Environment**

**ELBITutors** is designed to be accessible across a broad range of environments to ensure maximum availability for users.

### **Supported Platforms**

* **Operating Systems:** The application is compatible with **Windows**, **Linux**, and **macOS**.  
* **Browsers:** **Google Chrome**, **Mozilla Firefox**, **Microsoft Edge**, and all other modern web browsers that fully support **HTML5** and **JavaScript** will be able to run the application.  
* **Devices:** Users can access the application on **desktops**, **laptops**, **tablets**, and **smartphones**.

### **Deployment & Hosting**

* **Application Hosting:** The application will be deployed using **Vercel** to ensure high performance and seamless scaling.  
* **Database Hosting:** **MongoDB Atlas** will host the database, guaranteeing high scalability, reliability, and availability.

  5. ## **Design and Implementation Constraints**

The design and implementation of ElBiTutors will follow modern web development principles, emphasizing clarity, maintainability, scalability, and security in its academic workflows. The following constraints outline the technologies, policies, and operational considerations that will guide and limit development:

* **Frontend:** The user interface will be built with React.js, optimized for desktop and laptop layout and designed to support dynamic interactions such as tutor search, booking, and feedback submission.  
* **Backend:** A Node.js and Express.js server will manage application logic, role-based access control, session tracking, and integration with third-party services.  
* **Database:** MongoDB Atlas will be used to store user profiles, session data, and feedback. Tutor specializations will be stored as comma-separated text for simplicity, though this limits advanced querying.  
* **Deployment:** The system will be deployed on Vercel using its free tier, which imposes constraints on bandwidth, execution time, and concurrent requests.  
* **Authentication:** Secure login will be implemented via OAuth 2.0, restricted to @up.edu.ph email addresses. All data transmission will occur over HTTPS, with sensitive data encrypted.  
* **Permissions and Audit Trails:** Granular permission flags (e.g., verify\_tutors, manage\_sessions) will be assigned to admin accounts. Key actions such as role changes and session approvals will be logged for accountability.  
* **Third-Party Integrations:** Cloudinary will be used for media uploads. All third-party services will operate under free-tier limits, which may affect availability and rate limits.  
* **Calendar and Scheduling:** A custom calendar component will be developed within the app to manage tutor availability and prevent booking conflicts, rather than relying on external calendar APIs.  
* **Maintenance:** The system will be maintained by the original development team (Gababies), with no external constraints on tooling or documentation formats.

  6. ## **User Documentation**

As this application is currently in production, there are no user documentations yet.

7. ## **Assumptions and Dependencies**

The following assumptions and dependencies were identified for the development and deployment of ELBITutors:

**Assumptions:**

* Users have UP Mail accounts for authentication  
* Users have stable internet access   
* Users have access to a modern web browser  
* Developers are granted permission by the LRC to build and deploy ELBITutors under their name and be integrated into their system  
* Cooperation of LRC in encoding LRC-certified tutor accounts into the database  
* Developers will perform regular maintenance and updates to the website  
* Users are expected to follow the system’s guidelines and data privacy policies to keep the learning space safe.

**Dependencies:**

* The website depends on Google OAuth services for authentication via @up.edu.ph accounts.  
* The system will use Vercel’s hosting services for frontend deployment and scalability.  
* The platform uses MongoDB Atlas as the main database for all stored information, including user data, session details, reports, and feedback.  
* The platform will use the cloudinary API for media file storage and retrieval.

3. # **External Interface Requirements**

The application's interface is structurally designed for simplicity and usability. It incorporates the  modern minimalist aesthetic and the official UPLB colors to align with the Learning Research Center's brand identity. The initial point of contact is the Login Page, which strictly enforces identity verification via a **"**Sign In with Google**"** button utilizing Google OAuth against the user's UPMail. Following successful authentication, the user is immediately prompted to select between Tutor or Tutee. If the user opts to be a tutor, they are guided through the Tutor Application Interface, where the LRC's guidelines are presented, and their account must be updated or created and subsequently certified by an admin. All users (except admin) navigate using the navigation bar offering access to Home (the landing page promoting learning and success), Study (the core booking interface), About (detailing application objectives), and Profile (for editing personal data and managing the tutor/tutee role status). The Study Page is critical for tutees, providing search and filtering capabilities to find and view tutor profiles and book sessions. Tutees are limited to a maximum of three active sessions and must complete at least one to book again. Additionally, a Mandatory Feedback Form must be submitted by the tutee immediately after a session for it to be flagged as complete. Finally, a separate, privileged Administrative Interface exists, allowing admins of the LRC to manage user roles (certifying tutors/tutees), create tutor accounts directly, manage tutor feedback, and lastly, provide approval for all tutee session bookings, serving as the central operational control point.

1. ## **Hardware Interfaces**

	The ElBiTutors platform is compatible with a broad range of devices, including smartphones, tablets, laptops, and desktop computers that support modern web browsers. It is optimized to function efficiently on systems with basic hardware configurations, such as a 2 GHz dual-core processor and 4 GB of RAM for desktops and laptops, and at least 2 GB of RAM for mobile devices. As a fully web-based system, ElBiTutors does not require specialized hardware components and relies solely on standard input and output peripherals. This ensures that users can conveniently access the system across different hardware platforms, maintaining consistent performance and accessibility.

2. ## **Software Interfaces**

The ELBITutors platform interfaces with several external software components and services to function.

* **Google OAuth 2.0**: This is the primary software interface for user authentication.This will be used to authenticate users via their UP Mail (@up.edu.ph) accounts. The system sends an authentication request to Google and receives a user token and email information in response. ELBITutors will receive the user’s name to be used for their profile and ensure their eligibility and identity verification.  
* **MongoDB Atlas**: The system’s backend interfaces directly with the MongoDB Atlas-hosted database. MongoDB Atlas will be used to create, read, update, and delete all application data, including user profiles, session bookings, feedback, and system logs.  
* **Cloudinary**: The system interfaces with the Cloudinary API for media management. This handles the uploading, storage and retrieval of media files. The backend sends media files, such as images for profile photos, to Cloudinary and receives a URL for storage in the database.  
* **Vercel**: The frontend of the application is deployed using Vercel’s hosting services. This interface is primarily used for deployment and hosting.  
* **Client Web Browsers**: The application interfaces with the user’s web browser by serving its React.js frontend. All user interactions are captured by the browser and communicated to the backend via HTTPS requests.

  3. ## **Communications Interfaces**

All communications in ELBITutors between the client-side application, which runs on the client’s web browser, and the backend server on Node.js will be conducted securely over HTTPS. The system relies on standard, modern web protocols to function.

* **Client-Server Protocol**: The frontend application will use HTTPS requests to communicate with the backend server. This is used to send and retrieve all application data, such as booking details, user profile information, and feedback.  
* **Authentication**: The application uses OAuth 2.0 to manage user authentication. This requires a communications interface with Google’s OAuth services to securely verify user identities via their @up.edu.ph email addresses.  
* **External APIs**: The backend system communicates with external third-party services via their respective APIs over HTTPS. This includes Cloudinary for uploading and retrieving media files and MongoDB Atlas for all database read/write operations.  
* **Security**: All transit is encrypted using HTTPS to protect user data and session information.  
* **Internal Notifications**: System notifications, such as new report alerts for admins or relaying session details to tutors, are managed through data exchanges within the application.

4. # **System Features**

   1. ## **Tutee Account Creation**

4.1.1	Description and Priority

	This feature allows for the creation of tutee accounts. After Google OAuth log in, the role selection starts. It is a **High** priority feature, as it is the foundation to the entire platform’s functionality

4.1.2	Stimulus/Response Sequences

**Stimulus 1:** A new user navigates to the registration page (i.e. log in page).  
**Response 1:** The system presents a form to ask for their registration credentials (i.e. Google OAuth).

**Stimulus 2:**  The user selects “I want to learn” and fills out the required information (degree program and student number).  
**Response 2:** The system validates the input, creates the account, and signs the user in.

**Stimulus 3:** An LRC Administrator uses a dedicated interface to create a new LRC-certified tutor account.  
**Response 3:** The system generates the account with a “certified” flag and generates a temporary password for the tutor.

4.1.3	Functional Requirements

**REQ-1:** The user has to have a @up.edu.ph email (a.k.a UPMail) for creating the account.

**REQ-2:** The system shall require the user to provide a valid email address (i.e. UPMail) and a password during registration.  
**REQ-3:** The system shall validate the user inputs during log in for the security of the user's account.  
**REQ-4:** The system shall provide an administrative interface for the creation of the “LRC-certified tutor” account.  
**REQ-5:** The system shall set role-based access levels upon account creation.  
**REQ-6:** The system shall store the role metadata (student\_type) to the database, and role-switching is allowed via profile setting or admin override.

2. ## **Admin Account Creation**  {#admin-account-creation}

4.2.1	Description and Priority

	This feature is for the creation of the one-time secure administrative account. This account has elevated privileges to manage user roles, create LRC-certified tutor accounts, and perform other administrative tasks. The admin accounts have permission flags (i.e. verify\_tutors and manage\_sessions). It is a **High** priority feature, as it is essential for platform security and management

4.2.2	Stimulus/Response Sequences

**Stimulus 1:** A designated system administrator accesses the backend system or a super admin interface.  
**Response 1:** The system presents an interface to create the initial  administrative account.

**Stimulus 2:**  The system administrator provides the new admin’s credentials (email, password, and username).  
**Response 2:** The system validates the input, creates the account, and sends an initial password to the new administrator.

4.2.3	Functional Requirements

**REQ-1:** The system shall provide a secure, authenticated interface for the creation of admin accounts. 

**REQ-2:** The system shall allow the creation of new admin accounts with specific, predetermined administrative roles.

**REQ-3:** The system shall require strong, unique credentials for each admin account.

**REQ-4:** The system shall generate and send a temporary, one-time-use password to the new admin upon account creation.

**REQ-5:** The system shall log all actions related to the creation of admin accounts for auditing purposes.

3. ## **Admin Interface** {#admin-interface}

4.3.1	Description and Priority

	This feature provides a dedicated, secure, and user-friendly interface for administrators. Its primary function is to manage and oversee the platform’s operations. This includes handling report issues, creating and updating accounts, overseeing tutor feedback, accepting or denying a tutor’s session, and ensuring the overall integrity and security of the system. This is a **High** priority feature, as it is critical for the proper functioning and maintenance of the platform

4.3.2	Stimulus/Response Sequences

**Stimulus 1:** An authorized administrator logs in the system and navigates to the admin dashboard.  
**Response 1:** The system authenticates the user and presents a secure dashboard with various management tools.

**Stimulus 2:**  The administrator selects the “User Management” option.  
**Response 2:** The system displays a list of all user accounts, along with options to search, filter, and view individual user details

**Stimulus 3:** The administrator selects the user’s account and clicks the “Change Role” button, then chooses “LRC-certified tutor”.  
**Response 3:** The system validates the change, updates the user’s role and capabilities, and records the action in the system logs.

**Stimulus 4:** The administrator selects the “Reports” section from the dashboard.  
**Response** **4:** The system displays a list of reported issues, allowing the administrator to review, take actions, and close reports.

**Stimulus 5:** The administrator selects the “Create New Account” option and chooses the role “LRC-certified tutor”.  
**Response 5:** The system presents a form for the administrator to enter the new tutor’s details and generates the account with a “certified” flag and a temporary password. 

**Stimulus 6:** The administrator selects the “Booking” section from the dashboard.  
**Response 6:** The system presents a list of bookings of the tutee to a specific tutor and with an accept and deny buttons.  
**If administrator accepts:**

- The tutor is now booked at that time and will be able to hold the session and notify both tutor and tutee that they have a session on this specific date and time.

	         **Else:**

- The tutor is not booked and the slot will be free for other tutees to book.


4.3.3	Functional Requirements

**REQ-1:** The system shall provide a secure, password-protected administrative dashboard that is only accessible to designated administrators .

**REQ-2:** The system shall provide an interface for the administrators to view, search, and filter all user accounts.  
**REQ-3:** The system shall allow administrators to change a user’s role and assign them new permissions (e.g. from “tutee” to “LRC-certified tutor”).  
**REQ-4:** The system shall provide a section for administrators to manage and respond to reported issues.  
**REQ-5:** The system shall log all administrative actions, including role changes and account management, for auditing and security purposes.  
**REQ-6:** The system shall allow an administrator to create a new account for “LRC-certified tutor” role and automatically assign a “certified” flag and temporary password.  
**REQ-7:** The system shall store admin permission as flags or roles in the database, and actions like tutor verification or report resolution are logged.  
**REQ-8:** The system shall accept the administrator’s choice to accept or reject the tutee’s booking of that session.

4. ## **Tutor Profile Management**

4.4.1	Description and Priority

This feature allows tutors to create, edit, and maintain their profiles, including their specializations and their available hours, which the system will use to display a visual representation of the tutor’s availability. It is a **High** priority feature, as it is a primary way for tutees to find and select a tutor	

4.4.2	Stimulus/Response Sequences

**Stimulus 1:** A registered tutor logs in for the first time or navigates to their profile editing page.  
**Response 1:** The system displays a form with fields to edit their profile details

**Stimulus 2:** The tutor edits their name, specializations, and/or their available hours  
**Response 2:** The system saves the information and sends a request to the admins to approve the new changes.

**Stimulus 3:** A tutee visits the tutor’s page.  
**Response 3:** The system displays the tutor’s profile details and a view of their available time slots based on the schedule they input.

4.4.3	Functional Requirements

**REQ-1:** The system shall provide a dedicated profile page for the tutor.

**REQ-2:** The system shall allow the tutors to input their name, and fields of expertise 

**REQ-3:** The system shall embed the Google Calendar link for the visual representation of the availability of the tutor.

**REQ-4:** The system shall store the subjects as **comma-separated text**, not normalized.

**REQ-5:** The system shall treat specialization as searchable keywords for tutee inquiries

**REQ-6:** The system shall prevent non-tutor users or not owners of the post from editing the tutor profiles.

5. ## **Session Booking** {#session-booking}

4.5.1	Description and Priority

This feature enables tutees to book a private tutoring session directly via the app’s calendar. Sessions are **one-to-one by default**. The ELBITutors system will first check its internal records to prevent any double bookings for the same time slots. After a successful check, the booking and its details will be passed to the admins for evaluation, and will be sent to the tutee and the tutor involved once approved. It is a **High** priority feature, as it is a core interaction on the platform.

4.5.2	Stimulus/Response Sequences

**Stimulus 1:** A tutee views a tutor’s profile and clicks the “Book a Session Now” button.  
**Response 1:** The system displays a small window with fields to input their booking details in, including details of the topic to be discussed, date, time, location, and number of tutees attending.

* **If the time slot chosen overlaps with another booking for the same tutor**: The system will display an error message.  
    
  **Stimulus 2:** The system finds no overlap in schedule, and so the time slot is available to the current tutee.  
  **Response 2:** The system logs the booking attempt and sends the details provided to the admins for evaluation.  
    
  **Stimulus 3:** The admins flag the session as approved.  
  **Response 3:** The system relays the booking details to the tutor, as well as shows a successful booking message to the tutee, reiterating the details provided.


4.5.3	Functional Requirements

**REQ-1:** The system shall provide a “Book a Session Now” button on each tutor’s profile

**REQ-2:** The system shall check its internal records to prevent any user from booking a time slot that has already been booked.

**REQ-3:** The system shall display the specific error message

**REQ-4:** Upon booking details approval, the system shall log the booking for all parties involved.

	

6. ## **Tutor Evaluation and Feedback** {#tutor-evaluation-and-feedback}

4.6.1	Description and Priority

This feature allows the tutees to provide feedback and rating for a tutor after the session is completed. It is a **Medium** priority feature, as it enhances the platform’s reliability for and trust but is not essential for the initial core functionality.

4.6.2	Stimulus/Response Sequences

**Stimulus 1:** A tutee completes the tutoring session, and is marked as “Evaluate” by the tutor.  
**Response 1:** The system prompts the tutee to provide a rating and feedback for the tutor.

**Stimulus 2:** The tutee answers the evaluation form and optionally provides comments.  
**Response 2:** The system saves the feedback and logs it for the LRC admins to see while marking the session as “Done” in the booking history of all parties involved

4.6.3	Functional Requirements

**REQ-1:** The system shall provide a feedback form with a Likert scale (5-scale) rating system.

**REQ-2:** The system shall allow tutees to submit comments along with their rating.

**REQ-3:** The system shall calculate and update the tutor’s overall rating based on all the submitted feedback.

**REQ-4:** The system shall store and associate each piece of feedback with the correct tutor’s profile.

**REQ-5:** The system shall prevent the tutee from submitting more than one response for a single session.

**REQ-6:** The system shall not show the feedback and ratings publicly and will only be visible towards the LRC admins.

7. ## **Group Tutoring Session** {#group-tutoring-session}

4.7.1	Description and Priority

This feature allows tutees to book group sessions by setting the number of tutees attending in the session to a number greater than one while filling in the booking details. A group session can have no more than five students attending. It is a **Medium** priority feature, as it can be implemented after the core features are stable.

4.7.2	Stimulus/Response Sequences

**Stimulus 1:**  A tutee selects the input field for the number of students attending.  
**Response 1:**  A dropdown menu appears listing down the numbers one to five.

**Stimulus 2:**  The tutee selects a number greater than one and submits the booking details after filling in the rest of it.  
**Response 2:** The system logs the booking attempt, marks it as a group session booking and sends the details provided to the admins for evaluation.

4.7.3	Functional Requirements

**REQ-1:** The system shall allow LRC-certified tutors to have group sessions.

**REQ-2:** The system shall only accept one student to book the group session (i.e. only one account can book the group session). They only need to specify the number of students that will be attending the session until max\_participants limit.

8. ## **Reporting and Issue Handling** {#reporting-and-issue-handling}

 4.8.1	Description and Priority

This feature allows both tutors and tutees to report issues such as last-minute cancellations, inappropriate behavior, or system misuse. The Admin will review these reports and take necessary actions. After three valid reports, the tutor/tutee’s accounts shall be temporarily terminated. This is a **Medium** priority feature, as it ensures accountability and maintains the safety and fairness in the platform

4.8.2	Stimulus/Response Sequences

**Stimulus 1:** A tutee/tutor clicks on the “Report” button.  
**Response 1:** The system shall provide a form to specify the reason for the report (late cancellation, misconduct, or technical issues), a button to cancel the report, and a button to submit the report.

**Stimulus 2:** The tutee/tutor clicks on the “Cancel” button.  
**Response 2:** The system shall remove the report form from their screen.

**Stimulus 3:** The tutee/tutor clicks on the “Submit” button after specifying their reason for reporting.  
**Response 3:** The system shall save this report into the database for further evaluation by the admins.

4.8.3	Functional Requirements

**REQ-1:** The system shall provide a “Report” button or option for both tutors and tutees.

**REQ-2:** The system shall allow the users to select the type of issue (e.g., cancellation, misconduct, or technical issue).

**REQ-3:** The system shall notify the Admin once a new report is submitted.

**REQ-4:** The system shall provide an interface for Admins to view and manage reports.

**REQ-5:** The system shall allow Admins to take actions such as giving warnings, suspending accounts, or marking accounts as inactive 

**REQ-6:** The system shall keep a record of resolved reports for accountability purposes.

5. # **Other Nonfunctional Requirements** {#other-nonfunctional-requirements}

   1. ## **Performance Requirements** {#performance-requirements}

	For the performance requirements, the platform needs to guarantee low latency and quick response times for the best possible user experience, especially during peak academic periods. Since the core functions of the system relies heavily on the database, it is important that the database is reliable, stable, and able to retrieve data quickly. This will ensure that tutor availability is displayed accurately and that the booking process is seamless. To keep students and tutors connected, real-time access to up-to-date scheduling information requires a reliable internet connection.

2. ## **Safety Requirements**

	For the safety of the platform, all user data, including student and tutor information provided upon sign-up, will be securely protected. The system is designed to only store essential information for the platform’s function such as name, email, student number, and  degree program. To ensure interpersonal safety and respectful learning environment, the platform incorporates a reporting system for users to flag misconduct or inappropriate behaviour, which will be reviewed by the administrators.

3. ## **Security Requirements**

   This section describes the security measures that protect user data, control access, and ensure the privacy and safety of the ElBiTutors system.

   

   

1. User Authentication  
- ElBiTutors will implement a password-based authentication (OAuth 2.0)  to ensure that only users with verified UP email accounts can use the website.  
2. Access Control  
- ElBiTutors will utilize defined roles, including admin, tutor, and tutee, to define available features for each role and ensure that some specific functionalities and sensitive data have restricted access.  
3. Logging  
- ElBiTutors will record all major actions such as account creation, role  changes, and reports. These logs will be accessible only to system administrators for transparency and accountability. 

  4. ## **Software Quality Attributes** 

1. Responsiveness  
- ELBITutors will ensure a fast and responsive interface for users across different devices and internet conditions. Page transitions, tutor searches, and booking actions will load seamlessly, maintaining an optimal user experience even during peak usage.

2. Usability  
- The application and user interface for ELBITutors will be intuitive and user-friendly, allowing both students and tutors to easily navigate the system. Users will be able to schedule sessions, browse tutors, and manage their profiles with minimal steps and clear instructions.	

3. Availability  
- ELBITutors will be available to users at least 99% of the time, excluding scheduled maintenance. System uptime and quick recovery mechanisms will ensure uninterrupted access for both tutors and students, especially during active tutoring hours.  
4. Portability  
- ELBITutors is a web-based system and this can run smoothly on various devices such as windows, macOS, as well as on mobile devices. This ensures that students and tutors can use the platform anytime and anywhere.  
5. Testability  
- The system will undergo testing to check important functions such as login,  booking, reporting, and feedback submission before deployment.

  5. ## **Business Rules**

1. Data Privacy and Security:  
- Personal data of every user shall be kept strictly confidential for the safety and security of each individual

2. Adherence with UPLB’s LRC Guidelines:  
- This application will strictly follow the guidelines for the creation of the tutor accounts, the safety and security of both tutees and tutors, and the professionalism for both tutees and tutors.


3. System Usage and Integrity  
- Users must use the system responsibly and avoid activities that could harm its integrity including sharing login credentials as this may lead to unauthorized access or misuse of personal information.

**Appendix A: Glossary**

* **LRC:** Learning Resource Center.  
* **UPLB:** University of the Philippines \- Los Baños  
* **Maximum Participants:** The maximum number of students able to attend a single session with the tutor. The maximum number is 5\.

**Appendix B: Entity-Relationship Diagram**

Link: [GROUP 4 \- ERD](https://lucid.app/lucidchart/d7e88be6-a86b-47a1-aab1-6078dbc8103b/edit?viewport_loc=-398%2C-626%2C5472%2C2430%2C0_0&invitationId=inv_b47a2cbc-de60-427e-b5f8-f5348d5ca186) 

![][image1]

[image1]: <data:image/png;base64,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>