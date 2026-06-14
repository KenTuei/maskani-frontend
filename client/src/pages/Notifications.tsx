import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  MessageCircle,
  MoreVertical,
  Home,
  Users,
  Trash2,
} from "lucide-react";
import { cn } from "../utils/cn";
import axios from "axios";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

const BASE = "http://127.0.0.1:5000";

const TYPE_STYLES: Record<
  string,
  { icon: JSX.Element; bg: string; border: string; iconBg: string; dot: string }
> = {
  booking: {
    icon: <Calendar size={20} className="text-blue-500" />,
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  approval: {
    icon: <CheckCircle size={20} className="text-emerald-500" />,
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100",
    dot: "bg-emerald-500",
  },
  payout: {
    icon: <DollarSign size={20} className="text-[#FF8C00]" />,
    bg: "bg-orange-50",
    border: "border-orange-100",
    iconBg: "bg-orange-100",
    dot: "bg-[#FF8C00]",
  },
  request: {
    icon: <Home size={20} className="text-indigo-500" />,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    iconBg: "bg-indigo-100",
    dot: "bg-indigo-500",
  },
  system: {
    icon: <AlertTriangle size={20} className="text-slate-400" />,
    bg: "bg-gray-50",
    border: "border-gray-200",
    iconBg: "bg-gray-100",
    dot: "bg-gray-400",
  },
  admin: {
    icon: <Users size={20} className="text-rose-500" />,
    bg: "bg-rose-50",
    border: "border-rose-100",
    iconBg: "bg-rose-100",
    dot: "bg-rose-500",
  },
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
  });
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Detect role from localStorage (set this during login)
  const role = localStorage.getItem("userRole") || "hunter";

  const backRoute =
    role === "admin"
      ? "/admin-dash"
      : role === "leaser" || role === "realtor"
        ? "/realtor-dash"
        : "/hunter-dash";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/notifications/`, { headers });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post(`${BASE}/notifications/mark-all-read`, {}, { headers });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id: number) => {
    try {
      await axios.post(`${BASE}/notifications/${id}/read`, {}, { headers });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await axios.delete(`${BASE}/notifications/${id}`, { headers });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (n: Notification) => {
    if (!n.is_read) markRead(n.id);
    if (n.link) navigate(n.link);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getStyle = (type: string) => TYPE_STYLES[type] || TYPE_STYLES.system;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(backRoute)}
              className="p-2 hover:bg-gray-100 rounded-xl transition text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Notifications
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-xl transition">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Mark all read */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Recent Updates
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-black text-[#FF8C00] hover:underline uppercase tracking-wider"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 animate-pulse flex gap-4"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div className="bg-white p-16 rounded-3xl text-center border-2 border-dashed border-gray-200">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-[#FF8C00]" />
            </div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm mb-2">
              No Notifications Yet
            </p>
            <p className="text-slate-400 font-medium text-xs">
              Activity on your account will show up here
            </p>
          </div>
        )}

        {/* Notification Cards */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => {
              const style = getStyle(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "group p-5 rounded-3xl border transition-all cursor-pointer flex gap-4 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] relative",
                    style.bg,
                    style.border,
                    !n.is_read && "ring-2 ring-[#FF8C00]/20",
                  )}
                >
                  {/* Unread dot */}
                  {!n.is_read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#FF8C00]" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "p-3 rounded-2xl h-fit shrink-0 shadow-sm",
                      style.iconBg,
                    )}
                  >
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            style.dot,
                          )}
                        />
                        <h3
                          className={cn(
                            "font-black text-sm text-slate-900",
                            !n.is_read && "text-slate-900",
                          )}
                        >
                          {n.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed pl-4">
                      {n.message}
                    </p>

                    {n.link && (
                      <button className="mt-3 ml-4 text-[#FF8C00] text-[10px] font-black uppercase tracking-widest hover:underline">
                        View →
                      </button>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => deleteNotif(e, n.id)}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition text-slate-300 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Support Card */}
        <div className="mt-10 bg-[#FF8C00] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl shadow-orange-200">
          <div className="relative z-10">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">
              Need help?
            </h3>
            <p className="text-orange-100 text-sm mb-6 max-w-[70%] leading-relaxed">
              Chat with our admin support for quick approvals or dispute
              resolution.
            </p>
            <button className="flex items-center gap-2 bg-white text-[#FF8C00] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition hover:bg-orange-50 hover:scale-105 active:scale-95 shadow-lg">
              <MessageCircle size={16} />
              Contact Admin
            </button>
          </div>
          <Bell
            size={160}
            className="absolute -right-10 -bottom-10 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
