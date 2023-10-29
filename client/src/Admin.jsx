import { Route } from "react-router-dom";
import React from "react";

import AdminHome from "./pages/Admin/Home/Home.jsx";
import AdminStudents from "./pages/Admin/Student/Students.jsx";
import AdminStudentsImport from "./pages/Admin/Student/Import/StudentImport.jsx";
import AdminFacultyImport from "./pages/Admin/Faculty/Import/FacultyImport.jsx";
import AdminFaculty from "./pages/Admin/Faculty/Faculty.jsx";
import AdminSettings from "./pages/Admin/Settings/Settings.jsx";
import AdminLogs from "./pages/Admin/Logs/Logs.jsx";
import AdminCertificates from "./pages/Admin/Certificates/Certificates.jsx";
import AdminFeedback from "./pages/Admin/Feedback/Feedback.jsx";

const Admin = () => {
  return (
    <>
      <Route path="/admin" element={<AdminHome />} />

      <Route path="/admin/students" element={<AdminStudents />} />
      <Route path="/admin/students/add" element={<AdminStudentsImport />} />
      <Route path="/admin/faculty/add" element={<AdminFacultyImport />} />
      <Route path="/admin/faculty" element={<AdminFaculty />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/logs" element={<AdminLogs />} />
      <Route path="/admin/certificates" element={<AdminCertificates />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />

      <Route
        path="*"
        element={<div> Not Found or You do not have permission.</div>}
      />
    </>
  );
};

export default Admin;
