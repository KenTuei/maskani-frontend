import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// FIX: Added 'export' to the interface so Bookings.tsx can use it
export interface Booking {
  id: string;
  propertyId: number;
  propertyName: string;
  price: string;
  date: string;
  time: string;
  status: 'requested' | 'approved' | 'paid' | 'completed' | 'cancelled';
  hunterId: string;
  realtorId: number;
  timestamp: number;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
}

// FIX: Added 'export' to the hook
export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [
        {
          id: "BK-101",
          propertyId: 1,
          propertyName: "Modern 3BR Westlands",
          price: "KES 85,000",
          date: "2024-12-25",
          time: "10:00 AM",
          status: "requested",
          hunterId: "hunter_1",
          realtorId: 101,
          timestamp: Date.now(),
        },
        {
            id: "BK-102",
            propertyId: 2,
            propertyName: "Executive Studio Kilimani",
            price: "KES 45,000",
            date: "2024-12-26",
            time: "02:00 PM",
            status: "approved",
            hunterId: "hunter_1",
            realtorId: 101,
            timestamp: Date.now(),
          }
      ],
      addBooking: (newBooking) => 
        set((state) => ({ bookings: [newBooking, ...state.bookings] })),
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === id ? { ...b, status } : b
          ),
        })),
    }),
    { name: 'maskani-bookings-storage' } 
  )
);