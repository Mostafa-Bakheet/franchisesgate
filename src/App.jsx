import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import FranchiseGuidePage from './pages/FranchiseGuidePage';
import FranchiseVsIndependentPage from './pages/FranchiseVsIndependentPage';
import SuccessStoryPage from './pages/SuccessStoryPage';
import SystemSetupPage from './pages/SystemSetupPage';
import ClientsPage from './pages/ClientsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FranchiseEdit from './pages/FranchiseEdit';
import MessageInbox from './pages/MessageInbox';
import OwnerGallery from './pages/OwnerGallery';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/system-setup" element={<SystemSetupPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/franchise-investment-guide" element={<FranchiseGuidePage />} />
        <Route path="/blog/franchise-vs-independent" element={<FranchiseVsIndependentPage />} />
        <Route path="/blog/success-story-ahmed" element={<SuccessStoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/edit" element={<FranchiseEdit />} />
        <Route path="/owner/messages" element={<MessageInbox />} />
        <Route path="/owner/gallery" element={<OwnerGallery />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;