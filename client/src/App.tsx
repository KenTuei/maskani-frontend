import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { PropertyProvider } from "./context/PropertyContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PropertyDetails from "./pages/PropertyDetails";
import Notifications from "./pages/Notifications";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminDisputes from "./pages/AdminDisputes";

// Realtor Pages
import RealtorDashboard from "./pages/RealtorDashboard";
import AddProperty from "./pages/AddProperty";
import RealtorListings from "./pages/RealtorListings";
import Bookings from "./pages/Bookings";
import VerifyCode from "./pages/VerifyCode";

// Hunter Pages
import HunterDashboard from "./pages/HunterDashboard";
import HunterBookings from "./pages/HunterBookings";
import HunterListings from "./pages/HunterListings";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/admin-dash") ||
    location.pathname.startsWith("/realtor-dash") ||
    location.pathname.startsWith("/hunter-dash");

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <PropertyProvider>
      <BrowserRouter>
        <LayoutWrapper>
          <main className="min-h-screen bg-white">
            <Routes>
              {/* ── PUBLIC ROUTES ── */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />

              {/* Main Marketplace */}
              <Route path="/properties" element={<HunterListings />} />

              {/* Single Property View */}
              <Route path="/properties/:id" element={<PropertyDetails />} />

              {/* Content Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />

              {/* ── ADMIN PROTECTED ── */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin-dash" element={<AdminDashboard />} />
                <Route path="/admin-dash/users" element={<AdminUsers />} />
                <Route
                  path="/admin-dash/bookings"
                  element={<AdminBookings />}
                />
                <Route
                  path="/admin-dash/disputes"
                  element={<AdminDisputes />}
                />
              </Route>

              {/* ── HUNTER PROTECTED ── */}
              <Route element={<ProtectedRoute allowedRoles={["hunter"]} />}>
                <Route path="/hunter-dash" element={<HunterDashboard />} />
                <Route
                  path="/hunter-dash/bookings"
                  element={<HunterBookings />}
                />
                <Route
                  path="/hunter-dash/notifications"
                  element={<Notifications />}
                />
              </Route>

              {/* ── REALTOR PROTECTED ── */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["realtor", "leaser"]}
                    requireApproval
                  />
                }
              >
                <Route path="/realtor-dash" element={<RealtorDashboard />} />
                <Route path="/realtor-dash/add" element={<AddProperty />} />
                <Route
                  path="/realtor-dash/my-listings"
                  element={<RealtorListings />}
                />
                <Route path="/realtor-dash/bookings" element={<Bookings />} />
                <Route path="/realtor-dash/verify" element={<VerifyCode />} />
                <Route
                  path="/realtor-dash/notifications"
                  element={<Notifications />}
                />
              </Route>

              {/* ── FALLBACK ROUTES ── */}
              <Route
                path="/unauthorized"
                element={
                  <div className="flex items-center justify-center h-[60vh] text-slate-600 font-black uppercase tracking-widest text-sm">
                    Access Denied: Insufficient Permissions
                  </div>
                }
              />
              <Route
                path="/waiting-approval"
                element={
                  <div className="flex items-center justify-center h-[60vh] text-[#FF8C00] font-black uppercase tracking-widest text-sm text-center px-6">
                    Account Pending Admin Verification
                  </div>
                }
              />
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
                      404
                    </h2>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                      Page Not Found
                    </p>
                  </div>
                }
              />
            </Routes>
          </main>
        </LayoutWrapper>
      </BrowserRouter>
    </PropertyProvider>
  );
}

export default App;
