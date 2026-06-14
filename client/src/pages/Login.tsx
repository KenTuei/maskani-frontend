import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface LoginModalProps {
  open?: boolean;
  onClose?: () => void;
  onSwitchToSignup?: () => void;
}

const Login = ({
  open: propOpen,
  onClose: propOnClose,
  onSwitchToSignup,
}: LoginModalProps = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const isStandalonePage = propOpen === undefined;
  const isOpen = isStandalonePage ? true : propOpen;

  useEffect(() => {
    if (isOpen) {
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
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const { access_token, role, is_approved, username, user_id } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isApproved", String(is_approved));
      localStorage.setItem("username", username || "");
      localStorage.setItem("user_id", String(user_id));
      localStorage.setItem(
        "maskani_user",
        JSON.stringify({ name: username, email: formData.email }),
      );

      if (role === "admin") navigate("/admin-dash");
      else if (role === "hunter") navigate("/hunter-dash");
      else if (role === "realtor" || role === "leaser") {
        if (is_approved) navigate("/realtor-dash");
        else navigate("/waiting-approval");
      } else navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
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
        .maskani-modal-enter { animation: dropIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards; }
        .maskani-modal-exit  { animation: dropOut 0.25s ease forwards; }
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

      {/* Modal — pinned near top-center */}
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
            // No maxHeight, no overflow — clean card
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
              marginBottom: "1.6rem",
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

          {/* Heading */}
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
              margin: "0 0 1.6rem",
            }}
          >
            Welcome back — sign in or join Maskani today.
          </p>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: "1.1rem",
                padding: "0.7rem 1rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                color: "#dc2626",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
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
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                style={{
                  width: "100%",
                  padding: "0.78rem 1rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "13px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                  transition:
                    "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF8C00";
                  e.target.style.background = "#fff";
                  e.target.style.boxShadow = "0 0 0 4px rgba(255,140,0,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

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
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                style={{
                  width: "100%",
                  padding: "0.78rem 1rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "13px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                  transition:
                    "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF8C00";
                  e.target.style.background = "#fff";
                  e.target.style.boxShadow = "0 0 0 4px rgba(255,140,0,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: loading
                  ? "#fdba74"
                  : "linear-gradient(135deg, #FF8C00, #ff6a00)",
                color: "#fff",
                fontWeight: 900,
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "13px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 20px rgba(255,140,0,0.32)",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "0.2rem",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
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
              {loading ? (
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "1.1rem 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
            <span
              style={{ fontSize: "0.72rem", color: "#cbd5e1", fontWeight: 600 }}
            >
              or
            </span>
            <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
          </div>

          {/* Google — placeholder, wired for later */}
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

          {/* Sign up link */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.85rem",
              color: "#64748b",
              margin: "1.1rem 0 0",
            }}
          >
            Don't have an account?{" "}
            {onSwitchToSignup ? (
              <button
                onClick={onSwitchToSignup}
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
                Sign up
              </button>
            ) : (
              <Link
                to="/signup"
                style={{
                  color: "#FF8C00",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Sign up
              </Link>
            )}
          </p>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "#f1f5f9",
              margin: "1.1rem 0 0.9rem",
            }}
          />

          {/* Agent section — no purchase products */}
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
            {onSwitchToSignup ? (
              <button
                onClick={onSwitchToSignup}
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
                to="/signup"
                style={{
                  color: "#FF8C00",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Log in or create an account
              </Link>
            )}
          </div>

          {/* Legal */}
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

export default Login;
