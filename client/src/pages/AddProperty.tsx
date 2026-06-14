"use client";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Home,
  MapPin,
  Building,
  Shield,
  Check,
  ChevronRight,
  LayoutGrid,
  BedDouble,
  Bath,
  Trees,
  Layers,
  PawPrint,
  Car,
  Wind,
  Loader2,
} from "lucide-react";
import { cn } from "../utils/cn";
import axios from "axios";

const API = "http://127.0.0.1:5000";

const AddProperty = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    rent: "",
    short_description: "",
    location: "",
    suburb: "",
    house_number: "",
    floor: "",
    bedrooms: "",
    bathrooms: "",
    selfContained: false,
    type: "apartment",
    public: true,
    amenities: [] as string[],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { id: "apartment", label: "Apartment" },
    { id: "house", label: "House" },
    { id: "villa", label: "Villa" },
    { id: "studio", label: "Studio" },
    { id: "penthouse", label: "Penthouse" },
  ];

  const amenityList = [
    { name: "CCTV / Security", icon: <Shield size={16} /> },
    { name: "Parking", icon: <Car size={16} /> },
    { name: "Gym", icon: <Building size={16} /> },
    { name: "Kids Play Area", icon: <Home size={16} /> },
    { name: "Balcony", icon: <Wind size={16} /> },
    { name: "Elevator", icon: <Layers size={16} /> },
    { name: "Pet Friendly", icon: <PawPrint size={16} /> },
    { name: "Rooftop Deck", icon: <Trees size={16} /> },
    { name: "Unfurnished", icon: <BedDouble size={16} /> },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const slots = 10 - imageFiles.length;
    const newFiles = Array.from(files).slice(0, slots);
    newFiles.forEach((file) => {
      // Preview
      const reader = new FileReader();
      reader.onload = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
      // Keep real File object for FormData
      setImageFiles((prev) => [...prev, file]);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (name: string) =>
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));

  const handleSave = async () => {
    setError("");
    if (
      !formData.title ||
      !formData.rent ||
      !formData.location ||
      !formData.short_description
    ) {
      setError(
        "Please fill in required fields: Title, Rent, Location and Description.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        // PUT is JSON only per backend
        await axios.put(
          `${API}/listings/${editId}`,
          {
            title: formData.title,
            rent: parseFloat(formData.rent),
            short_description: formData.short_description,
            location: formData.location,
            suburb: formData.suburb,
            house_number: formData.house_number,
            floor: formData.floor,
            public: formData.public,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        // POST uses multipart/form-data because of image files
        const form = new FormData();
        form.append("title", formData.title);
        form.append("rent", formData.rent);
        form.append("short_description", formData.short_description);
        form.append("location", formData.location);
        form.append("suburb", formData.suburb);
        form.append("house_number", formData.house_number);
        form.append("floor", formData.floor);
        form.append("public", String(formData.public));
        form.append("type", formData.type);
        form.append("bedrooms", formData.bedrooms);
        form.append("bathrooms", formData.bathrooms);
        form.append("self_contained", String(formData.selfContained));
        form.append("amenities", JSON.stringify(formData.amenities));

        // Append real File objects — backend uploads these to Firebase
        imageFiles.forEach((file) => form.append("images", file));

        await axios.post(`${API}/listings/`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/realtor-dash/my-listings");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to save listing. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pb-20">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase text-slate-900">
              {editId ? "Edit Property" : "List Your Property"}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {editId
                ? "Update listing details"
                : "Fill in details · Images upload to Firebase"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-2">
            <X size={15} className="shrink-0" /> {error}
          </div>
        )}

        {/* ── Photos ── */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Property Photos ({imagePreviews.length}/10)
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Photos are uploaded securely to Firebase Storage.
          </p>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.length < 10 && (
              <label className="w-28 h-28 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FF8C00] hover:bg-orange-50 transition group shrink-0">
                <Upload
                  size={18}
                  className="text-gray-400 group-hover:text-[#FF8C00]"
                />
                <span className="text-[8px] font-black uppercase text-gray-400 group-hover:text-[#FF8C00]">
                  Add Photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="w-28 h-28 rounded-2xl relative overflow-hidden group border border-gray-200 shrink-0"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category ── */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xs font-black text-[#FF8C00] uppercase tracking-widest flex items-center gap-2 mb-4">
            <LayoutGrid size={13} /> Property Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFormData({ ...formData, type: cat.id })}
                className={cn(
                  "px-5 py-2.5 rounded-2xl font-bold text-sm transition border-2",
                  formData.type === cat.id
                    ? "bg-[#FF8C00] border-[#FF8C00] text-white shadow-md shadow-orange-200"
                    : "bg-gray-50 border-transparent text-slate-500 hover:bg-gray-100",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── General Details ── */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-[#FF8C00] uppercase tracking-widest flex items-center gap-2">
            <Home size={13} /> General Details
          </h3>
          <input
            type="text"
            placeholder="Property Title (e.g. Executive 2BR Suite) *"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            placeholder="Short description — mention key features, nearby landmarks *"
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition resize-none"
            value={formData.short_description}
            onChange={(e) =>
              setFormData({ ...formData, short_description: e.target.value })
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">
                KES
              </span>
              <input
                type="number"
                placeholder="Rent per month *"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition"
                value={formData.rent}
                onChange={(e) =>
                  setFormData({ ...formData, rent: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              placeholder="Floor No. (e.g. 3)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition"
              value={formData.floor}
              onChange={(e) =>
                setFormData({ ...formData, floor: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <BedDouble
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition appearance-none"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: e.target.value })
                }
              >
                <option value="">Number of Bedrooms</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Bedroom{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Bath
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition appearance-none"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: e.target.value })
                }
              >
                <option value="">Number of Bathrooms</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Bathroom{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Self Contained Toggle */}
          <button
            onClick={() =>
              setFormData({
                ...formData,
                selfContained: !formData.selfContained,
              })
            }
            className={cn(
              "flex items-center justify-between w-full px-5 py-4 rounded-2xl border-2 transition font-bold text-sm",
              formData.selfContained
                ? "bg-orange-50 border-[#FF8C00] text-[#FF8C00]"
                : "bg-gray-50 border-gray-200 text-slate-500",
            )}
          >
            <div className="flex items-center gap-3">
              <Bath size={16} />
              <span>Self Contained Unit</span>
              <span className="text-[10px] font-normal text-slate-400">
                (private bathroom & kitchen)
              </span>
            </div>
            <div
              className={cn(
                "w-10 h-6 rounded-full transition relative shrink-0",
                formData.selfContained ? "bg-[#FF8C00]" : "bg-gray-200",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
                  formData.selfContained ? "right-1" : "left-1",
                )}
              />
            </div>
          </button>
        </div>

        {/* ── Location ── */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-[#FF8C00] uppercase tracking-widest flex items-center gap-2">
            <MapPin size={13} /> Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MapPin
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF8C00]"
              />
              <input
                type="text"
                placeholder="Area / Town (e.g. Mtwapa) *"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              placeholder="Suburb / Estate (e.g. Nyali)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition"
              value={formData.suburb}
              onChange={(e) =>
                setFormData({ ...formData, suburb: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="House / Apartment Number (e.g. A4)"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none font-semibold text-sm focus:ring-2 ring-orange-400/20 focus:border-[#FF8C00] transition"
            value={formData.house_number}
            onChange={(e) =>
              setFormData({ ...formData, house_number: e.target.value })
            }
          />
        </div>

        {/* ── Amenities ── */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xs font-black text-[#FF8C00] uppercase tracking-widest flex items-center gap-2 mb-4">
            <Shield size={13} /> Amenities & Features
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amenityList.map((item) => {
              const active = formData.amenities.includes(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleAmenity(item.name)}
                  className={cn(
                    "flex items-center gap-2 p-4 rounded-2xl border-2 transition font-bold text-xs text-left",
                    active
                      ? "bg-orange-50 border-[#FF8C00] text-[#FF8C00]"
                      : "bg-gray-50 border-transparent text-slate-500 hover:bg-gray-100",
                  )}
                >
                  <span
                    className={active ? "text-[#FF8C00]" : "text-slate-400"}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                  {active && (
                    <Check
                      size={11}
                      className="ml-auto text-[#FF8C00] shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          disabled={isSubmitting}
          onClick={handleSave}
          className="w-full bg-[#FF8C00] hover:bg-[#e67e00] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-200 transition flex justify-center items-center gap-3 active:scale-95 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Uploading to
              server...
            </>
          ) : (
            <>
              {editId ? "Save Changes" : "Submit for Approval"}{" "}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddProperty;
