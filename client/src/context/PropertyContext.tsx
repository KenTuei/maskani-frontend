import { createContext, useContext, useState, type ReactNode } from "react";

export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  floor: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  description: string;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Modern 3BR Apartment in Westlands",
      price: "KSh 85,000",
      location: "Westlands, Nairobi",
      floor: "3rd Floor",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      ],
      amenities: ["Parking", "24/7 Security", "Swimming Pool"],
      description: "Beautiful modern apartment in the heart of Westlands.",
    },
  ]);

  const addProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context)
    throw new Error("useProperties must be used within a PropertyProvider");
  return context;
};
