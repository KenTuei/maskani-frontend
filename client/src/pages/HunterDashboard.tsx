"use client";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/Sidebar";
import {
  Heart,
  Bell,
  Calendar,
  Wallet,
  ChevronRight,
  Search,
  MapPin,
  Clock,
  LayoutDashboard,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
  LogOut,
} from "lucide-react";

// ── Types ──
interface Booking {
  id: number;
  listing_id: number;
  listing_title: string;
  status: string;
  scheduled_slot: string | null;
  preferred_slots: string[];
  created_at: string;
}

interface DashStats {
  activeBookings: number;
  upcomingBookings: Booking[];
}

const BASE = "http://127.0.0.1:5000";

const HunterDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // ── Auth data from localStorage (set during login) ──
  const token = localStorage.getItem("token");
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  })();
  const userName =
    storedUser?.username?.split(" ")[0] ||
    localStorage.getItem("username") ||
    "Hunter";

  // ── State ──
  const [stats, setStats] = useState<DashStats>({
    activeBookings: 0,
    upcomingBookings: [],
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ── Fetch all dashboard data ──
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingsRes, notifsRes] = await Promise.all([
        fetch(`${BASE}/bookings/my`, { headers: authHeaders }),
        fetch(`${BASE}/notifications/`, { headers: authHeaders }),
      ]);

      // ── Bookings ──
      if (bookingsRes.ok) {
        const bookings: Booking[] = await bookingsRes.json();
        const active = bookings.filter((b) =>
          ["pending", "approved", "payment_required"].includes(b.status),
        );
        const upcoming = bookings
          .filter((b) => b.status === "approved" && b.scheduled_slot)
          .sort(
            (a, b) =>
              new Date(a.scheduled_slot!).getTime() -
              new Date(b.scheduled_slot!).getTime(),
          )
          .slice(0, 2);
        setStats({ activeBookings: active.length, upcomingBookings: upcoming });
      }

      // ── Notifications unread count ──
      if (notifsRes.ok) {
        const notifs = await notifsRes.json();
        setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
      }
    } catch (err) {
      setError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ── Format slot date ──
  const formatSlot = (slot: string | null) => {
    if (!slot) return "TBD";
    try {
      const d = new Date(slot);
      const now = new Date();
      const diff = d.getDate() - now.getDate();
      if (diff === 0)
        return `Today @ ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      if (diff === 1)
        return `Tomorrow @ ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      return d.toLocaleDateString("en-KE", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return slot;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-gray-200 bg-white" />
      </Sidebar>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* ── Header ── */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FF8C00] mb-1">
                Hunter Portal
              </p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                Welcome back,{" "}
                <span className="text-[#FF8C00]">{userName}.</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-2">
                Here's what's happening with your search today.
              </p>
            </div>
            {/* Bell with real unread count */}
            <button
              onClick={() => navigate("/hunter-dash/notifications")}
              className="relative p-3 bg-white border border-gray-200 rounded-2xl hover:border-[#FF8C00] hover:shadow-md transition-all shadow-sm"
            >
              <Bell size={20} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#FF8C00] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm font-bold">{error}</p>
              <button
                onClick={fetchDashboard}
                className="ml-auto text-xs font-black text-red-500 hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              label="Active Bookings"
              val={loading ? "—" : stats.activeBookings.toString()}
              icon={<Clock size={20} />}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
              trend={
                loading
                  ? "Loading..."
                  : stats.activeBookings > 0
                    ? "In progress"
                    : "No active bookings"
              }
              onClick={() => navigate("/hunter-dash/bookings")}
            />
            <StatCard
              label="Upcoming Viewing"
              val={
                loading
                  ? "—"
                  : stats.upcomingBookings.length > 0
                    ? formatSlot(stats.upcomingBookings[0]?.scheduled_slot)
                    : "None"
              }
              icon={<Calendar size={20} />}
              iconColor="text-[#FF8C00]"
              iconBg="bg-orange-50"
              trend="Next scheduled"
              onClick={() => navigate("/hunter-dash/bookings")}
              compact
            />
            <StatCard
              label="Wallet Balance"
              val="KSh 0"
              icon={<Wallet size={20} />}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-50"
              trend="Top up anytime"
            />
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Quick Links (2/3) ── */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-50">
                <div>
                  <h2 className="font-black text-slate-900 text-base">
                    Explore
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    What would you like to do?
                  </p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Find Homes",
                    desc: "Browse 500+ verified listings across Kenya",
                    icon: <Search size={22} className="text-[#FF8C00]" />,
                    bg: "bg-orange-50",
                    href: "/properties",
                  },
                  {
                    title: "My Bookings",
                    desc: `${stats.activeBookings} active viewing request${stats.activeBookings !== 1 ? "s" : ""}`,
                    icon: <Calendar size={22} className="text-blue-500" />,
                    bg: "bg-blue-50",
                    href: "/hunter-dash/bookings",
                  },
                  {
                    title: "Notifications",
                    desc:
                      unreadCount > 0
                        ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                        : "You're all caught up",
                    icon: <Bell size={22} className="text-purple-500" />,
                    bg: "bg-purple-50",
                    href: "/hunter-dash/notifications",
                  },
                  {
                    title: "Market Trends",
                    desc: "Nairobi rental insights",
                    icon: <TrendingUp size={22} className="text-emerald-500" />,
                    bg: "bg-emerald-50",
                    href: "/properties",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.href)}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-orange-100 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        item.bg,
                      )}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-900 group-hover:text-[#FF8C00] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="ml-auto text-slate-300 group-hover:text-[#FF8C00] transition-colors flex-shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Upcoming Viewings (1/3) ── */}
            <div className="space-y-5">
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8C00]/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Upcoming
                      </p>
                      <h3 className="font-black text-base text-white mt-0.5">
                        Viewings
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-[#FF8C00]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl animate-pulse h-16" />
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl animate-pulse h-16 opacity-50" />
                      </>
                    ) : stats.upcomingBookings.length > 0 ? (
                      stats.upcomingBookings.map((b, i) => (
                        <div
                          key={b.id}
                          className={cn(
                            "bg-white/5 border border-white/10 p-4 rounded-2xl",
                            i > 0 && "opacity-50",
                          )}
                        >
                          <p className="text-[9px] font-black text-[#FF8C00] uppercase tracking-widest mb-1">
                            {formatSlot(b.scheduled_slot)}
                          </p>
                          <p className="text-sm font-bold text-white truncate">
                            {b.listing_title}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                          No upcoming viewings
                        </p>
                        <p className="text-slate-600 text-[9px] mt-1">
                          Book a viewing to get started
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate("/hunter-dash/bookings")}
                    className="w-full mt-4 py-3 bg-[#FF8C00] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all active:scale-[0.98]"
                  >
                    View All Bookings
                  </button>
                </div>
              </div>

              {/* Quick Search CTA */}
              <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-[#FF8C00]" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900">
                      Nairobi, KE
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      500+ verified listings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/properties")}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF8C00] transition-all active:scale-[0.98]"
                >
                  Search Listings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Stat Card ──
const StatCard = ({
  label,
  val,
  icon,
  iconColor,
  iconBg,
  trend,
  onClick,
  compact,
}: {
  label: string;
  val: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  trend: string;
  onClick?: () => void;
  compact?: boolean;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-orange-100 transition-all group",
      onClick && "cursor-pointer",
    )}
  >
    <div className="flex items-start justify-between mb-5">
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
          iconBg,
          iconColor,
        )}
      >
        {icon}
      </div>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <h3
      className={cn(
        "font-black text-slate-900 tracking-tight",
        compact ? "text-lg leading-snug" : "text-3xl",
      )}
    >
      {val}
    </h3>
  </div>
);

export default HunterDashboard;
