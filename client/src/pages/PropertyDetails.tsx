import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  X,
  Bed,
  Bath,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/listings/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-slate-300 uppercase tracking-widest">
        Loading...
      </div>
    );

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl mb-4 bg-slate-100 aspect-square">
              <img
                src={
                  property.pictures?.[activeImage]?.image_url ||
                  "https://via.placeholder.com/800"
                }
                className="w-full h-full object-cover transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {property.pictures?.map((pic: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === index ? "border-orange-500 scale-95" : "border-transparent opacity-50"}`}
                >
                  <img
                    src={pic.image_url}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold mb-8">
              <MapPin size={18} className="text-orange-500" />
              {property.location}, {property.suburb}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <Bed className="text-blue-500" size={20} />
                <span className="font-black text-slate-700">
                  {property.bedrooms} Beds
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <Bath className="text-emerald-500" size={20} />
                <span className="font-black text-slate-700">
                  {property.bathrooms} Baths
                </span>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-slate-500 leading-relaxed font-medium text-lg">
                {property.short_description}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Monthly Rent
              </p>
              <div className="text-5xl font-black text-slate-900 mb-8">
                KSh {property.rent?.toLocaleString()}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter text-center">
              Select Date
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Request Sent!");
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              <input
                type="date"
                required
                className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none focus:ring-2 ring-orange-500"
              />
              <input
                type="time"
                required
                className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none focus:ring-2 ring-orange-500"
              />
              <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
