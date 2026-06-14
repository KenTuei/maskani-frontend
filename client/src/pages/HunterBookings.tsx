"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Timer,
  CheckCircle2,
  XCircle,
  ChevronRight,
  User,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Home,
} from "lucide-react";
import { cn } from "../utils/cn";

// ── Types ──
interface Booking {
  id: number;
  listing_id: number;
  listing_title: string;
  listing_location: string | null;
  listing_rent: number | null;
  listing_image: string | null;
  leaser_id: number;
  status: string;
  scheduled_slot: string | null;
  preferred_slots: string[];
  one_time_code: string | null;
  created_at: string;
  // extras from realtor join (we'll enrich from listing.owner)
  leaser_name?: string;
}

const BASE = "http://127.0.0.1:5000";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    dot: "bg-orange-400",
  },
  payment_required: {
    label: "Pay to Confirm",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    dot: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    dot: "bg-emerald-400",
  },
  declined: {
    label: "Declined",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    dot: "bg-red-400",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-100",
    dot: "bg-slate-400",
  },
};

const HunterBookings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [revealedOTPs, setRevealedOTPs] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data);
    } catch {
      setError("Could not load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOTP = (id: number) => {
    setRevealedOTPs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatDate = (slot: string | null) => {
    if (!slot) return { date: "TBD", time: "" };
    try {
      const d = new Date(slot);
      return {
        date: d.toLocaleDateString("en-KE", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: d.toLocaleTimeString("en-KE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: slot, time: "" };
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "active")
      return ["pending", "approved", "payment_required"].includes(b.status);
    if (filter === "completed")
      return ["completed", "declined", "cancelled"].includes(b.status);
    return true;
  });

  const activeCount = bookings.filter((b) =>
    ["pending", "approved", "payment_required"].includes(b.status),
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF8C00] mb-2">
            Hunter Portal
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                My Bookings
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-2">
                {loading
                  ? "Loading..."
                  : `${bookings.length} total · ${activeCount} active`}
              </p>
            </div>
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-slate-600 hover:border-[#FF8C00] hover:text-[#FF8C00] transition-all shadow-sm"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-6">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  filter === f
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-slate-500 hover:border-slate-300",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-6">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm font-bold flex-1">{error}</p>
            <button
              onClick={fetchBookings}
              className="text-xs font-black text-red-500 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] p-6 animate-pulse border border-gray-100"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                  <div className="w-24 h-8 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-20 text-center"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-[#FF8C00]" />
            </div>
            <p className="font-black text-slate-700 text-base">
              No bookings yet
            </p>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {filter !== "all"
                ? `No ${filter} bookings found`
                : "Start by finding a home you love"}
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FF8C00] transition-all"
            >
              Browse Listings
            </button>
          </motion.div>
        )}

        {/* ── Booking Cards ── */}
        {!loading && (
          <div className="space-y-5">
            <AnimatePresence>
              {filteredBookings.map((booking, idx) => {
                const cfg =
                  STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const { date, time } = formatDate(
                  booking.scheduled_slot || booking.preferred_slots?.[0],
                );
                const isOTPVisible = revealedOTPs.has(booking.id);

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300"
                  >
                    {/* ── Card Top ── */}
                    <div className="p-6 flex flex-col sm:flex-row gap-5">
                      {/* Property Image */}
                      <div className="relative flex-shrink-0">
                        {booking.listing_image ? (
                          <img
                            src={booking.listing_image}
                            alt={booking.listing_title}
                            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-20 h-20 rounded-2xl flex items-center justify-center",
                              cfg.bg,
                            )}
                          >
                            <Home size={28} className={cfg.color} />
                          </div>
                        )}
                        {/* Status dot */}
                        <span
                          className={cn(
                            "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white",
                            cfg.dot,
                          )}
                        />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3
                              className="font-black text-lg text-slate-900 leading-tight cursor-pointer hover:text-[#FF8C00] transition-colors"
                              onClick={() =>
                                navigate(`/properties/${booking.listing_id}`)
                              }
                            >
                              {booking.listing_title}
                            </h3>
                            {booking.listing_rent && (
                              <p className="text-[#FF8C00] font-black text-sm mt-0.5">
                                KSh {booking.listing_rent.toLocaleString()}
                                <span className="text-slate-400 font-medium text-xs">
                                  /mo
                                </span>
                              </p>
                            )}
                          </div>
                          {/* Status Badge */}
                          <span
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex-shrink-0",
                              cfg.color,
                              cfg.bg,
                              cfg.border,
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                cfg.dot,
                              )}
                            />
                            {cfg.label}
                          </span>
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 mt-3">
                          {booking.listing_location && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                              <MapPin size={11} className="text-[#FF8C00]" />{" "}
                              {booking.listing_location}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                            <Calendar size={11} className="text-blue-400" />{" "}
                            {date}
                          </span>
                          {time && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                              <Clock size={11} className="text-purple-400" />{" "}
                              {time}
                            </span>
                          )}
                          {booking.leaser_name && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                              <User size={11} className="text-emerald-400" />{" "}
                              {booking.leaser_name}
                            </span>
                          )}
                        </div>

                        {/* Booking ref */}
                        <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest">
                          Ref #{String(booking.id).padStart(5, "0")} ·{" "}
                          {new Date(booking.created_at).toLocaleDateString(
                            "en-KE",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ── Status Footer ── */}
                    <div className="border-t border-slate-50 mx-6 pb-6 pt-5">
                      {/* PENDING */}
                      {booking.status === "pending" && (
                        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-5 py-3.5 rounded-2xl">
                          <Timer
                            size={16}
                            className="text-orange-500 animate-pulse flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs font-black text-orange-700 uppercase tracking-wider">
                              Awaiting Realtor Approval
                            </p>
                            <p className="text-[10px] text-orange-500 font-medium mt-0.5">
                              You'll be notified once the realtor responds
                            </p>
                          </div>
                        </div>
                      )}

                      {/* PAYMENT REQUIRED */}
                      {booking.status === "payment_required" && (
                        <div className="flex items-center justify-between bg-amber-50 border border-amber-100 px-5 py-3.5 rounded-2xl gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <ShieldCheck
                                size={16}
                                className="text-amber-600"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-black text-amber-700 uppercase tracking-wider">
                                Payment Required
                              </p>
                              <p className="text-[10px] text-amber-500 font-medium mt-0.5">
                                Complete payment to receive your OTP viewing
                                code
                              </p>
                            </div>
                          </div>
                          <button className="flex-shrink-0 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all">
                            Pay Now
                          </button>
                        </div>
                      )}

                      {/* APPROVED — OTP DISPLAY */}
                      {booking.status === "approved" && (
                        <div className="bg-slate-900 rounded-2xl overflow-hidden">
                          <div className="flex flex-col sm:flex-row items-stretch">
                            {/* Left: OTP */}
                            <div className="flex-1 p-5">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">
                                Your Viewing Code
                              </p>
                              <div className="flex items-center gap-4">
                                {booking.one_time_code ? (
                                  <>
                                    <div className="flex gap-1.5">
                                      {(isOTPVisible
                                        ? booking.one_time_code
                                        : "••••••"
                                      )
                                        .split("")
                                        .map((char, i) => (
                                          <span
                                            key={i}
                                            className="w-9 h-11 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white font-black text-lg tracking-wider"
                                          >
                                            {char}
                                          </span>
                                        ))}
                                    </div>
                                    <button
                                      onClick={() => toggleOTP(booking.id)}
                                      className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                      {isOTPVisible ? (
                                        <EyeOff
                                          size={15}
                                          className="text-slate-400"
                                        />
                                      ) : (
                                        <Eye
                                          size={15}
                                          className="text-slate-400"
                                        />
                                      )}
                                    </button>
                                  </>
                                ) : (
                                  <p className="text-slate-500 text-xs font-bold">
                                    Code not yet issued
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right: Instructions */}
                            <div className="sm:w-44 bg-[#FF8C00]/10 border-t sm:border-t-0 sm:border-l border-white/5 p-5 flex flex-col justify-center">
                              <ShieldCheck
                                size={20}
                                className="text-[#FF8C00] mb-2"
                              />
                              <p className="text-white font-black text-xs uppercase tracking-wider leading-snug">
                                Show to Realtor
                              </p>
                              <p className="text-slate-500 text-[9px] font-medium mt-1 leading-relaxed">
                                Present this code upon arrival at the property
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* COMPLETED */}
                      {booking.status === "completed" && (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-5 py-3.5 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500 flex-shrink-0"
                            />
                            <div>
                              <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                                Visit Verified
                              </p>
                              <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                                Your viewing was completed successfully
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              navigate(`/properties/${booking.listing_id}`)
                            }
                            className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-wider"
                          >
                            View Property <ChevronRight size={12} />
                          </button>
                        </div>
                      )}

                      {/* DECLINED / CANCELLED */}
                      {(booking.status === "declined" ||
                        booking.status === "cancelled") && (
                        <div className="flex items-center justify-between bg-red-50 border border-red-100 px-5 py-3.5 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <XCircle
                              size={18}
                              className="text-red-400 flex-shrink-0"
                            />
                            <div>
                              <p className="text-xs font-black text-red-600 uppercase tracking-wider">
                                {booking.status === "declined"
                                  ? "Request Declined"
                                  : "Booking Cancelled"}
                              </p>
                              <p className="text-[10px] text-red-400 font-medium mt-0.5">
                                You can browse other listings
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate("/properties")}
                            className="flex items-center gap-1.5 text-[10px] font-black text-red-500 hover:underline uppercase tracking-wider flex-shrink-0"
                          >
                            Find More <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HunterBookings;
