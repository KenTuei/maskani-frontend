import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

const BASE = "http://127.0.0.1:5000";

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${BASE}/admin/contact`, formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="text-blue-600" />,
      title: "Call Us",
      details: ["+254 714 560 227", "+254 115 728 094"],
    },
    {
      icon: <Mail className="text-emerald-600" />,
      title: "Email Us",
      details: ["kentuei05@gmail.com", "support@maskani.co.ke"],
    },
    {
      icon: <MapPin className="text-orange-600" />,
      title: "Visit Us",
      details: ["Tuei Towers, Kasarani", "Nairobi, Kenya"],
    },
    {
      icon: <Clock className="text-purple-600" />,
      title: "Working Hours",
      details: ["Mon - Fri: 8AM - 6PM", "Sat: 9AM - 2PM"],
    },
  ];

  const faqs = [
    {
      q: "How do I list my property on Maskani?",
      a: "Simply create a Realtor account, click on 'Add Property' in your dashboard, and follow the steps to upload images and details.",
    },
    {
      q: "Is there a fee for house hunters?",
      a: "No, searching and viewing properties on Maskani is completely free for all hunters.",
    },
    {
      q: "How do I verify a listing?",
      a: "Our team manually reviews every listing. Look for the 'Verified' badge on property cards for extra peace of mind.",
    },
    {
      q: "Can I schedule a viewing online?",
      a: "Yes! Use the 'Schedule Visit' button on any property detail page to pick a date and time that works for you.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HEADER */}
      <div className="bg-[#0F172A] text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 tracking-tighter text-white">
            Contact Our Team
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Have questions about a listing or want to partner with us? Send us a
            message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16">
        {/* CONTACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h3 className="font-black text-slate-900 mb-3 uppercase tracking-widest text-xs">
                {method.title}
              </h3>
              {method.details.map((line, i) => (
                <p key={i} className="text-slate-500 font-bold text-sm">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* FORM & MAP */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div className="relative">
            {!isSubmitted ? (
              <div>
                <span className="text-orange-600 font-black uppercase tracking-widest text-[10px] mb-2 block">
                  Send Message
                </span>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                  Drop Us a Line
                </h2>
                <p className="text-slate-400 font-bold mb-10">
                  Fill out the form below and our team will get back to you
                  within 24 hours.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase ml-2">
                        Your Name
                      </label>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase ml-2">
                        Email Address
                      </label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">
                      Subject
                    </label>
                    <input
                      required
                      name="subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">
                      Message
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#0F172A] transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[3rem] p-12 text-center border-4 border-dashed border-emerald-100 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                  Message Sent!
                </h2>
                <p className="text-slate-500 font-bold mb-8 max-w-xs">
                  Thanks for reaching out. We've received your message and will
                  get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all"
                >
                  Send Another
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="rounded-[3rem] overflow-hidden h-[400px] border-8 border-slate-50 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.56454044158!2d36.8911!3d-1.221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f14659b8a07c3%3A0x6b49e3e3b79f64c!2sKasarani%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1646240000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">
                Why Contact Us?
              </h3>
              <div className="space-y-4">
                {[
                  "Quick Response",
                  "Expert Support",
                  "Verified Listings",
                  "Free Consultation",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="font-bold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-slate-200">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-left">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-orange-600 hover:text-white transition-all"
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="pb-24">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-black uppercase tracking-widest text-[10px]">
              FAQ
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-100 transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between group"
                >
                  <span className="font-black text-slate-800 tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180 text-orange-600" : ""}`}
                    size={20}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
