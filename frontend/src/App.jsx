import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthContext, AuthProvider } from './AuthContext.jsx';
import LoginForm from './pages/LoginForm.jsx';
import EmployeeLayout from './layouts/EmployeeLayout.jsx';
import EmployeeDashboard from './pages/employee/Dashboard.jsx';
import { Navigate } from 'react-router-dom';
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDetail from "./pages/admin/EmployeeDetail";
import LeaveRequests from "./pages/admin/LeaveRequests";
import Payroll from "./pages/admin/Payroll";
import InviteEmployee from "./pages/admin/InviteEmployee";
import QrGenerator from "./pages/admin/QRGenerator.jsx";


import Profile from './features/profile/Profile.jsx'
import Leave from "./features/leave/Leave";
import ManualAttendance from "./features/attendance/ManualAttendance";
import QRScanner from "./pages/QRScanner"

function App() {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    
    <BrowserRouter>
      {isAuthenticated ? (

        <>
          
          
          <Routes>
          
            <Route path='/employee' element={<EmployeeLayout />} />
            <Route path='/employee/dashboard' element={<EmployeeDashboard />} />

            <Route path="/admin" element={<AdminLayout />} >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
              <Route path="employees/:id/qr" element={<QrGenerator />} />
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="invite" element={<InviteEmployee />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
         
            <Route path="/profile" element={<Profile/>} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/attendance/manual" element={<ManualAttendance />} />
            <Route path="/attendance/scan" element={<QRScanner/>} />
            
          </Routes>
        
        </>
      ) : (
        <>
          
          <Routes>
            <Route path='' element={<LoginForm />} />
      
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};
const Root = () => {
  return(
  <AuthProvider>
    <App />
  </AuthProvider>)
}

export default Root;
