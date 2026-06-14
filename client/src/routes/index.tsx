// src/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import About from "../pages/About";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import PropertyDetails from "../pages/PropertyDetails";
import AdminDashboard from "../pages/AdminDashboard";
import AdminBookings from "../pages/AdminBookings";
import AdminDisputes from "../pages/AdminDisputes";
import AdminUsers from "../pages/AdminUsers";
import HunterDashboard from "../pages/HunterDashboard";
import HunterBookings from "../pages/HunterBookings";
import HunterListings from "../pages/HunterListings";
import HunterSearch from "../pages/HunterSearch";
import RealtorDashboard from "../pages/RealtorDashboard";
import RealtorListings from "../pages/RealtorListings";
import RealtorRequests from "../pages/RealtorRequests";
import AddProperty from "../pages/AddProperty";
import Bookings from "../pages/Bookings";
import Notifications from "../pages/Notifications";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />

      {/* ── Admin Routes ── */}
      <Route
        path="/admin-dash"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dash/bookings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dash/disputes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDisputes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dash/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      {/* ── Hunter Routes ── */}
      <Route
        path="/hunter-dash"
        element={
          <ProtectedRoute allowedRoles={["hunter"]}>
            <HunterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hunter-dash/bookings"
        element={
          <ProtectedRoute allowedRoles={["hunter"]}>
            <HunterBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hunter-dash/listings"
        element={
          <ProtectedRoute allowedRoles={["hunter"]}>
            <HunterListings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hunter-dash/search"
        element={
          <ProtectedRoute allowedRoles={["hunter"]}>
            <HunterSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hunter-dash/notifications"
        element={
          <ProtectedRoute allowedRoles={["hunter"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* ── Realtor Routes ── */}
      <Route
        path="/realtor-dash"
        element={
          <ProtectedRoute allowedRoles={["realtor"]}>
            <RealtorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/realtor-dash/my-listings"
        element={
          <ProtectedRoute allowedRoles={["realtor"]}>
            <RealtorListings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/realtor-dash/bookings"
        element={
          <ProtectedRoute allowedRoles={["realtor"]}>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/realtor-dash/requests"
        element={
          <ProtectedRoute allowedRoles={["realtor"]}>
            <RealtorRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/realtor-dash/add"
        element={
          <ProtectedRoute allowedRoles={["realtor"]}>
            <AddProperty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/realtor-dash/notifications"
        element={
          <ProtectedRoute allowedRoles={["realtor"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
