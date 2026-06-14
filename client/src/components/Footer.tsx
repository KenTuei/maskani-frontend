import { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Music2,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#0a192f] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* NEWSLETTER CARD */}
        <div className="bg-gradient-to-r from-[#112240] to-[#0a192f] border border-white/5 rounded-[2rem] p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="text-center md:text-left">
            <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight mb-2">
              Stay in the Loop
            </h3>
            <p className="text-gray-400">
              Get notified the moment a new property hits the market.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-xl">
              <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              <p className="text-green-400 font-bold text-sm">
                You're subscribed!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF8C00] text-white w-full md:w-64"
              />
              <button
                type="submit"
                className="bg-[#FF8C00] hover:bg-orange-600 text-white font-bold p-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>

        {/* FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-white text-2xl font-black tracking-tighter">
              MASKANI<span className="text-[#FF8C00]">PRO</span>
            </h3>
            <p className="text-sm leading-relaxed font-medium">
              Revolutionizing property connections in Nairobi. Quality homes,
              transparent pricing, and a seamless hunting experience.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Instagram, color: "hover:text-pink-500" },
                { Icon: Facebook, color: "hover:text-blue-500" },
                { Icon: Twitter, color: "hover:text-sky-400" },
                { Icon: Music2, color: "hover:text-cyan-400" },
              ].map(({ Icon, color }, i) => (
                <a
                  key={i}
                  href="#"
                  className={`bg-white/5 p-2 rounded-lg transition-all ${color} hover:bg-white/10`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Properties", path: "/properties" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="hover:text-[#FF8C00] transition-colors flex items-center group"
                  >
                    <span className="h-[1px] w-0 bg-[#FF8C00] mr-0 transition-all group-hover:w-3 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">
              Get in Touch
            </h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#FF8C00] shrink-0" />
                <a
                  href="tel:+254714560227"
                  className="hover:text-white transition-colors"
                >
                  +254 714 560 227
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#FF8C00] shrink-0" />
                <a
                  href="mailto:tueituei@maskani.co.ke"
                  className="hover:text-white transition-colors"
                >
                  tueituei@maskani.co.ke
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#FF8C00] shrink-0" />
                <span className="leading-tight">Westlands, Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <h4 className="text-white font-bold mb-4 text-sm">
              Why Maskani Pro?
            </h4>
            <p className="text-xs leading-relaxed text-gray-400">
              We verify every agent and property manager on our platform to
              ensure you never have to worry about your safety or your deposit.
            </p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
              Verified Platform 2026
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            &copy; {new Date().getFullYear()} MASKANI. BUILT FOR KENYA.
          </p>
          <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
