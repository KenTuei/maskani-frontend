"use client";
import { cn } from "../utils/cn";
import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  CalendarCheck,
  LogOut,
  Search,
  ShieldCheck,
  MessageSquare,
  List,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type {
  Dispatch,
  SetStateAction,
  ComponentProps,
  ReactNode,
} from "react";

// --- CONTEXT ---
interface SidebarContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  animate: boolean;
}
const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

// --- MAIN WRAPPER ---
export const Sidebar = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// --- CHANGE PASSWORD MODAL ---
const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    if (next.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to change password.");
        return;
      }
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <KeyRound size={18} className="text-[#FF8C00]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Change Password
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Keep your account secure
            </p>
          </div>
        </div>
        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={24} className="text-emerald-500" />
            </div>
            <p className="font-black text-slate-900">Password Updated!</p>
            <p className="text-slate-400 text-xs mt-1">You're all set.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs font-bold text-red-500">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Current Password
              </label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 ring-orange-400/30 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                New Password
              </label>
              <input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 ring-orange-400/30 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 ring-orange-400/30 transition-all"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-2 py-3.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FF8C00] transition-all"
            >
              Update Password
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- SIDEBAR BODY ---
export const SidebarBody = (props: ComponentProps<typeof motion.div>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("username") || "User";
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const realtorLinks = [
    {
      label: "Dashboard",
      href: "/realtor-dash",
      icon: <TrendingUp className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      label: "My Properties",
      href: "/realtor-dash/my-listings",
      icon: <List className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      label: "Bookings",
      href: "/realtor-dash/bookings",
      icon: <CalendarCheck className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      label: "Verify Code",
      href: "/realtor-dash/verify",
      icon: <ShieldCheck className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      label: "Chat Admin",
      href: "/realtor-dash/chat",
      icon: <MessageSquare className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      label: "Add Listing",
      href: "/realtor-dash/add",
      icon: <PlusCircle className="h-5 w-5 flex-shrink-0 text-[#FF8C00]" />,
    },
  ];

  const hunterLinks = [
    {
      label: "Dashboard",
      href: "/hunter-dash",
      icon: (
        <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-slate-500" />
      ),
    },
    {
      label: "Find Homes",
      href: "/properties",
      icon: <Search className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
    {
      label: "My Bookings",
      href: "/hunter-dash/bookings",
      icon: <CalendarCheck className="h-5 w-5 flex-shrink-0 text-slate-500" />,
    },
  ];

  const menuItems =
    userRole === "realtor" || userRole === "leaser"
      ? realtorLinks
      : hunterLinks;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>

      <DesktopSidebar {...props}>
        {/* Logo */}
        <Logo role={userRole} />

        {/* Role Badge */}
        <RoleBadge role={userRole} />

        {/* Nav Links */}
        <div className="mt-4 flex flex-col gap-1 flex-1 overflow-y-auto">
          {/* Regular nav links */}
          {menuItems.map((link, idx) => (
            <SidebarLink
              key={idx}
              link={link}
              active={location.pathname === link.href}
            />
          ))}

          {/* Change Password — sits right below last nav item */}
          <SidebarLink
            link={{
              label: "Change Password",
              href: "#",
              icon: (
                <KeyRound className="h-5 w-5 flex-shrink-0 text-slate-500" />
              ),
            }}
            onClick={() => setShowPasswordModal(true)}
          />
        </div>

        {/* Footer: username + logout */}
        <div className="border-t border-gray-100 pt-4 space-y-1">
          {/* Username row */}
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl">
            <div className="h-7 w-7 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
              {userName[0]?.toUpperCase() || "U"}
            </div>
            <motion.span
              animate={{ display: "inline-block", opacity: 1 }}
              className="text-sm font-black text-slate-700 truncate whitespace-pre"
            >
              {userName.split(" ")[0]}
            </motion.span>
          </div>
          {/* Logout alone */}
          <SidebarLink
            link={{
              label: "Logout",
              href: "#",
              icon: <LogOut className="text-red-500 h-5 w-5 flex-shrink-0" />,
            }}
            onClick={handleLogout}
            className="text-red-500 hover:bg-red-50"
          />
        </div>
      </DesktopSidebar>

      <MobileSidebar
        menuItems={menuItems}
        userRole={userRole}
        userName={userName}
        location={location}
        handleLogout={handleLogout}
        onChangePassword={() => setShowPasswordModal(true)}
      />
    </>
  );
};

// --- ROLE BADGE ---
const RoleBadge = ({ role }: { role: string | null }) => {
  const { open } = useSidebar();
  if (!open) return null;
  return (
    <div className="mx-2 mt-3 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl">
      <p className="text-[9px] font-black uppercase tracking-widest text-[#FF8C00]">
        {role === "realtor" || role === "leaser"
          ? "Realtor Portal"
          : "Hunter Portal"}
      </p>
    </div>
  );
};

// --- DESKTOP SIDEBAR ---
const DesktopSidebar = ({ className, children, ...props }: any) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-white w-[260px] flex-shrink-0 border-r border-gray-200",
        className,
      )}
      animate={{ width: animate ? (open ? "260px" : "80px") : "260px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- MOBILE SIDEBAR ---
const MobileSidebar = ({
  menuItems,
  userRole,
  userName,
  location,
  handleLogout,
  onChangePassword,
}: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14 z-50 fixed top-0 left-0 right-0">
      <Logo role={userRole} />
      <button
        onClick={() => setMobileOpen(true)}
        className="p-2 text-slate-600"
      >
        <Menu size={22} />
      </button>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <Logo role={userRole} />
              <button onClick={() => setMobileOpen(false)}>
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
              {menuItems.map((link: any, idx: number) => (
                <Link
                  key={idx}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition",
                    location.pathname === link.href
                      ? "bg-orange-50 text-[#FF8C00] border-r-4 border-[#FF8C00]"
                      : "text-slate-600 hover:bg-gray-50",
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {/* Change Password in mobile nav too */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onChangePassword();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-gray-50 transition w-full text-left"
              >
                <KeyRound size={18} className="flex-shrink-0 text-slate-500" />
                Change Password
              </button>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                <div className="h-8 w-8 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {userName[0]?.toUpperCase() || "U"}
                </div>
                <span className="font-black text-slate-700 text-sm">
                  {userName.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold w-full hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- LOGO ---
const Logo = ({ role }: { role: string | null }) => {
  const { open } = useSidebar();
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-7 bg-[#FF8C00] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        className="font-black text-slate-900 whitespace-pre"
      >
        MASKANI{" "}
        <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-tighter">
          {role === "realtor" || role === "leaser" ? "Lister" : "Hunter"}
        </span>
      </motion.span>
    </Link>
  );
};

// --- SIDEBAR LINK ---
export const SidebarLink = ({
  link,
  className,
  onClick,
  active,
  ...props
}: any) => {
  const { open, animate } = useSidebar();
  const commonClasses = cn(
    "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-xl transition-all duration-200",
    active
      ? "bg-orange-50 border-r-4 border-[#FF8C00]"
      : "hover:bg-orange-50/60",
    className,
  );
  const content = (
    <>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-sm font-bold whitespace-pre transition duration-150",
          active ? "text-[#FF8C00]" : "text-slate-700",
        )}
      >
        {link.label}
      </motion.span>
    </>
  );
  if (onClick)
    return (
      <button
        onClick={onClick}
        className={cn(commonClasses, "w-full text-left")}
        {...props}
      >
        {content}
      </button>
    );
  return (
    <Link to={link.href} className={commonClasses} {...props}>
      {content}
    </Link>
  );
};
