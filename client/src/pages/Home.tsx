import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrendingDown, FileBarChart, Zap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper Styles
// @ts-ignore
// @ts-ignore
import "swiper/css";
// @ts-ignore
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
// @ts-ignore
import "swiper/css/effect-fade";

import Login from "./Login";
import RegisterPage from "./Signup";

// --- Live Counter ---
const Counter = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

type ModalType = "login" | "signup" | null;

const Home = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [modal, setModal] = useState<ModalType>(null);

  const openSignup = (hint?: "hunter" | "realtor") => {
    if (hint) {
      sessionStorage.setItem("signup_role_hint", hint);
    } else {
      sessionStorage.removeItem("signup_role_hint");
    }
    setModal("signup");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    setIsLoggedIn(!!token);
    setUserRole(role || "");

    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:5000/listings/");
        setFeaturedListings(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured listings:", err);
      }
    };
    fetchFeatured();
  }, []);

  const slides = [
    {
      title: "Find Your Dream Home",
      subtitle: "Connecting you to trusted property owners across Kenya.",
      image: "/aerial-view-downtown-mumbai-sunset.jpg",
      cta: isLoggedIn ? "Browse Marketplace" : "Register as Hunter",
      action: isLoggedIn
        ? () => navigate("/properties")
        : () => openSignup("hunter"),
    },
    {
      title: "List Your Property",
      subtitle: "Reach thousands of potential tenants in minutes.",
      image: "/bird-s-eye-view-shanghai.jpg",
      cta: isLoggedIn ? "Go to Dashboard" : "Register as Realtor",
      action: isLoggedIn
        ? () =>
            navigate(userRole === "leaser" ? "/realtor-dash" : "/hunter-dash")
        : () => openSignup("realtor"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Modals ── */}
      <Login
        open={modal === "login"}
        onClose={() => setModal(null)}
        onSwitchToSignup={() => setModal("signup")}
      />
      <RegisterPage
        open={modal === "signup"}
        onClose={() => setModal(null)}
        onSwitchToLogin={() => setModal("login")}
      />

      {/* ================= HERO SLIDER ================= */}
      <section className="relative h-[600px] w-full group">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-full w-full bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative max-w-7xl mx-auto px-6 w-full text-white text-center md:text-left">
                  <div className="max-w-2xl space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black leading-tight uppercase tracking-tighter">
                      {slide.title}
                    </h1>
                    <p className="text-xl font-medium text-gray-200">
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={slide.action}
                      className="bg-[#FF8C00] hover:bg-orange-600 text-white px-10 py-4 rounded-full font-black transition-all shadow-xl uppercase text-sm tracking-widest"
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ================= HELPING YOU FIND SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/garden-city.jpg"
                className="rounded-3xl h-64 w-full object-cover shadow-lg"
                alt="img1"
              />
              <img
                src="/modern-country-houses-construction.jpg"
                className="rounded-3xl h-80 w-full object-cover shadow-lg"
                alt="img2"
              />
            </div>
            <div className="pt-12 space-y-4">
              <img
                src="/aerial-view-new-houses-bridgwater-somerset-uk.jpg"
                className="rounded-3xl h-80 w-full object-cover shadow-lg"
                alt="img3"
              />
              <img
                src="/Tatu city 1.jpeg"
                className="rounded-3xl h-64 w-full object-cover shadow-lg"
                alt="img4"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-slate-900" />
                <span className="text-sm font-black uppercase tracking-widest text-blue-600">
                  Reliable Connections
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Helping You Find <br />
                <span className="text-blue-600">Trusted Homes</span> Nearby
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Maskani Homes is a reliable platform connecting hunters with
              verified owners. We make it easy to discover your next stay
              through practical, trusted connections.
            </p>
            {!isLoggedIn && (
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => openSignup("hunter")}
                  className="bg-[#0a192f] text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
                >
                  Register as Hunter
                </button>
                <a
                  href="mailto:management@maskani.co.ke"
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all no-underline flex items-center gap-2"
                >
                  ✉ Email Agent
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC FEATURED PROPERTY SECTION ================= */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 bg-slate-50 rounded-[3rem] mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-xl font-serif italic text-gray-500">
                  Featured: {featuredListings[0].location}
                </h2>
                <h3 className="text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                  Modern Homes with <br />
                  <span className="text-orange-600">Timeless Comfort</span>
                </h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {featuredListings[0].short_description}
              </p>
              <button
                onClick={() =>
                  navigate(`/properties/${featuredListings[0].id}`)
                }
                className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                View Details - KSh {featuredListings[0].rent.toLocaleString()}
              </button>
            </div>
            <div className="relative order-1 lg:order-2">
              <img
                src={
                  featuredListings[0].pictures?.[0]?.image_url ||
                  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"
                }
                className="rounded-[3rem] shadow-2xl relative z-10 w-full h-[450px] object-cover"
                alt="Modern Home"
              />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-100 rounded-full -z-0" />
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVICE CARDS ================= */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">
              Our Professional Edge
            </h2>
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              How We Are Different
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#e2edf3] p-10 rounded-3xl space-y-6 hover:shadow-xl transition-all">
              <Zap className="text-blue-900" size={40} />
              <h4 className="text-2xl font-black text-blue-900">
                Handle Any Task
              </h4>
              <ul className="space-y-4 text-blue-800/80 font-medium text-sm">
                <li>• Marketing efforts structured to minimize vacancy</li>
                <li>• Comprehensive signage and social media listings</li>
                <li>• Attract highly-qualified tenants on time</li>
              </ul>
            </div>
            <div className="bg-[#003845] p-10 rounded-3xl space-y-6 text-white hover:shadow-xl transition-all">
              <FileBarChart className="text-orange-400" size={40} />
              <h4 className="text-2xl font-black">Accurate Reporting</h4>
              <ul className="space-y-4 text-gray-300 font-medium text-sm">
                <li>• Timely operating statements provided monthly</li>
                <li>• Reports online or via email</li>
                <li>• Full transparency on property performance</li>
              </ul>
            </div>
            <div className="bg-[#d97324] p-10 rounded-3xl space-y-6 text-white hover:shadow-xl transition-all">
              <TrendingDown className="text-white" size={40} />
              <h4 className="text-2xl font-black">Expense Reduction</h4>
              <ul className="space-y-4 text-orange-100 font-medium text-sm">
                <li>• Aggressive energy and water conservation</li>
                <li>• Renegotiation of service contracts annually</li>
                <li>• Competitive bidding for large projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 space-y-6 text-left">
            <h3 className="text-4xl font-black text-slate-900 uppercase leading-none tracking-tighter">
              Find Homes <br />
              <span className="text-orange-600">On The Map</span>
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Browse neighborhoods visually. We've mapped out the best verified
              homes across Nairobi and beyond.
            </p>
          </div>
          <div className="md:w-2/3 h-[450px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.16016733224!2d36.76400345!3d-1.2863892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="bg-[#0a192f] py-20 text-white rounded-[4rem] mx-6 mb-12 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <h3 className="text-6xl font-black text-orange-500 tracking-tighter">
              <Counter end={540} suffix="+" />
            </h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Verified Realtors
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-6xl font-black text-blue-400 tracking-tighter">
              <Counter end={12} suffix="k+" />
            </h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Happy Hunters
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-6xl font-black text-green-400 tracking-tighter">
              24/7
            </h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Support Live
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
