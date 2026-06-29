// src/api/bookings.api.ts

import API from "./axios";

// create booking
export const createBooking = (data: any) => {
  return API.post("/bookings", data);
};

// get user bookings
export const getMyBookings = () => {
  return API.get("/bookings/me");
};

// get all bookings (admin)
export const getAllBookings = () => {
  return API.get("/admin/bookings");
};

// cancel booking
export const cancelBooking = (id: string) => {
  return API.delete(`/bookings/${id}`);
};