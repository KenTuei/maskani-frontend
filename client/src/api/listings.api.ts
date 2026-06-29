// src/api/listings.api.ts

import API from "./axios";

export const getListings = () => {
  return API.get("/listings");
};

export const getAdminListings = () => {
  return API.get("/admin/listings");
};