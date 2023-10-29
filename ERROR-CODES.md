## Error Codes For Scriptopia Connect - Backend

**configs/logger.js**
- `MN-SRV-100 SERVER RESTARTED`: The server was restarted.

**configs/mongo.js**
- `MN-MDB-100: CONNECTED TO MONGO`: Successfully connected to the MongoDB database.
- `MMN-DB-101 : FAILED TO CONNECT TO MONGO`: Failed to connect to MongoDB.

**handler/admin/backupHandler.js**
- `ADM-BKH-100: BACKUP SUCCESSFUL`: Backup operation was successful.
- `ADM-BKH-101: BACKUP FAILED`: Backup operation failed.

**handler/admin/certificatesHandler.js**
- `ADM-CHH-101: Error Fetching Certificates`: Error fetching certificates.

**handler/admin/dashboardHandler.js**
- `ADM-DSH-101 Failed to fetch data at dashboard`: Error fetching data for the dashboard.

**handler/admin/facultyHandler.js**
- `ADM-FCH-101 Failed to get faculty`: Failed to retrieve faculty information.
- `ADM-FCH-102 Failed to Import Faculty`: Error importing faculty data.
- `ADM-FCH-103 Failed to Add Faculty`: Failed to add faculty.
- `ADM-FCH-104 Failed to delete faculty`: Failed to delete faculty.

**handler/admin/logsHandler.js**
- `ADM-LGH-100 Failed to Retrieve Logs`: Error retrieving logs.

**handler/admin/notificationHandler.js**
- `ADM-NTH-100 Failed to create notification`: Error creating a notification.
- `ADM-NTH-101 Failed to receive notification`: Failed to receive a notification.
- `ADM-NTH-102 Failed to Update Notification`: Error updating a notification.
- `ADM-NTH-103 Failed to Delete Notification`: Failed to delete a notification.

**handler/admin/profileHandler.js**
- `ADM-PRF-100: Cant Update Admin Password`: Failed to update the admin password.
- `ADM-PRF-101: Failed to Toggle Maintainance Mode`: Failed to toggle maintenance mode.

**handler/admin/studentHandler.js**
- `ADM-STH-100: Failed to Fetch Student`: Error fetching student data.
- `ADM-STH-101: Failed to Import Students`: Error importing student data.
- `ADM-STH-102: Failed to Add Student`: Failed to add a student.
- `ADM-STH-103: Failed to Update Student`: Failed to update a student.
- `ADM-STH-104: Failed to Delete Student`: Failed to delete a student.
- `ADM-STH-105: Failed to Bulk Delete Students`: Failed to bulk delete students.

**handler/admin/verifyAdmin.js**
- `ADM-VA-100: Token Modified and Admin Access Was Tried`: Token modified, and an admin access attempt was made.
- `ADM-VA-101: Token did not support Admin Role`: Token did not support an admin role.

**handler/student/certificatesHandler.js**
- `STU-CHH-101: Error while trying to download certificate with ID ${id}`

**handler/student/dashboardHandler.js**
- `STU-DSH-100: Error Fetching Dashboard Data`: Error fetching dashboard data.
- `STU-DSH-101: Error Updating The First Time Variable of Student`: Error updating the first-time variable of a student.

**handler/student/houseHandler.js**
- `STU-HOU-100: Error Fetching Student Houses`: Error fetching student houses.
- `STU-HOU-101: Error Fetching a Single House`: Error fetching a single house.

**handler/student/profileHandler.js**
- `STU-PRF-100: Error Fetching Student Profile Data`: Error fetching student profile data.
- `STU-PRF-101: Error Updating Password of Student`: Error updating the password of a student.
- `STU-PRF-102: Error while toggling maintainace mode`: Error in toggling Maintainance Mode.
- `STU-PRF-103: Maintainance Mode Is Enabled`: Maintainance Mode Enabled.
- `STU-PRF-104: Maintainance Mode Is Disabled`: Maintainance Mode Disabled.

**handler/firstTimeHandler.js**
- `MN-FTH-100: Error Updating First Time Data`: Error updating first-time data.

**handler/loginHandler.js**
- `MN-LH-100: Server Error At Login Handler`: Server error at the login handler.
- `MN-LH-101: Error in Setting First Time Password`: Error setting the first-time password.
- `MN-LH-200: Admin Logged In`: An admin logged in.
- `MN-LH-201: Faculty Logged In`: A faculty member logged in.
- `MN-LH-202: Student Logged In`: A student logged in.

**handler/apis/jwt.js**
- `MN-JWT-100: Error in JWT TOKEN`: JWT Token is Invalid.