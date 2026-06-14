import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Handshake,
  Users,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Zap,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 1. HERO SECTION */}
      <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-[#0a192f] text-white">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?q=80&w=2070"
            alt="Maskani Background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 px-6 text-center">
          <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.3em] text-[#FF8C00]">
            Welcome to Maskani Pro
          </span>
          <h1 className="mb-6 text-5xl font-black md:text-7xl tracking-tight leading-none">
            Your Home, <br className="hidden md:block" /> Our Priority.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl font-medium mb-10">
            We are bridging the gap between property seekers and providers
            through transparency and technology.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/login"
              className="rounded-xl bg-[#FF8C00] px-10 py-4 font-black text-white shadow-xl hover:bg-orange-500 transition-all active:scale-95 text-center"
            >
              ADD HOUSE
            </Link>
            <Link
              to="/login"
              className="rounded-xl border-2 border-white/30 backdrop-blur-sm px-10 py-4 font-black text-white hover:bg-white hover:text-[#0a192f] transition-all active:scale-95 text-center"
            >
              HOUSE HUNT
            </Link>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 h-1.5 w-16 bg-[#FF8C00]"></div>
              <h2 className="mb-8 text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Bridging Property & <br /> People Connections
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                At Maskani Pro, we recognized a critical gap in the real estate
                ecosystem. House hunters struggled to find verified listings,
                while property owners sought to reach genuine clients.
              </p>
              <div className="mt-12 flex gap-12 border-t border-gray-100 pt-10">
                <div>
                  <p className="text-4xl font-black text-[#FF8C00]">500+</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Listings
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-[#FF8C00]">100+</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Agents
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <img
                src="/Tatu city 3.jpeg"
                className="h-80 w-full rounded-[2rem] object-cover shadow-2xl"
                alt="Modern Apartment"
              />
              <img
                src="/zac-wolff-R2QCr4LX0a0-unsplash.jpg"
                className="h-80 w-full rounded-[2rem] object-cover shadow-2xl pt-12"
                alt="Executive Studio"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="group rounded-[2.5rem] border border-white bg-white p-12 shadow-xl shadow-slate-200/50">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#FF8C00]">
              <Target size={32} />
            </div>
            <h3 className="mb-4 text-3xl font-black text-slate-900">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To bridge the gap between property seekers and providers, ensuring
              accessibility is seamless, efficient, and reliable for everyone.
            </p>
          </div>

          <div className="group rounded-[2.5rem] border border-white bg-white p-12 shadow-xl shadow-slate-200/50">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Eye size={32} />
            </div>
            <h3 className="mb-4 text-3xl font-black text-slate-900">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To create a future where everyone can easily find and partner with
              verified property managers through collaboration and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="py-24 px-6 text-center">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <div className="mb-2 flex justify-center items-center gap-2">
              <div className="h-[2px] w-8 bg-blue-600"></div>
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
                What Drives Us
              </span>
              <div className="h-[2px] w-8 bg-blue-600"></div>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Heart className="text-red-500" />,
                bg: "bg-red-50",
                title: "Trust & Safety",
                desc: "Rigorous verification for every listing.",
              },
              {
                icon: <Handshake className="text-blue-500" />,
                bg: "bg-blue-50",
                title: "Support",
                desc: "Fostering a community where everyone wins.",
              },
              {
                icon: <Users className="text-green-500" />,
                bg: "bg-green-50",
                title: "Impact",
                desc: "Making quality housing accessible to all.",
              },
              {
                icon: <ShieldCheck className="text-purple-500" />,
                bg: "bg-purple-50",
                title: "Integrity",
                desc: "Transparency and honest communication.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-gray-100 p-10 bg-white transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div
                  className={`mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${value.bg}`}
                >
                  {value.icon}
                </div>
                <h4 className="mb-4 text-xl font-black text-slate-900">
                  {value.title}
                </h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="relative w-full lg:w-1/2">
              <div className="relative h-[550px] w-full overflow-hidden rounded-[3rem] shadow-2xl">
                <img
                  src="/kenny-murgor-E_0kbeQbyV0-unsplash.jpg"
                  alt="Luxury Home"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute bottom-10 left-10 right-10 md:right-auto md:w-80 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
                <h4 className="text-[#0a192f] font-bold mb-4 text-lg">
                  Key Advantages
                </h4>
                <ul className="space-y-4">
                  {[
                    "Verified Listers Only",
                    "Zero Hidden Charges",
                    "Real-time Site Visits",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-bold text-gray-700"
                    >
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <span className="text-[#FF8C00] font-bold uppercase tracking-widest text-xs">
                  The Maskani Advantage
                </span>
                <h2 className="text-5xl font-black text-[#0a192f] leading-tight tracking-tight">
                  Your Trusted <br />{" "}
                  <span className="text-[#FF8C00]">Property Hub</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We bridge the gap between dream homes and reality. Maskani Pro
                  utilizes advanced vetting to ensure your next move is your
                  best move.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: <Building2 className="text-blue-600" />,
                    bg: "bg-blue-50",
                    title: "Premium Network",
                    desc: "Access to Nairobi's finest apartments and executive studios.",
                  },
                  {
                    icon: <ShieldCheck className="text-green-600" />,
                    bg: "bg-green-50",
                    title: "Vetted Managers",
                    desc: "Every property owner undergoes a strict 5-point verification.",
                  },
                  {
                    icon: <Zap className="text-purple-600" />,
                    bg: "bg-purple-50",
                    title: "Fast Booking",
                    desc: "Find a house and schedule a visit in under 5 minutes.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg} transition-all group-hover:scale-110`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#0a192f] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP TEAM */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#FF8C00]">
              The Minds Behind Maskani
            </span>
            <h2 className="mt-4 text-5xl font-black text-slate-900 tracking-tight">
              Meet Our Leadership
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Ken",
                role: "Chief Technology Officer",
                img: "/Kenny.jpeg",
              },
              {
                name: "Derick",
                role: "Founder & CEO ",
                img: "/Der.jpeg",
              },
              {
                name: "Karanja",
                role: "Chief Executive Officer",
                img: "/mustafa-omar-Zkao_QBEjk8-unsplash.jpg",
              },
              {
                name: "Mercy.",
                role: "Operations Lead",
                img: "/murad-swaleh-7tDidSXbgD8-unsplash.jpg",
              },
            ].map((member, i) => (
              <div key={i} className="group text-center">
                <div className="relative mb-6 overflow-hidden rounded-[2.5rem] bg-white aspect-[4/5] shadow-lg">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">
                  {member.name}
                </h4>
                <p className="text-[#FF8C00] font-bold text-xs uppercase tracking-widest">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="bg-[#0a192f] py-24 px-6 text-center text-white">
        <div className="relative z-10">
          <h2 className="mb-8 text-4xl font-black md:text-5xl tracking-tight leading-tight">
            Ready to Find Your <br className="md:hidden" />{" "}
            <span className="text-[#FF8C00]">Dream Space?</span>
          </h2>
          <p className="mb-12 text-gray-400 text-lg max-w-xl mx-auto">
            Join thousands of Kenyans finding verified homes every day with the
            most trusted platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/login"
              className="rounded-xl bg-[#FF8C00] px-10 py-4 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-500 transition-all active:scale-95 text-center"
            >
              ADD HOUSE
            </Link>
            <Link
              to="/login"
              className="rounded-xl border-2 border-white/20 px-10 py-4 font-black text-white hover:bg-white hover:text-[#0a192f] transition-all active:scale-95 text-center"
            >
              HOUSE HUNT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
