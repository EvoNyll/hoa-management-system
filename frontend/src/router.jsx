import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import Home from './pages/Public/Home'
import About from './pages/Public/About'
import BoardMembers from './pages/Public/BoardMembers'
import CommunityMap from './pages/Public/CommunityMap'
import News from './pages/Public/News'
import Events from './pages/Public/Events'
import ContactDirectory from './pages/Public/ContactDirectory'
import Documents from './pages/Public/Documents'
import Login from './pages/Public/Login'
import Register from './pages/Public/Register'
import Contact from './pages/Public/Contact'

// Private pages
import Dashboard from './pages/Private/Dashboard'
import Account from './pages/Private/Account'
import Payments from './pages/Private/Payments'
import PaymentHistory from './pages/Private/PaymentHistory'
import PaymentSuccess from './pages/Private/PaymentSuccess'
import PaymentFailed from './pages/Private/PaymentFailed'
import Bookings from './pages/Private/Bookings'
import Requests from './pages/Private/Requests'
import Forum from './pages/Private/Forum'
import ResidentDirectory from './pages/Private/ResidentDirectory'
import Polls from './pages/Private/Polls'

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'
import NewsManagement from './pages/Admin/NewsManagement'
import EventManagement from './pages/Admin/EventManagement'
import DocumentManagement from './pages/Admin/DocumentManagement'
import BookingManagement from './pages/Admin/BookingManagement'
import PaymentManagement from './pages/Admin/PaymentManagement'
import TicketManagement from './pages/Admin/TicketManagement'
import ForumModeration from './pages/Admin/ForumModeration'
import PollManagement from './pages/Admin/PollManagement'

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/board-members" element={<BoardMembers />} />
      <Route path="/community-map" element={<CommunityMap />} />
      <Route path="/news" element={<News />} />
      <Route path="/events" element={<Events />} />
      <Route path="/contact-directory" element={<ContactDirectory />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected Member Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="member">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/account" element={
        <ProtectedRoute requiredRole="member">
          <Account />
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute requiredRole="member">
          <Payments />
        </ProtectedRoute>
      } />
      <Route path="/payment-history" element={
        <ProtectedRoute requiredRole="member">
          <PaymentHistory />
        </ProtectedRoute>
      } />
      <Route path="/payment-success" element={
        <ProtectedRoute requiredRole="member">
          <PaymentSuccess />
        </ProtectedRoute>
      } />
      <Route path="/payment-failed" element={
        <ProtectedRoute requiredRole="member">
          <PaymentFailed />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute requiredRole="member">
          <Bookings />
        </ProtectedRoute>
      } />
      <Route path="/requests" element={
        <ProtectedRoute requiredRole="member">
          <Requests />
        </ProtectedRoute>
      } />
      <Route path="/forum" element={
        <ProtectedRoute requiredRole="member">
          <Forum />
        </ProtectedRoute>
      } />
      <Route path="/directory" element={
        <ProtectedRoute requiredRole="member">
          <ResidentDirectory />
        </ProtectedRoute>
      } />
      <Route path="/polls" element={
        <ProtectedRoute requiredRole="member">
          <Polls />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole="admin">
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/news" element={
        <ProtectedRoute requiredRole="admin">
          <NewsManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute requiredRole="admin">
          <EventManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/documents" element={
        <ProtectedRoute requiredRole="admin">
          <DocumentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute requiredRole="admin">
          <BookingManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <ProtectedRoute requiredRole="admin">
          <PaymentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute requiredRole="admin">
          <TicketManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/forum" element={
        <ProtectedRoute requiredRole="admin">
          <ForumModeration />
        </ProtectedRoute>
      } />
      <Route path="/admin/polls" element={
        <ProtectedRoute requiredRole="admin">
          <PollManagement />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRouter