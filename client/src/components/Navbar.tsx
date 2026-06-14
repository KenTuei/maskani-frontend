import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, LayoutDashboard, CalendarDays } from "lucide-react";
import logoImg from "../assets/logo.png";
import { useListingStore } from "../store/listing.store";

function Navbar() {
  const {} = useListingStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    checkAuth();
  }, [location]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");

    // If no token → force clean state regardless of other flags
    if (!token) {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserData(null);
      return;
    }

    const role =
      localStorage.getItem("userRole") || localStorage.getItem("role") || null;
    const savedUserRaw = localStorage.getItem("maskani_user");
    const username = localStorage.getItem("username");

    setIsLoggedIn(true);
    setUserRole(role);

    if (savedUserRaw) {
      try {
        setUserData(JSON.parse(savedUserRaw));
      } catch {
        setUserData(username ? { name: username } : null);
      }
    } else if (username) {
      setUserData({ name: username });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (userRole === "realtor" || userRole === "leaser") return "/realtor-dash";
    if (userRole === "admin") return "/admin-dash";
    return "/hunter-dash";
  };

  const handleDashboardClick = () => {
    // Re-verify token exists before navigating — catches stale state
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      navigate("/login");
      return;
    }
    navigate(getDashboardPath());
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "PROPERTIES", path: "/properties" },
    { name: "ABOUT", path: "/about" },
    { name: "BLOG", path: "/blog" },
    { name: "CONTACT", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-slate-50 border-b border-gray-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex justify-between items-center text-xs text-gray-500">
          <div className="flex gap-6">
            <span>+254 714-560-227</span>
            <span>management@maskani.co.ke</span>
          </div>
          {/* Only show welcome if actually logged in with a valid token */}
          {isLoggedIn && (
            <span className="font-medium">
              Welcome back,{" "}
              <span className="text-[#FF8C00] font-bold">
                {userData?.name || userData?.email || "User"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-slate-900">Maskani</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-bold text-xs tracking-wider transition-colors ${
                isActive(link.path)
                  ? "text-[#FF8C00]"
                  : "text-gray-600 hover:text-[#FF8C00]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <div className="flex items-center gap-4 border-l lg:pl-6">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-[#FF8C00] transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="bg-[#FF8C00] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-md hover:bg-[#e67e00] transition-all"
              >
                GET STARTED
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3 border-l pl-4">
              {userRole === "hunter" && (
                <Link
                  to="/hunter-dash/bookings"
                  className="hidden md:flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-100 transition"
                >
                  <CalendarDays size={14} />
                  MY SCHEDULES
                </Link>
              )}

              <button
                onClick={handleDashboardClick}
                className="bg-[#FF8C00] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-md hover:bg-[#e67e00] transition-all flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                DASHBOARD
              </button>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition ml-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}

          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t p-4 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block font-bold px-2 py-1 ${
                isActive(link.path) ? "text-[#FF8C00]" : "text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <hr className="my-2" />
          {isLoggedIn ? (
            <>
              {userRole === "hunter" && (
                <Link
                  to="/hunter-dash/bookings"
                  className="block font-bold text-blue-600 px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  MY SCHEDULES
                </Link>
              )}
              <button
                onClick={() => {
                  handleDashboardClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left font-bold text-[#FF8C00] px-2"
              >
                MY DASHBOARD
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left font-bold text-red-500 px-2 pt-2"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                className="text-center py-3 font-bold text-slate-900 border border-slate-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="text-center py-3 bg-[#FF8C00] text-white rounded-lg font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                GET STARTED
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
