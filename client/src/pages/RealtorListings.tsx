"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Home,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  ToggleLeft,
  ToggleRight,
  MapPin,
} from "lucide-react";
import { cn } from "../utils/cn";
import axios from "axios";

interface Property {
  id: string;
  title: string;
  location: string;
  is_approved: boolean;
  is_available: boolean;
  views: number;
  price?: number;
  images?: string[];
}

const RealtorListings = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "taken">(
    "all",
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/listings/my-listings",
        { headers },
      );
      // Ensure is_available defaults to true if not present
      const data = res.data.map((p: any) => ({ is_available: true, ...p }));
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (prop: Property) => {
    setTogglingId(prop.id);
    try {
      await axios.patch(
        `http://127.0.0.1:5000/listings/${prop.id}`,
        { is_available: !prop.is_available },
        { headers },
      );
      setProperties((prev) =>
        prev.map((p) =>
          p.id === prop.id ? { ...p, is_available: !p.is_available } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    setDeletingId(id);
    try {
      await axios.delete(`http://127.0.0.1:5000/listings/${id}`, { headers });
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete listing:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = properties
    .filter((p) => {
      if (filter === "active") return p.is_approved && p.is_available;
      if (filter === "pending") return !p.is_approved;
      if (filter === "taken") return p.is_approved && !p.is_available;
      return true;
    })
    .filter(
      (p) =>
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const counts = {
    all: properties.length,
    active: properties.filter((p) => p.is_approved && p.is_available).length,
    pending: properties.filter((p) => !p.is_approved).length,
    taken: properties.filter((p) => p.is_approved && !p.is_available).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/realtor-dash")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                My Properties
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {counts.all} total · {counts.active} active · {counts.pending}{" "}
                pending
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/realtor-dash/add")}
            className="flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-orange-200"
          >
            <Plus size={15} /> Add Property
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* ── Filters + Search ── */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Tab filters */}
          <div className="flex bg-white border border-gray-200 p-1 rounded-2xl shadow-sm gap-1">
            {(["all", "active", "pending", "taken"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                  filter === tab
                    ? "bg-[#FF8C00] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-gray-50",
                )}
              >
                {tab === "active" && <CheckCircle size={11} />}
                {tab === "pending" && <Clock size={11} />}
                {tab === "taken" && <XCircle size={11} />}
                {tab} <span className="opacity-70">({counts[tab]})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 ring-orange-400/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* ── Listings ── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-gray-100 h-28 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((prop) => (
              <PropertyCard
                key={prop.id}
                prop={prop}
                onEdit={() => navigate(`/realtor-dash/add?edit=${prop.id}`)}
                onDelete={() => handleDelete(prop.id)}
                onToggle={() => handleToggleAvailability(prop)}
                isToggling={togglingId === prop.id}
                isDeleting={deletingId === prop.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home size={28} className="text-[#FF8C00]" />
            </div>
            <p className="text-slate-400 font-bold text-sm">
              No properties found.
            </p>
            <button
              onClick={() => navigate("/realtor-dash/add")}
              className="mt-4 px-6 py-2.5 bg-[#FF8C00] text-white rounded-xl text-sm font-bold hover:bg-[#e67e00] transition"
            >
              Add Your First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Property Card ── */
const PropertyCard = ({
  prop,
  onEdit,
  onDelete,
  onToggle,
  isToggling,
  isDeleting,
}: {
  prop: Property;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isToggling: boolean;
  isDeleting: boolean;
}) => {
  const statusConfig = prop.is_approved
    ? prop.is_available
      ? {
          label: "Active",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
        }
      : {
          label: "Taken",
          bg: "bg-red-50",
          text: "text-red-500",
          dot: "bg-red-500",
        }
    : {
        label: "Pending Review",
        bg: "bg-amber-50",
        text: "text-amber-600",
        dot: "bg-amber-500",
      };

  return (
    <div
      className={cn(
        "group bg-white rounded-3xl border transition-all hover:shadow-lg",
        prop.is_available
          ? "border-gray-200 hover:border-orange-200"
          : "border-red-100",
      )}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-0">
        {/* Thumbnail */}
        <div className="w-full sm:w-36 h-32 sm:h-auto bg-gray-100 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none flex items-center justify-center overflow-hidden shrink-0">
          {prop.images && prop.images[0] ? (
            <img
              src={prop.images[0]}
              alt={prop.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Home size={28} className="text-gray-300" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="font-black text-base tracking-tight group-hover:text-[#FF8C00] transition-colors truncate">
                {prop.title}
              </h3>
              <span
                className={cn(
                  "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase",
                  statusConfig.bg,
                  statusConfig.text,
                )}
              >
                <span
                  className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)}
                />
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
              <MapPin size={11} />
              <span>{prop.location}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="font-black text-[#FF8C00]">
                KSh {prop.price ? prop.price.toLocaleString() : "—"}/mo
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {prop.views || 0} views
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Toggle availability (only for approved listings) */}
            {prop.is_approved && (
              <button
                onClick={onToggle}
                disabled={isToggling}
                title={
                  prop.is_available ? "Mark as Taken" : "Mark as Available"
                }
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all border",
                  prop.is_available
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "border-orange-200 bg-orange-50 text-[#FF8C00] hover:bg-orange-100",
                  isToggling && "opacity-50 cursor-not-allowed",
                )}
              >
                {isToggling ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : prop.is_available ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
                <span className="hidden sm:inline">
                  {prop.is_available ? "Available" : "Taken"}
                </span>
              </button>
            )}

            {/* Edit */}
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-[#FF8C00] hover:text-white text-slate-600 rounded-2xl text-xs font-bold transition-all border border-transparent hover:border-orange-200"
              title="Edit listing"
            >
              <Edit3 size={15} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* Delete */}
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-2xl text-xs font-bold transition-all border border-red-100"
              title="Delete listing"
            >
              {isDeleting ? (
                <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtorListings;
