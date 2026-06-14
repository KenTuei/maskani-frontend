"use client";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/Sidebar";
import {
  Plus,
  Bell,
  LogOut,
  Home,
  Eye,
  Calendar,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ChevronRight,
  PlusCircle,
  MessageSquare,
  List,
} from "lucide-react";

const RealtorDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"live" | "pending">("live");
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [userName, setUserName] = useState("Agent");
  const [stats, setStats] = useState({
    revenue: "KSh 0",
    activeListings: 0,
    totalViews: 0,
    scheduled: 0,
  });
  const [properties, setProperties] = useState<any[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const username = localStorage.getItem("username") || "Agent";
    setUserName(username.split(" ")[0]);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/listings/my-listings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
        setStats((prev) => ({
          ...prev,
          activeListings: data.filter((p: any) => p.is_approved).length,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/realtor-dash",
      icon: <TrendingUp className="h-5 w-5 shrink-0 text-slate-500" />,
    },
    {
      label: "My Properties",
      href: "/realtor-dash/my-listings",
      icon: <List className="h-5 w-5 shrink-0 text-slate-500" />,
    },
    {
      label: "Scheduled Bookings",
      href: "/realtor-dash/bookings",
      icon: <Calendar className="h-5 w-5 shrink-0 text-slate-500" />,
    },
    {
      label: "Verify Code",
      href: "/realtor-dash/verify",
      icon: <ShieldCheck className="h-5 w-5 shrink-0 text-slate-500" />,
    },
    {
      label: "Notifications",
      href: "/realtor-dash/notifications",
      icon: <Bell className="h-5 w-5 shrink-0 text-slate-500" />,
    },
    {
      label: "Chat Admin",
      href: "/realtor-dash/chat",
      icon: <MessageSquare className="h-5 w-5 shrink-0 text-slate-500" />,
    },
    {
      label: "Add Listing",
      href: "/realtor-dash/add",
      icon: <PlusCircle className="h-5 w-5 shrink-0 text-[#FF8C00]" />,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const liveProperties = properties.filter((p) => p.is_approved);
  const pendingProperties = properties.filter((p) => !p.is_approved);
  const displayProperties =
    viewMode === "live" ? liveProperties : pendingProperties;

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 w-full flex-1 mx-auto overflow-hidden h-screen text-slate-900">
      {/* ── Sidebar ── */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}

            {open && (
              <div className="mt-4 mx-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#FF8C00]">
                  Realtor Portal
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-1">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="text-slate-600 hover:bg-orange-50 hover:text-[#FF8C00] rounded-xl transition-colors px-2 py-2"
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <SidebarLink
              link={{
                label: userName,
                href: "#",
                icon: (
                  <div className="h-7 w-7 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {userName[0]?.toUpperCase() || "A"}
                  </div>
                ),
              }}
              className="text-slate-700 font-semibold"
            />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 text-red-500 hover:bg-red-50 rounded-xl w-full mt-2 transition-colors"
            >
              <LogOut size={18} className="shrink-0" />
              {open && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full">
          {/* Header */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Karibu tena,{" "}
                <span className="text-[#FF8C00] font-bold">{userName}</span>.
              </p>
            </div>
            <button
              onClick={() => navigate("/realtor-dash/notifications")}
              className="p-2 bg-white border border-gray-200 rounded-2xl relative hover:bg-gray-50 shadow-sm transition"
            >
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF8C00] rounded-full border-2 border-white" />
            </button>
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              val={stats.revenue}
              icon={<DollarSign />}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <StatCard
              label="Active Listings"
              val={stats.activeListings.toString()}
              icon={<Home />}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatCard
              label="Total Views"
              val={stats.totalViews.toString()}
              icon={<Eye />}
              color="text-[#FF8C00]"
              bg="bg-orange-50"
            />
            <StatCard
              label="Scheduled"
              val={stats.scheduled.toString()}
              icon={<Calendar />}
              color="text-purple-600"
              bg="bg-purple-50"
            />
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Property Performance */}
            <div className="flex-1 w-full bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">
                  Property Performance
                </h3>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["live", "pending"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as any)}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-bold rounded-lg uppercase transition capitalize",
                        viewMode === mode
                          ? "bg-white shadow-sm text-[#FF8C00]"
                          : "text-slate-500 hover:text-slate-700",
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {displayProperties.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Home size={24} className="text-[#FF8C00]" />
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    No {viewMode} listings yet.
                  </p>
                  <button
                    onClick={() => navigate("/realtor-dash/add")}
                    className="px-6 py-2.5 bg-[#FF8C00] text-white rounded-xl text-sm font-bold hover:bg-[#e67e00] transition shadow-md shadow-orange-200"
                  >
                    Add Your First Listing
                  </button>
                </div>
              ) : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-100">
                    {displayProperties.map((prop) => (
                      <tr
                        key={prop.id}
                        onClick={() => navigate(`/properties/${prop.id}`)}
                        className="hover:bg-orange-50/50 transition cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm group-hover:text-[#FF8C00] transition-colors">
                            {prop.title}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                            {prop.location}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-sm text-slate-500">
                          {prop.views || 0} views
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight
                            size={16}
                            className="text-gray-300 ml-auto group-hover:translate-x-1 group-hover:text-[#FF8C00] transition-all"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-80 space-y-5">
              {/* OTP Card */}
              <div className="bg-[#FF8C00] rounded-3xl p-7 text-white shadow-xl shadow-orange-200">
                <ShieldCheck size={40} className="mb-3 text-orange-100/60" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter mb-1">
                  Verification Hub
                </h3>
                <p className="text-orange-100 text-[11px] font-medium leading-relaxed mb-5">
                  Enter the 6-digit OTP from the hunter to release payment.
                </p>
                <div className="flex gap-2 mb-5">
                  {otpValue.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-full h-11 bg-white/15 border border-white/25 rounded-xl text-center font-black text-white outline-none focus:bg-white focus:text-[#FF8C00] transition-all"
                    />
                  ))}
                </div>
                <button className="w-full py-3.5 bg-white text-[#FF8C00] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-50 transition">
                  Verify OTP
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/realtor-dash/add")}
                    className="w-full py-3 bg-[#FF8C00] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#e67e00] transition text-sm shadow-md shadow-orange-100"
                  >
                    <Plus size={16} /> New Listing
                  </button>
                  <button
                    onClick={() => navigate("/realtor-dash/my-listings")}
                    className="w-full py-3 border border-gray-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm"
                  >
                    <List size={16} /> My Properties
                  </button>
                  <button
                    onClick={() => navigate("/realtor-dash/bookings")}
                    className="w-full py-3 border border-gray-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm"
                  >
                    <Calendar size={16} /> Scheduled Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = () => (
  <Link to="/" className="flex items-center space-x-2 py-1 px-2">
    <div className="h-6 w-7 rounded-lg bg-[#FF8C00] shadow-md shadow-orange-200 shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-black uppercase tracking-tighter text-slate-900 whitespace-nowrap"
    >
      Maskani<span className="text-[#FF8C00]">Pro</span>
    </motion.span>
  </Link>
);

const LogoIcon = () => (
  <Link to="/" className="flex items-center py-1 px-2">
    <div className="h-6 w-7 rounded-lg bg-[#FF8C00] shrink-0" />
  </Link>
);

const StatCard = ({ label, val, icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm group hover:border-orange-200 hover:shadow-md transition-all">
    <div
      className={cn(
        "p-3 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform",
        bg,
        color,
      )}
    >
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </p>
    <h3 className="text-2xl font-black mt-1 text-slate-900">{val}</h3>
  </div>
);

export default RealtorDashboard;
