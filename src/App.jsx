import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import RegistrationConfirmationPage from './pages/RegistrationConfirmationPage';
import VerifyRegistrationPage from './pages/VerifyRegistrationPage';
import DigitalPassPage from './pages/DigitalPassPage';
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import RegistrationsPage from './pages/admin/RegistrationsPage';
import ReportsPage from './pages/admin/ReportsPage';
import CheckInPage from './pages/CheckInPage';
import HomePageContentPage from './pages/admin/HomePageContentPage';
import SettingsPage from './pages/admin/SettingsPage';
import AuthGuard from './components/AuthGuard';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <Router>
      {/* Global Toast container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
          },
          success: {
            duration: 2000,
            style: {
              background: '#4ade80',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#4ade80',
            }
          },
          error: {
            duration: 4000,
            style: {
              background: '#f87171',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#f87171',
            }
          },
          loading: {
            style: {
              background: '#60a5fa',
              color: '#fff',
            }
          }
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="registration-confirmation" element={<RegistrationConfirmationPage />} />
          <Route path="verify-registration" element={<VerifyRegistrationPage />} />
          <Route path="digital-pass" element={<DigitalPassPage />} />
          <Route path="check-in/:id" element={<CheckInPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<AdminLoginPage />} />
          <Route element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="registrations" element={<RegistrationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="homepage-content" element={<HomePageContentPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
