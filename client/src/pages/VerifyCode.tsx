"use client";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const VerifyCode = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const token = localStorage.getItem("token");

  const handleChange = (index: number, value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setStatus("error");
      setMessage("Please enter the complete 6-digit code.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/bookings/verify-otp",
        { otp: code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStatus("success");
      setMessage(res.data?.message || "Payment released successfully!");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Invalid OTP. Please try again.");
    }
  };

  const handleReset = () => {
    setOtp(["", "", "", "", "", ""]);
    setStatus("idle");
    setMessage("");
    inputRefs.current[0]?.focus();
  };

  const isFilled = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/realtor-dash")}
            className="p-2 hover:bg-gray-100 rounded-xl transition text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900">Verify Code</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              OTP Payment Release
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Main Card */}
          <div className="bg-[#FF8C00] rounded-[32px] p-8 text-white shadow-2xl shadow-orange-300/40">
            {/* Icon + Title */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mb-4">
                <ShieldCheck size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Verification Hub
              </h2>
              <p className="text-orange-100 text-sm font-medium mt-2 leading-relaxed max-w-xs">
                Ask the hunter for their 6-digit OTP to confirm the viewing and
                release payment.
              </p>
            </div>

            {/* OTP Input */}
            {status !== "success" && (
              <>
                <div
                  className="flex gap-3 justify-center mb-6"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className={`
                        w-12 h-14 rounded-2xl text-center text-xl font-black outline-none transition-all
                        ${
                          digit
                            ? "bg-white text-[#FF8C00] shadow-lg"
                            : "bg-white/20 border-2 border-white/30 text-white"
                        }
                        focus:bg-white focus:text-[#FF8C00] focus:scale-110 focus:shadow-lg
                      `}
                    />
                  ))}
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div className="flex items-center gap-2 bg-red-500/20 border border-red-300/30 rounded-2xl px-4 py-3 mb-4">
                    <XCircle size={16} className="text-red-200 shrink-0" />
                    <p className="text-red-100 text-sm font-medium">
                      {message}
                    </p>
                  </div>
                )}

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={!isFilled || status === "loading"}
                  className={`
                    w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all
                    ${
                      isFilled
                        ? "bg-white text-[#FF8C00] hover:bg-orange-50 shadow-lg"
                        : "bg-white/30 text-white/60 cursor-not-allowed"
                    }
                  `}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={36} className="text-[#FF8C00]" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Payment Released!</h3>
                  <p className="text-orange-100 text-sm mt-1">{message}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-4 bg-white text-[#FF8C00] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange-50 transition"
                >
                  Verify Another Code
                </button>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">
              How It Works
            </h3>
            <div className="space-y-3">
              {[
                { step: "1", text: "Hunter books a viewing of your property" },
                { step: "2", text: "Hunter visits and receives a 6-digit OTP" },
                { step: "3", text: "Hunter gives you the OTP after the visit" },
                {
                  step: "4",
                  text: "Enter the OTP here to release your payment",
                },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#FF8C00] font-black text-xs">
                      {step}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
