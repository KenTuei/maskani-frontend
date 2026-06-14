import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  BedDouble,
  Bath,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

interface Listing {
  id: number;
  title: string;
  rent: number;
  location: string;
  suburb?: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  pictures: { image_url: string; order: number }[];
  owner: { username: string; full_name: string };
}

const TYPES = ["All", "apartment", "house", "villa", "studio", "penthouse"];
const AREAS = [
  "All Areas",
  "Westlands",
  "Karen",
  "Kilimani",
  "Lavington",
  "Parklands",
  "CBD",
  "Riverside",
  "Ruaka",
  "Kasarani",
];
const BASE = "http://127.0.0.1:5000";

const HunterSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);
  useEffect(() => {
    applyFilters();
  }, [
    query,
    listings,
    selectedType,
    selectedArea,
    minPrice,
    maxPrice,
    minBeds,
  ]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/listings/`);
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...listings];
    if (query.trim())
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          (l.location || "").toLowerCase().includes(query.toLowerCase()) ||
          (l.suburb || "").toLowerCase().includes(query.toLowerCase()),
      );
    if (selectedType !== "All")
      results = results.filter((l) => l.type === selectedType);
    if (selectedArea !== "All Areas")
      results = results.filter(
        (l) =>
          (l.location || "")
            .toLowerCase()
            .includes(selectedArea.toLowerCase()) ||
          (l.suburb || "").toLowerCase().includes(selectedArea.toLowerCase()),
      );
    if (minPrice) results = results.filter((l) => l.rent >= Number(minPrice));
    if (maxPrice) results = results.filter((l) => l.rent <= Number(maxPrice));
    if (minBeds) results = results.filter((l) => l.bedrooms >= Number(minBeds));
    setFiltered(results);
  };

  const clearFilters = () => {
    setSelectedType("All");
    setSelectedArea("All Areas");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("");
  };

  const activeFilterCount = [
    selectedType !== "All",
    selectedArea !== "All Areas",
    minPrice,
    maxPrice,
    minBeds,
  ].filter(Boolean).length;
  const hasSearched = query.trim().length > 0 || activeFilterCount > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/hunter-dash")}
            className="p-2 hover:bg-gray-100 rounded-xl transition text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-black tracking-tight uppercase text-slate-900">
              Search Properties
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Find your perfect home
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by location, title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#FF8C00] outline-none font-medium text-sm bg-white"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-4 rounded-2xl border-2 font-bold text-sm transition ${showFilters || activeFilterCount > 0 ? "border-[#FF8C00] bg-orange-50 text-[#FF8C00]" : "border-gray-200 bg-white text-slate-600 hover:border-gray-300"}`}
          >
            <SlidersHorizontal size={16} />
            {activeFilterCount > 0 && (
              <span className="bg-[#FF8C00] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                label: "Type",
                value: selectedType,
                onChange: setSelectedType,
                options: TYPES,
              },
              {
                label: "Area",
                value: selectedArea,
                onChange: setSelectedArea,
                options: AREAS,
              },
            ].map(({ label, value, onChange, options }) => (
              <div key={label}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {label}
                </label>
                <div className="relative">
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium pr-8 focus:outline-none focus:border-[#FF8C00]"
                  >
                    {options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Min Beds
              </label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={minBeds}
                onChange={(e) => setMinBeds(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Min Rent (KES)
              </label>
              <input
                type="number"
                placeholder="20,000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Max Rent (KES)
              </label>
              <input
                type="number"
                placeholder="150,000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            {activeFilterCount > 0 && (
              <div className="col-span-2 md:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {hasSearched && !loading && (
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filtered.length}{" "}
            {filtered.length === 1 ? "property" : "properties"} found
          </p>
        )}

        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 animate-pulse flex gap-4"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="bg-white p-16 rounded-3xl text-center border-2 border-dashed border-gray-200">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#FF8C00]" />
            </div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm mb-2">
              Search for Properties
            </p>
            <p className="text-slate-400 font-medium text-xs">
              Enter a location or property name above to get started
            </p>
            <div className="flex justify-center gap-6 mt-8 text-slate-300">
              <MapPin size={20} />
              <BedDouble size={20} />
              <Bath size={20} />
            </div>
          </div>
        )}

        {!loading && hasSearched && filtered.length === 0 && (
          <div className="bg-white p-16 rounded-3xl text-center border-2 border-dashed border-gray-200">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#FF8C00]" />
            </div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm mb-2">
              No Properties Found
            </p>
            <p className="text-slate-400 font-medium text-xs">
              Try adjusting your search or filters
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#FF8C00] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && hasSearched && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((p) => {
              const thumb = p.pictures?.sort((a, b) => a.order - b.order)[0]
                ?.image_url;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/listings/${p.id}`)}
                  className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 hover:border-[#FF8C00] hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BedDouble size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-slate-900 text-sm line-clamp-1">
                        {p.title}
                      </h3>
                      <span className="text-[10px] bg-orange-50 text-[#FF8C00] font-black uppercase px-2 py-0.5 rounded-full shrink-0 capitalize">
                        {p.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                      <MapPin size={11} />
                      <span className="truncate">
                        {p.suburb ? `${p.suburb}, ` : ""}
                        {p.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs mt-2">
                      <span className="flex items-center gap-1">
                        <BedDouble size={11} /> {p.bedrooms ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={11} /> {p.bathrooms ?? "—"}
                      </span>
                    </div>
                    <p className="text-[#FF8C00] font-black text-base mt-2">
                      KES {p.rent.toLocaleString()}
                      <span className="text-slate-400 font-medium text-xs">
                        /mo
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HunterSearch;
