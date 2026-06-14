"use client";
import { useState, useEffect } from "react";
import {
  Users,
  Home,
  CheckCircle,
  XCircle,
  UserPlus,
  Lock,
  LayoutGrid,
  Activity,
  MapPin,
  User as UserIcon,
  AlertCircle,
  Menu,
  ChevronLeft,
  MessageSquare,
  Trash2,
  Mail,
  Eye,
  BedDouble,
  Layers,
  Check,
  ExternalLink,
  ShieldCheck,
  EyeOff,
  KeyRound,
  Phone,
  Calendar,
  BadgeCheck,
  Building2,
  Search,
  ZapOff,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "../utils/cn";
import axios from "axios";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("pending_listings");
  const [data, setData] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inspectingItem, setInspectingItem] = useState<any | null>(null);

  // All Users search
  const [userSearch, setUserSearch] = useState("");

  // Market Control — confirm takedown
  const [confirmTakedown, setConfirmTakedown] = useState<any | null>(null);

  const handleTakedown = async (id: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/admin/listings/${id}/decline`,
        {},
        { headers },
      );
      setConfirmTakedown(null);
      fetchData();
    } catch (err) {
      alert("Takedown failed. Check console.");
    }
  };

  // Security tab state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwShow, setPwShow] = useState({ current: false, next: false, confirm: false });
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwError, setPwError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const menuItems = [
    {
      id: "all_props",
      icon: <LayoutGrid size={20} />,
      label: "All Properties",
      color: "text-blue-400",
    },
    {
      id: "all_users",
      icon: <Users size={20} />,
      label: "All Users",
      color: "text-slate-400",
    },
    {
      id: "pending_listings",
      icon: <AlertCircle size={20} />,
      label: "Approve Listings",
      color: "text-orange-400",
    },
    {
      id: "active_market",
      icon: <Activity size={20} />,
      label: "Market Control",
      color: "text-emerald-400",
    },
    {
      id: "approve_listers",
      icon: <UserPlus size={20} />,
      label: "New Lister Verify",
      color: "text-indigo-400",
    },
    {
      id: "messages",
      icon: <MessageSquare size={20} />,
      label: "Support Messages",
      color: "text-sky-400",
    },
    {
      id: "security",
      icon: <Lock size={20} />,
      label: "Security & Password",
      color: "text-rose-400",
    },
  ];

  useEffect(() => {
    if (activeTab === "messages") {
      fetchMessages();
    } else if (activeTab === "security") {
      // no fetch needed
    } else {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      let endpoint = "http://127.0.0.1:5000/admin/listings"; // ✅ admin endpoint returns flattened owner + images array
      if (activeTab === "all_users" || activeTab === "approve_listers") {
        endpoint = "http://127.0.0.1:5000/admin/users"; // includes listing_count
      }
      const res = await axios.get(endpoint, { headers });
      let finalData = res.data;

      if (activeTab === "all_props")
        finalData = res.data.filter((l: any) => l.status !== "pending");
      if (activeTab === "pending_listings")
        finalData = res.data.filter((l: any) => l.status === "pending");
      if (activeTab === "active_market")
        finalData = res.data.filter((l: any) => l.status === "active");
      if (activeTab === "approve_listers")
        finalData = res.data.filter(
          (u: any) => u.role === "leaser" && !u.is_approved_leaser,
        );
      setData(finalData);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/messages", {
        headers,
      });
      setMessages(res.data);
      setUnreadCount(res.data.filter((m: Message) => !m.is_read).length);
    } catch (err) {
      console.error("Messages Error:", err);
    }
  };

  const handleAction = async (id: number, type: "approve" | "decline") => {
    try {
      const isUserAction =
        activeTab === "approve_listers" || activeTab === "all_users";
      const baseUrl = `http://127.0.0.1:5000/admin/${isUserAction ? "users" : "listings"}`;
      await axios.post(
        `${baseUrl}/${id}/${type === "approve" ? "approve" : "decline"}`,
        {},
        { headers },
      );
      setInspectingItem(null);
      fetchData();
    } catch (err) {
      alert("Action failed. Check console.");
    }
  };

  const openMessage = async (msg: Message) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      try {
        await axios.post(
          `http://127.0.0.1:5000/admin/messages/${msg.id}/read`,
          {},
          { headers },
        );
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)),
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {}
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/messages/${id}`, {
        headers,
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    setPwStatus("loading");
    try {
      await axios.post(
        "http://127.0.0.1:5000/admin/change-password",
        { current_password: pwForm.current, new_password: pwForm.next },
        { headers },
      );
      setPwStatus("success");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      setPwStatus("error");
      setPwError(err?.response?.data?.message || "Incorrect current password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-slate-900 overflow-hidden font-sans">
      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          "bg-slate-900 text-white flex flex-col relative z-20 transition-all duration-300 shadow-xl",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-orange-500 p-1.5 rounded-full border-2 border-slate-900 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={cn("p-8 transition-all", isCollapsed ? "opacity-0 h-16" : "opacity-100")}>
          {!isCollapsed && (
            <h2 className="text-2xl font-black italic text-orange-500">
              MASKANI
              <span className="text-slate-500 font-light block text-[10px] tracking-widest uppercase not-italic">
                Admin Hub
              </span>
            </h2>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group w-full flex items-center px-4 py-4 rounded-xl transition-all relative",
                activeTab === item.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800",
                isCollapsed ? "justify-center" : "gap-4",
              )}
            >
              <span className={activeTab === item.id ? "text-white" : item.color}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-bold">{item.label}</span>
              )}
              {item.id === "messages" && unreadCount > 0 && (
                <span
                  className={cn(
                    "bg-sky-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center",
                    isCollapsed ? "absolute top-2 right-2" : "ml-auto",
                  )}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── LOGOUT ── */}
        <div className="p-3 pb-6">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center px-4 py-4 rounded-xl transition-all text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 group",
              isCollapsed ? "justify-center" : "gap-4",
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!isCollapsed && (
              <span className="text-sm font-bold">Log Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50 relative">
        <header className="flex justify-between items-end mb-12">
          <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tight">
            {activeTab.replace(/_/g, " ")}
          </h1>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">Server</p>
              <p className="text-emerald-500 text-xs font-bold">Live</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <Activity size={20} />
            </div>
          </div>
        </header>

        {/* ── MESSAGES TAB ── */}
        {activeTab === "messages" && (
          <div className="flex gap-6 h-[calc(100vh-220px)]">
            <div className="w-80 shrink-0 bg-white rounded-[24px] border border-slate-200 overflow-y-auto shadow-sm">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                    <Mail size={24} className="text-slate-300" />
                  </div>
                  <p className="font-black text-slate-400 text-sm uppercase tracking-widest">
                    No Messages
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => openMessage(msg)}
                      className={cn(
                        "w-full text-left p-5 hover:bg-slate-50 transition-colors",
                        selectedMsg?.id === msg.id &&
                          "bg-orange-50 border-r-2 border-orange-500",
                        !msg.is_read && "bg-sky-50/50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className={cn(
                            "text-sm font-bold truncate",
                            !msg.is_read ? "text-slate-900" : "text-slate-600",
                          )}
                        >
                          {msg.name}
                        </span>
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {msg.subject}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-y-auto">
              {selectedMsg ? (
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-1">
                        {selectedMsg.subject}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>
                          <UserIcon size={13} className="inline mr-1" />
                          {selectedMsg.name}
                        </span>
                        <span>
                          <Mail size={13} className="inline mr-1" />
                          {selectedMsg.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(selectedMsg.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedMsg.message}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <p className="font-black text-slate-400 uppercase text-sm">
                    Select a message
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SECURITY TAB ── */}
        {activeTab === "security" && (
          <div className="max-w-xl mx-auto mt-4">
            {/* Header Card */}
            <div className="bg-slate-900 rounded-[32px] p-10 mb-6 flex items-center gap-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <KeyRound size={28} className="text-rose-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Change Admin Password</h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                  Keep your account secure. Use a strong, unique password.
                </p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 space-y-5">

                {/* Current Password */}
                {(["current", "next", "confirm"] as const).map((field) => {
                  const labels = {
                    current: "Current Password",
                    next: "New Password",
                    confirm: "Confirm New Password",
                  };
                  const placeholders = {
                    current: "Enter your current password",
                    next: "At least 8 characters",
                    confirm: "Repeat your new password",
                  };
                  return (
                    <div key={field}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {labels[field]}
                      </label>
                      <div className="relative">
                        <input
                          type={pwShow[field] ? "text" : "password"}
                          value={pwForm[field]}
                          onChange={(e) =>
                            setPwForm((prev) => ({ ...prev, [field]: e.target.value }))
                          }
                          placeholder={placeholders[field]}
                          className="w-full px-5 py-4 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder:text-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPwShow((prev) => ({ ...prev, [field]: !prev[field] }))
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition"
                        >
                          {pwShow[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Password strength hint */}
                {pwForm.next && (
                  <div className="flex gap-2 pt-1">
                    {[1, 2, 3, 4].map((i) => {
                      const strength =
                        (pwForm.next.length >= 8 ? 1 : 0) +
                        (/[A-Z]/.test(pwForm.next) ? 1 : 0) +
                        (/[0-9]/.test(pwForm.next) ? 1 : 0) +
                        (/[^A-Za-z0-9]/.test(pwForm.next) ? 1 : 0);
                      const colors = ["bg-rose-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
                      return (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all",
                            i <= strength ? colors[strength - 1] : "bg-slate-100",
                          )}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Error / Success */}
                {pwError && (
                  <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
                    <AlertCircle size={16} className="shrink-0" /> {pwError}
                  </div>
                )}
                {pwStatus === "success" && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold">
                    <ShieldCheck size={16} className="shrink-0" /> Password updated successfully!
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setPwStatus("idle");
                    setPwError("");
                    setPwForm({ current: "", next: "", confirm: "" });
                  }}
                  className="px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-700 transition mr-3 uppercase tracking-widest"
                >
                  Reset
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={pwStatus === "loading"}
                  className="px-10 py-4 bg-rose-500 text-white rounded-2xl text-sm font-black hover:bg-rose-600 transition shadow-lg shadow-rose-100 disabled:opacity-50 uppercase tracking-widest"
                >
                  {pwStatus === "loading" ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>

            {/* Tip */}
            <p className="text-center text-[11px] text-slate-400 font-bold mt-6 uppercase tracking-widest">
              You'll remain logged in after changing your password.
            </p>
          </div>
        )}

        {/* ── ALL USERS TAB ── */}
        {activeTab === "all_users" && (
          <div className="space-y-5">
            {/* Search Bar */}
            <div className="relative max-w-sm">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-slate-300 shadow-sm"
              />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">User</th>
                    <th className="px-8 py-5">Contact</th>
                    <th className="px-8 py-5">Role</th>
                    <th className="px-8 py-5 text-right">Listings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data
                    .filter((u: any) => {
                      const q = userSearch.toLowerCase();
                      return (
                        !q ||
                        (u.username || u.full_name || "").toLowerCase().includes(q) ||
                        (u.email || "").toLowerCase().includes(q)
                      );
                    })
                    .map((user: any) => {
                      const initials = (user.full_name || user.username || "?")
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      const role = user.role; // "leaser" | "hunter" | "admin" | etc.
                      const isLister = role === "leaser";
                      const isAdmin  = role === "admin" || role === "superadmin";

                      const avatarColor = isAdmin
                        ? "bg-orange-500"
                        : isLister
                        ? "bg-indigo-500"
                        : "bg-slate-400";

                      const roleMeta = isAdmin
                        ? { label: "Admin",  bg: "bg-orange-50",  text: "text-orange-600",  icon: <ShieldCheck size={11} /> }
                        : isLister
                        ? { label: "Lister", bg: "bg-indigo-50",  text: "text-indigo-600",  icon: <Building2 size={11} /> }
                        : { label: "Hunter", bg: "bg-slate-100",  text: "text-slate-500",   icon: <UserIcon size={11} /> };

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                          {/* User */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0",
                                avatarColor
                              )}>
                                {initials}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-none">
                                  {user.full_name || user.username}
                                </p>
                                {user.username && user.full_name && (
                                  <p className="text-[11px] text-slate-400 mt-0.5">@{user.username}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-8 py-5">
                            <div className="space-y-1">
                              <p className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <Mail size={12} className="text-slate-300 shrink-0" />
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                  <Phone size={12} className="text-slate-300 shrink-0" />
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-8 py-5">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide",
                              roleMeta.bg, roleMeta.text
                            )}>
                              {roleMeta.icon}
                              {roleMeta.label}
                            </span>
                          </td>

                          {/* Listings — only for listers */}
                          <td className="px-8 py-5 text-right">
                            {isLister ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-2xl font-black text-slate-900">
                                  {user.listing_count ?? user.listings_count ?? 0}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase leading-tight text-left">
                                  Active<br />Properties
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-300 font-bold uppercase">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Empty state */}
              {data.filter((u: any) => {
                const q = userSearch.toLowerCase();
                return !q || (u.username || u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
              }).length === 0 && (
                <div className="py-20 text-center">
                  <p className="font-black text-slate-300 text-sm uppercase tracking-widest">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}


        {activeTab === "approve_listers" && (
          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-slate-200 p-20 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <UserPlus size={28} className="text-indigo-300" />
                </div>
                <p className="font-black text-slate-400 text-sm uppercase tracking-widest">No pending lister applications</p>
                <p className="text-slate-300 text-xs mt-2">New applicants will appear here for review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {data.map((user: any) => {
                  const initials = (user.username || user.full_name || "?")
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  const joinedDate = user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-KE", {
                        day: "numeric", month: "short", year: "numeric",
                      })
                    : null;

                  return (
                    <div
                      key={user.id}
                      className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6 flex items-center gap-6 hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                        {initials}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-black text-slate-900 text-lg leading-none truncate">
                            {user.full_name || user.username}
                          </h3>
                          <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0">
                            Awaiting Approval
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
                          {user.email && (
                            <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                              <Mail size={13} className="text-slate-300" />
                              {user.email}
                            </span>
                          )}
                          {user.phone && (
                            <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                              <Phone size={13} className="text-slate-300" />
                              {user.phone}
                            </span>
                          )}
                          {joinedDate && (
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <Calendar size={12} className="text-slate-300" />
                              Joined {joinedDate}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleAction(user.id, "decline")}
                          className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(user.id, "approve")}
                          className="px-7 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                          <BadgeCheck size={15} />
                          Approve Lister
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MARKET CONTROL TAB ── */}
        {activeTab === "active_market" && (
          <div className="space-y-6">
            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Zap size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Listings</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{data.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Building2 size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Listers</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">
                    {new Set(data.map((l: any) => l.owner_id || l.owner_name)).size}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <TrendingUp size={18} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Price (KES)</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">
                    {data.length
                      ? Math.round(data.reduce((s: number, l: any) => s + (l.rent || 0), 0) / data.length).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Live listings table */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              {data.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Zap size={24} className="text-slate-300" />
                  </div>
                  <p className="font-black text-slate-400 text-sm uppercase tracking-widest">No live listings</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Property</th>
                      <th className="px-8 py-5">Location</th>
                      <th className="px-8 py-5">Lister</th>
                      <th className="px-8 py-5">Price</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.map((row: any) => {
                      // Backend returns flattened fields via listing_as_admin_dict()
                      const listerName = row.owner_name;
                      const listerEmail = row.owner_email;
                      const price = row.rent; // model field is 'rent' not 'price'

                      return (
                      <tr key={row.id} className="hover:bg-slate-50/40 transition-colors group">
                        {/* Property */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                              {row.images?.[0] && (
                                <img src={row.images[0]} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none">{row.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{row.type}</p>
                            </div>
                          </div>
                        </td>
                        {/* Location */}
                        <td className="px-8 py-5">
                          <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                            <MapPin size={12} className="text-orange-400 shrink-0" />
                            {row.location}
                          </span>
                        </td>
                        {/* Lister */}
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-700">{listerName}</p>
                          {listerEmail && <p className="text-xs text-slate-400">{listerEmail}</p>}
                        </td>
                        {/* Price */}
                        <td className="px-8 py-5">
                          {price ? (
                            <div>
                              <span className="font-black text-slate-900">KES {Number(price).toLocaleString()}</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">/ month</p>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-bold text-sm">No price set</span>
                          )}
                        </td>
                        {/* Takedown */}
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => setConfirmTakedown(row)}
                            className="flex items-center gap-2 ml-auto px-5 py-2.5 rounded-xl border-2 border-rose-100 text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                          >
                            <ZapOff size={13} /> Take Down
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── TAKEDOWN CONFIRM MODAL ── */}
        {confirmTakedown && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 border border-rose-100">
                <ZapOff size={28} className="text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                Take Down This Listing?
              </h2>
              <p className="text-slate-500 font-medium text-sm mb-1">
                <span className="font-black text-slate-800">{confirmTakedown.title}</span>
              </p>
              <p className="text-slate-400 text-xs mb-8">
                by {confirmTakedown.owner_name || confirmTakedown.owner_username || confirmTakedown.user?.username || "Lister"} · {confirmTakedown.location}
              </p>
              <p className="text-xs text-slate-400 bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 mb-8 leading-relaxed">
                This will immediately remove the listing from the live market. The lister will need to resubmit for approval to publish again.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmTakedown(null)}
                  className="flex-1 py-4 rounded-2xl border-2 border-slate-200 text-slate-500 text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTakedown(confirmTakedown.id)}
                  className="flex-1 py-4 rounded-2xl bg-rose-500 text-white text-sm font-black uppercase tracking-widest hover:bg-rose-600 transition shadow-lg shadow-rose-100"
                >
                  Yes, Take Down
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ALL PROPERTIES TAB ── */}
        {activeTab === "all_props" && (
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Property</th>
                  <th className="px-8 py-5">Location / Specs</th>
                  <th className="px-8 py-5">Lister</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="font-black text-slate-300 text-sm uppercase tracking-widest">No properties found</p>
                    </td>
                  </tr>
                )}
                {data.map((row: any) => {
                  const isTaken = row.status === "taken" || row.status === "unavailable" || row.status === "declined";
                  const isActive = row.status === "active";

                  const statusMeta = isActive
                    ? { label: "Live", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" }
                    : { label: "Taken Down", bg: "bg-slate-100", text: "text-slate-400", dot: "bg-slate-300" };

                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "transition-colors group",
                        isTaken ? "opacity-50 hover:opacity-70" : "hover:bg-slate-50/50 cursor-pointer",
                      )}
                      onClick={() => !isTaken && setInspectingItem(row)}
                    >
                      {/* Property */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-16 h-12 rounded-xl overflow-hidden shrink-0",
                            isTaken ? "bg-slate-100 grayscale" : "bg-slate-200",
                          )}>
                            {row.images?.[0] ? (
                              <img src={row.images[0]} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Building2 size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className={cn(
                              "block font-bold leading-none",
                              isTaken ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900 group-hover:text-orange-500 transition-colors",
                            )}>
                              {row.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block">
                              {row.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      {/* Location */}
                      <td className="px-8 py-6 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-orange-400 shrink-0" />
                          {row.location}
                        </span>
                        {row.bedrooms && (
                          <span className="text-[10px] font-black text-slate-400 flex gap-2 uppercase italic mt-1">
                            <BedDouble size={10} /> {row.bedrooms} Beds · Floor {row.floor_number}
                          </span>
                        )}
                      </td>
                      {/* Lister */}
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-800 text-sm">{row.owner_name}</p>
                        <p className="text-xs text-slate-400">{row.owner_email}</p>
                      </td>
                      {/* Price */}
                      <td className="px-8 py-6">
                        <span className={cn(
                          "font-black tracking-tight",
                          isTaken ? "text-slate-400" : "text-slate-900",
                        )}>
                          KES {row.rent?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide",
                          statusMeta.bg, statusMeta.text,
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", statusMeta.dot)} />
                          {statusMeta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── APPROVE LISTINGS TAB ── */}
        {activeTab === "pending_listings" && (
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Property</th>
                  <th className="px-8 py-5">Location / Specs</th>
                  <th className="px-8 py-5">Lister</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                          <AlertCircle size={22} className="text-orange-300" />
                        </div>
                        <p className="font-black text-slate-300 text-sm uppercase tracking-widest">No pending listings</p>
                      </div>
                    </td>
                  </tr>
                )}
                {data.map((row: any) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => setInspectingItem(row)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          {row.images?.[0] ? (
                            <img src={row.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Building2 size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                            {row.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block">{row.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-orange-400 shrink-0" />
                        {row.location}
                      </span>
                      {row.bedrooms && (
                        <span className="text-[10px] font-black text-slate-400 flex gap-2 uppercase italic mt-1">
                          <BedDouble size={10} /> {row.bedrooms} Beds · Floor {row.floor_number}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-800 text-sm">{row.owner_name}</p>
                      <p className="text-xs text-slate-400">{row.owner_email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900">KES {row.rent?.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(row.id, "approve")}
                          className="h-10 w-10 rounded-xl bg-white border text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(row.id, "decline")}
                          className="h-10 w-10 rounded-xl bg-white border text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {inspectingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
            <div className="bg-white w-full max-w-7xl max-h-[95vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col border border-white/20">

              {/* Top Status Bar */}
              <div className="bg-slate-900 px-12 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Live Inspection Mode
                  </span>
                </div>
                <div className="flex gap-8 text-[10px] font-bold uppercase">
                  <span className="text-slate-400">
                    Listing ID:{" "}
                    <span className="text-white">#MSK-{inspectingItem.id}</span>
                  </span>
                  <span className="text-slate-400">
                    Created:{" "}
                    <span className="text-white">
                      {inspectingItem.created_at
                        ? formatDate(inspectingItem.created_at)
                        : "—"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                  {/* Left Column: Gallery + Map (7 cols) */}
                  <div className="lg:col-span-7 space-y-8">
                    {/* Gallery */}
                    <div className="space-y-4">
                      <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-slate-100 border-8 border-slate-50 shadow-inner">
                        <img
                          src={inspectingItem.images?.[0] || "/placeholder.jpg"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {inspectingItem.images
                          ?.slice(1, 5)
                          .map((img: string, i: number) => (
                            <div
                              key={i}
                              className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm"
                            >
                              <img src={img} className="w-full h-full object-cover" />
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Neighborhood Map */}
                    <div className="rounded-[32px] overflow-hidden border border-slate-200 h-80 relative shadow-sm">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                          inspectingItem.location +
                            ", " +
                            (inspectingItem.city || "Nairobi"),
                        )}`}
                        allowFullScreen
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white">
                        <p className="text-[10px] font-black text-slate-900 uppercase flex items-center gap-2">
                          <MapPin size={12} className="text-orange-500" />
                          Neighborhood Verification
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details + Lister (5 cols) */}
                  <div className="lg:col-span-5 space-y-8">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200">
                          {inspectingItem.type}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase">
                          <ShieldCheck size={14} /> Specs Verified
                        </span>
                      </div>
                      <h2 className="text-5xl font-black text-slate-900 mt-4 leading-tight tracking-tighter">
                        {inspectingItem.title}
                      </h2>
                      <p className="text-xl text-slate-400 font-medium mt-2 flex items-center gap-2 italic">
                        at {inspectingItem.location}
                      </p>
                    </div>

                    {/* High-Impact Specs Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-6 bg-slate-900 rounded-[24px] text-white">
                        <p className="text-[9px] font-black opacity-40 uppercase mb-1">Price</p>
                        <p className="text-lg font-black tracking-tight italic">
                          KES {inspectingItem.rent?.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-6 bg-white border border-slate-200 rounded-[24px]">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rooms</p>
                        <p className="text-lg font-black text-slate-900">
                          {inspectingItem.bedrooms} BR
                        </p>
                      </div>
                      <div className="p-6 bg-white border border-slate-200 rounded-[24px]">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Level</p>
                        <p className="text-lg font-black text-slate-900">
                          FLR {inspectingItem.floor_number}
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-orange-500 pl-3 ml-1">
                        Included Amenities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {inspectingItem.amenities?.map((am: string) => (
                          <span
                            key={am}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-600 rounded-xl text-xs font-bold shadow-sm"
                          >
                            <Check size={14} className="text-emerald-500" /> {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Lister Dossier */}
                    <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200">
                          {inspectingItem.owner_name?.[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-1">
                            Property Lister
                          </p>
                          <p className="font-black text-slate-900 text-lg leading-none">
                            {inspectingItem.owner_name}
                          </p>
                          <p className="text-sm text-blue-600 font-bold mt-1">
                            {inspectingItem.owner_email}
                          </p>
                        </div>
                      </div>
                      <button className="p-3 bg-white rounded-xl text-blue-600 shadow-sm hover:scale-105 transition-transform border border-blue-100">
                        <Mail size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description Footer */}
                <div className="mt-12 p-10 bg-slate-50 rounded-[40px] border border-slate-100 relative">
                  <div className="absolute -top-4 left-10 bg-white px-4 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase">
                    Lister's Pitch
                  </div>
                  <p className="text-2xl text-slate-700 font-medium leading-relaxed italic">
                    "{inspectingItem.short_description}"
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-10 bg-white border-t-2 border-slate-50 flex justify-between items-center px-12">
                <button
                  onClick={() => setInspectingItem(null)}
                  className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest px-8"
                >
                  Exit Inspection
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAction(inspectingItem.id, "decline")}
                    className="px-10 py-5 bg-rose-50 text-rose-500 border-2 border-rose-100 rounded-2xl text-xs font-black hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-100 uppercase tracking-widest"
                  >
                    Reject Listing
                  </button>
                  <button
                    onClick={() => handleAction(inspectingItem.id, "approve")}
                    className="px-16 py-5 bg-orange-500 text-white rounded-2xl text-xs font-black hover:bg-orange-600 transition-all shadow-2xl shadow-orange-200 uppercase tracking-[0.2em]"
                  >
                    Approve & Push Live
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;