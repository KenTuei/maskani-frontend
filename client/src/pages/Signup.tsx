"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Home, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import confetti from "canvas-confetti";

interface RegisterModalProps {
  open?: boolean;
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterPage = ({
  open: propOpen,
  onClose: propOnClose,
  onSwitchToLogin,
}: RegisterModalProps = {}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const isStandalonePage = propOpen === undefined;
  const isOpen = isStandalonePage ? true : propOpen;

  useEffect(() => {
    if (isOpen) {
      // ── Check if a role hint was set by the home page buttons ──
      const hint = sessionStorage.getItem("signup_role_hint") as
        | "hunter"
        | "realtor"
        | null;
      if (hint) {
        setRole(hint);
        setStep(2); // Skip straight to details
        sessionStorage.removeItem("signup_role_hint");
      } else {
        setStep(1);
        setRole("");
      }
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (propOnClose) propOnClose();
      else navigate(-1);
    }, 280);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone")
      setFormData((p) => ({ ...p, [name]: value.replace(/\D/g, "") }));
    else setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleRegister = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("Please fill in all fields");
      return;
    }
    setIsRegistering(true);
    const roleId = role === "hunter" ? 1 : 2;
    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role_id: roleId,
      username:
        formData.fullName.split(" ")[0].toLowerCase() +
        Math.floor(Math.random() * 10000),
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF8C00", "#1E293B"],
        });
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
          else navigate("/login");
        }, 2000);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch {
      alert("Connection error. Is your Flask backend running?");
    } finally {
      setIsRegistering(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.78rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "13px",
    fontSize: "0.875rem",
    background: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  };
  const iFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#FF8C00";
    e.target.style.background = "#fff";
    e.target.style.boxShadow = "0 0 0 4px rgba(255,140,0,0.1)";
  };
  const iBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dropIn {
          0%   { opacity: 0; transform: translateY(-60px) scale(0.96); }
          60%  { opacity: 1; transform: translateY(8px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dropOut {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.96); }
        }
        @keyframes stepSlide {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .maskani-modal-enter { animation: dropIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards; }
        .maskani-modal-exit  { animation: dropOut 0.25s ease forwards; }
        .step-slide { animation: stepSlide 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.52)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          transition: "opacity 0.3s ease",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Modal — drops from top */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "6vh",
          pointerEvents: "none",
        }}
      >
        <div
          className={visible ? "maskani-modal-enter" : "maskani-modal-exit"}
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "2.25rem 2.5rem 2rem",
            width: "100%",
            maxWidth: "452px",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            position: "relative",
            pointerEvents: "all",
          }}
        >
          {/* ✕ Close */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "1.1rem",
              right: "1.1rem",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: 700,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e5e7eb";
              e.currentTarget.style.color = "#111827";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            ✕
          </button>

          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1.4rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #FF8C00, #ff6a00)",
                borderRadius: "11px",
                boxShadow: "0 4px 12px rgba(255,140,0,0.3)",
              }}
            />
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              Maskani<span style={{ color: "#FF8C00" }}>.</span>
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem" }}>
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  height: "3.5px",
                  flex: 1,
                  borderRadius: "99px",
                  background: step >= s ? "#FF8C00" : "#f1f5f9",
                  transition: "background 0.35s ease",
                }}
              />
            ))}
          </div>

          {/* ── STEP 1: Role Selection ── */}
          {step === 1 && (
            <div className="step-slide">
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: "#0f172a",
                  margin: "0 0 4px",
                  letterSpacing: "-0.4px",
                  lineHeight: 1.25,
                }}
              >
                Log in or create an account
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  margin: "0 0 1.4rem",
                }}
              >
                How would you like to use Maskani?
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "11px",
                }}
              >
                {/* Hunter */}
                <button
                  onClick={() => {
                    setRole("hunter");
                    setStep(2);
                  }}
                  style={{
                    width: "100%",
                    padding: "1rem 1.2rem",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "15px",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                    transition:
                      "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#FF8C00";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(255,140,0,0.11)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "11px",
                      background: "#fff7ed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Search size={20} color="#FF8C00" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: "0.9rem",
                      }}
                    >
                      I'm a Hunter
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                      }}
                    >
                      Looking for a home
                    </p>
                  </div>
                  <ArrowRight size={15} color="#cbd5e1" />
                </button>

                {/* Lister */}
                <button
                  onClick={() => {
                    setRole("realtor");
                    setStep(2);
                  }}
                  style={{
                    width: "100%",
                    padding: "1rem 1.2rem",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "15px",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                    transition:
                      "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0f172a";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(15,23,42,0.09)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "11px",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Home size={20} color="#475569" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: "0.9rem",
                      }}
                    >
                      I'm a Lister
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                      }}
                    >
                      Listing properties
                    </p>
                  </div>
                  <ArrowRight size={15} color="#cbd5e1" />
                </button>
              </div>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "1.1rem 0",
                }}
              >
                <div
                  style={{ flex: 1, height: "1px", background: "#f1f5f9" }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "#cbd5e1",
                    fontWeight: 600,
                  }}
                >
                  or
                </span>
                <div
                  style={{ flex: 1, height: "1px", background: "#f1f5f9" }}
                />
              </div>

              {/* Google placeholder */}
              <button
                disabled
                title="Coming soon"
                style={{
                  width: "100%",
                  padding: "0.78rem 1rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "13px",
                  background: "#fafafa",
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#94a3b8",
                  opacity: 0.6,
                  boxSizing: "border-box",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                    fill="#c0c0c0"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    fill="#c0c0c0"
                  />
                  <path
                    d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    fill="#c0c0c0"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    fill="#c0c0c0"
                  />
                </svg>
                Continue with Google
                <span
                  style={{
                    fontSize: "0.62rem",
                    background: "#f1f5f9",
                    padding: "2px 7px",
                    borderRadius: "99px",
                    color: "#94a3b8",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  SOON
                </span>
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "#64748b",
                  margin: "1rem 0 0",
                }}
              >
                Already have an account?{" "}
                {onSwitchToLogin ? (
                  <button
                    onClick={onSwitchToLogin}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#FF8C00",
                      fontWeight: 700,
                      padding: 0,
                      fontSize: "0.85rem",
                    }}
                  >
                    Log In
                  </button>
                ) : (
                  <Link
                    to="/login"
                    style={{
                      color: "#FF8C00",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Log In
                  </Link>
                )}
              </p>
            </div>
          )}

          {/* ── STEP 2: Details Form ── */}
          {step === 2 && (
            <div className="step-slide">
              <button
                onClick={() => setStep(1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#FF8C00",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: 0,
                  marginBottom: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ← Back
              </button>
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: "#0f172a",
                  margin: "0 0 4px",
                  letterSpacing: "-0.4px",
                  lineHeight: 1.25,
                }}
              >
                Your Details
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  margin: "0 0 1.2rem",
                }}
              >
                Signing up as a{" "}
                <strong
                  style={{ color: role === "hunter" ? "#FF8C00" : "#0f172a" }}
                >
                  {role === "hunter" ? "Hunter" : "Lister"}
                </strong>
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {[
                  {
                    label: "Full Name",
                    name: "fullName",
                    type: "text",
                    placeholder: "John Kamau",
                  },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                    placeholder: "you@example.com",
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "tel",
                    placeholder: "0712 345 678",
                  },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "5px",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      style={inputStyle}
                      onFocus={iFocus}
                      onBlur={iBlur}
                    />
                  </div>
                ))}

                {/* Password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "5px",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: "3rem" }}
                      onFocus={iFocus}
                      onBlur={iBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                        padding: 0,
                        display: "flex",
                      }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    background: isRegistering
                      ? "#fdba74"
                      : "linear-gradient(135deg, #FF8C00, #ff6a00)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "0.82rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "none",
                    borderRadius: "13px",
                    cursor: isRegistering ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(255,140,0,0.32)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "0.1rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isRegistering) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 28px rgba(255,140,0,0.42)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(255,140,0,0.32)";
                  }}
                >
                  {isRegistering ? (
                    <>
                      <span
                        style={{
                          width: "15px",
                          height: "15px",
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }}
                      />{" "}
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up Now <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "#64748b",
                  margin: "1rem 0 0",
                }}
              >
                Already have an account?{" "}
                {onSwitchToLogin ? (
                  <button
                    onClick={onSwitchToLogin}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#FF8C00",
                      fontWeight: 700,
                      padding: 0,
                      fontSize: "0.85rem",
                    }}
                  >
                    Log In
                  </button>
                ) : (
                  <Link
                    to="/login"
                    style={{
                      color: "#FF8C00",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Log In
                  </Link>
                )}
              </p>
            </div>
          )}

          {/* ── Footer (both steps) ── */}
          <div
            style={{
              height: "1px",
              background: "#f1f5f9",
              margin: "1.1rem 0 0.9rem",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Are you a real estate agent?
            </p>
            {onSwitchToLogin ? (
              <button
                onClick={onSwitchToLogin}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#FF8C00",
                  fontWeight: 600,
                  padding: 0,
                  fontSize: "0.8rem",
                }}
              >
                Log in or create an account
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  color: "#FF8C00",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textDecoration: "none",
                }}
              >
                Log in or create an account
              </Link>
            )}
          </div>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#c0cada",
              textAlign: "center",
              margin: "0.9rem 0 0",
              lineHeight: 1.65,
            }}
          >
            By creating an account you agree to Maskani's{" "}
            <a
              href="#"
              style={{
                color: "#94a3b8",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="#"
              style={{
                color: "#94a3b8",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
