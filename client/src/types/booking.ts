// src/types/booking.ts

// Represents a single booking made by a user
export interface Booking {
  id: string;                 // Booking ID
  userId: string;             // ID of the user who made the booking
  userName: string;           // Name of the user
  propertyId: string;         // ID of the property booked
  propertyName: string;       // Name or title of the property
  date: string;               // Booking date (YYYY-MM-DD)
  time: string;               // Booking time (HH:MM)
  status: 'requested' | 'approved' | 'declined' | 'completed'; // Current booking status
  createdAt?: string;         // Optional: when the booking was created
  updatedAt?: string;         // Optional: when the booking was last updated
}