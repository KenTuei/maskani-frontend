import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Move,
} from "lucide-react";
import axios from "axios";

const HunterListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minBedrooms, setMinBedrooms] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/listings/");
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching marketplace:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredProperties = listings.filter((property: any) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPropType =
      propertyType === "all" || property.type === propertyType;
    const matchesPrice = property.rent <= maxPrice;
    const matchesBeds = property.bedrooms >= minBedrooms;

    return matchesSearch && matchesPropType && matchesPrice && matchesBeds;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-slate-400 uppercase tracking-widest animate-pulse">
        Updating Marketplace...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Find Your Next Home
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Discover premium listings across Kenya
          </p>
        </div>

        {/* COMPACT FILTER BAR */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-2 mb-10 border border-slate-100 sticky top-4 z-40">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent rounded-3xl outline-none font-bold text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="h-8 w-px bg-slate-100 hidden lg:block" />

            <div className="flex items-center gap-2 px-4 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <select
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="all">Any Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
              </select>

              <select
                onChange={(e) => setMinBedrooms(parseInt(e.target.value))}
                className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="0">Beds</option>
                <option value="1">1+ Bed</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
              </select>

              <div className="flex flex-col min-w-[120px] px-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                  Max: {maxPrice.toLocaleString()}
                </span>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property: any) => (
            <div
              key={property.id}
              className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden border border-slate-50"
            >
              <div className="relative h-64 overflow-hidden">
                <Link to={`/properties/${property.id}`}>
                  <img
                    src={
                      property.pictures?.[0]?.image_url ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-2xl font-black text-sm shadow-sm">
                  KSh {property.rent?.toLocaleString()}
                </div>
              </div>

              <div className="p-7">
                <h3 className="font-black text-xl text-slate-900 mb-1 group-hover:text-orange-600 transition-colors tracking-tight">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase mb-6">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />{" "}
                  {property.location}
                </div>

                <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-black text-slate-700">
                      {property.bedrooms || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-slate-700">
                      {property.bathrooms || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Move className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                      {property.type}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/properties/${property.id}`}
                  className="w-full block text-center py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HunterListings;
