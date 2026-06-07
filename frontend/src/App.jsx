import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AttendancePage from "./pages/admin/AttendancePage";
import EmployeesPage from "./pages/admin/EmployeesPage";
import LeavesPage from "./pages/LeavesPage";
import PayrollPage from "./pages/admin/PayrollPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeePayslips from "./pages/employee/EmployeePayslips";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import SignupPage from "./pages/employee/SignupPage";
import ForgotPasswordPage from "./pages/employee/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { 
    path: "/login", element: <LoginPage /> 
  },
   {
    path: "/signup",
    element: <SignupPage />,
  },
   {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    element: <ProtectedRoute roles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <Layout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "employees", element: <EmployeesPage /> },
          { path: "attendance", element: <AttendancePage /> },
          { path: "payroll", element: <PayrollPage /> },
          { path: "leaves", element: <LeavesPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute roles={["employee"]} />,
    children: [
      {
        path: "/employee",
        element: <Layout />,
        children: [
          { index: true, element: <EmployeeDashboard /> },
          { path: "profile", element: <EmployeeProfile /> },
          { path: "payslips", element: <EmployeePayslips /> },
          { path: "leaves", element: <LeavesPage /> },
        ],
      },
    ],
  },
]);

const App = () => {
return(
<RouterProvider router={router} />
);
};
export default App;
