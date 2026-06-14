import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Home,
  User,
  MessageSquare,
} from "lucide-react";
import axios from "axios";

interface BookingRequest {
  id: number;
  hunter_id: number;
  hunter_name: string;
  hunter_email: string;
  listing_id: number;
  listing_title: string;
  listing_location: string;
  preferred_slots: string[];
  status: "pending" | "approved" | "declined" | "payment_required";
  created_at: string;
}

const BASE = "http://127.0.0.1:5000";

const RealtorRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "declined"
  >("pending");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/bookings/my-requests`, { headers });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: "approve" | "decline") => {
    try {
      await axios.post(`${BASE}/bookings/${id}/${action}`, {}, { headers });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: action === "approve" ? "approved" : "declined" }
            : r,
        ),
      );
    } catch (err) {
      alert("Action failed. Please try again.");
    }
  };

  const filtered =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  const counts = {
    all: requests.length,
    pending: requests.filter(
      (r) => r.status === "pending" || r.status === "payment_required",
    ).length,
    approved: requests.filter((r) => r.status === "approved").length,
    declined: requests.filter((r) => r.status === "declined").length,
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatSlots = (slots: string[]) => {
    if (!slots?.length) return null;
    return slots
      .map((s) =>
        new Date(s).toLocaleDateString("en-KE", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
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
              Requests
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Incoming property enquiries
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Pending",
              icon: Clock,
              color: "text-orange-500",
              bg: "bg-orange-50",
              count: counts.pending,
            },
            {
              label: "Approved",
              icon: CheckCircle,
              color: "text-emerald-500",
              bg: "bg-emerald-50",
              count: counts.approved,
            },
            {
              label: "Rejected",
              icon: XCircle,
              color: "text-red-400",
              bg: "bg-red-50",
              count: counts.declined,
            },
          ].map(({ label, icon: Icon, color, bg, count }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 border border-gray-200 text-center"
            >
              <div
                className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
              >
                <Icon size={18} className={color} />
              </div>
              <p className="text-slate-900 font-black text-lg">{count}</p>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "pending", "approved", "declined"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition whitespace-nowrap ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab}{" "}
              <span
                className={
                  activeTab === tab ? "text-slate-400" : "text-slate-300"
                }
              >
                ({counts[tab]})
              </span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 animate-pulse flex gap-4"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white p-16 rounded-3xl text-center border-2 border-dashed border-gray-200">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Inbox size={24} className="text-[#FF8C00]" />
            </div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm mb-2">
              No Requests Yet
            </p>
            <p className="text-slate-400 font-medium text-xs">
              {activeTab === "all"
                ? "Enquiries from hunters will appear here"
                : `No ${activeTab} requests at the moment`}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-slate-400 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="font-black text-slate-900 text-sm">
                        {req.hunter_name}
                      </h3>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          req.status === "pending" ||
                          req.status === "payment_required"
                            ? "bg-orange-50 text-orange-500"
                            : req.status === "approved"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {req.status === "payment_required"
                          ? "Awaiting Payment"
                          : req.status}
                      </span>
                    </div>

                    {req.hunter_email && (
                      <p className="text-xs text-slate-400 font-medium mb-2">
                        {req.hunter_email}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Home size={11} className="text-[#FF8C00]" />
                        <span className="font-bold">{req.listing_title}</span>
                      </span>
                      {req.listing_location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {req.listing_location}
                        </span>
                      )}
                      <span className="text-slate-300">
                        {formatDate(req.created_at)}
                      </span>
                    </div>

                    {req.preferred_slots?.length > 0 && (
                      <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                        <MessageSquare
                          size={12}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <p className="text-xs text-slate-500">
                          Preferred slots:{" "}
                          <span className="font-semibold">
                            {formatSlots(req.preferred_slots)}
                          </span>
                        </p>
                      </div>
                    )}

                    {(req.status === "pending" ||
                      req.status === "payment_required") && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(req.id, "approve")}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "decline")}
                          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtorRequests;
