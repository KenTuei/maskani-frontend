"use client";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle,
  X,
  ShieldCheck,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useBookingStore } from "../store/booking.store";
import type { Booking } from "../store/booking.store";

const Bookings = () => {
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useBookingStore();

  const [activeOTPBooking, setActiveOTPBooking] = useState<Booking | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleOtpChange = (index: number, value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && otpValue[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const confirmArrival = () => {
    if (!activeOTPBooking) return;
    setIsVerifying(true);
    setTimeout(() => {
      updateBookingStatus(activeOTPBooking.id, "completed");
      setIsVerifying(false);
      setActiveOTPBooking(null);
      setOtpValue(["", "", "", "", "", ""]);
      setShowToast(true);
    }, 1800);
  };

  const requested = bookings.filter((b) => b.status === "requested");
  const approved = bookings.filter((b) => b.status === "approved");

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/realtor-dash")}
            className="p-2 hover:bg-gray-100 rounded-xl transition text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase text-slate-900">
              Viewing Manager
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Incoming Requests & Arrival Verification
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-10">
        {/* ── New Requests ── */}
        <section>
          <h2 className="text-xs font-black text-[#FF8C00] uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> New Requests
            {requested.length > 0 && (
              <span className="bg-[#FF8C00] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                {requested.length}
              </span>
            )}
          </h2>

          <div className="grid gap-3">
            {requested.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-gray-400" />
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  No pending requests
                </p>
              </div>
            ) : (
              requested.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center">
                      <User size={20} className="text-[#FF8C00]" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">
                        {booking.propertyName}
                      </h3>
                      <div className="flex gap-4 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {booking.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "approved")
                      }
                      className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5"
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "cancelled")
                      }
                      className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-1.5"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Confirmed Schedule ── */}
        <section>
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Calendar size={14} /> Confirmed Schedule
            {approved.length > 0 && (
              <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                {approved.length}
              </span>
            )}
          </h2>

          <div className="grid gap-3">
            {approved.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  No confirmed viewings yet
                </p>
              </div>
            ) : (
              approved.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border border-gray-200 p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl text-center min-w-[120px]">
                    <Calendar
                      size={18}
                      className="text-[#FF8C00] mx-auto mb-2"
                    />
                    <p className="text-xs font-black text-slate-900 tracking-tight">
                      {booking.date}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-[10px] mt-1">
                      <Clock size={11} /> {booking.time}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#FF8C00] transition-colors">
                      {booking.propertyName}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Viewing Session Locked
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveOTPBooking(booking)}
                    className="flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e67e00] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-md shadow-orange-200 active:scale-95"
                  >
                    Verify Arrival <ShieldCheck size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── OTP Modal ── */}
      <AnimatePresence>
        {activeOTPBooking && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 md:p-10 shadow-2xl relative border border-gray-100"
            >
              <button
                onClick={() => !isVerifying && setActiveOTPBooking(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={18} className="text-slate-400" />
              </button>

              <div className="bg-[#FF8C00] w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 mb-6">
                <ShieldCheck size={28} />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                Verify Arrival
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-2 mb-8">
                Enter the 6-digit code from the Hunter to confirm the viewing.
              </p>

              <div className="flex justify-between gap-2 mb-8">
                {otpValue.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying}
                    className={cn(
                      "w-full h-14 border-2 rounded-2xl text-center font-black text-xl outline-none transition-all",
                      digit
                        ? "border-[#FF8C00] bg-orange-50 text-[#FF8C00]"
                        : "border-gray-200 bg-gray-50 text-slate-900 focus:border-[#FF8C00]",
                    )}
                  />
                ))}
              </div>

              <button
                onClick={confirmArrival}
                disabled={otpValue.includes("") || isVerifying}
                className="w-full bg-[#FF8C00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition shadow-md shadow-orange-200 flex justify-center items-center gap-3"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Verifying...
                  </>
                ) : (
                  "Confirm Arrival"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="bg-white border border-gray-200 text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
              <div className="bg-emerald-500 p-1.5 rounded-full">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider leading-none mb-1">
                  Viewing Complete
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  KES 100 has been added to your wallet.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
