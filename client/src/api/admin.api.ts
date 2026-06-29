import API from "./axios";

export const getStats = () => {
  return API.get("/admin/stats");
};

export const getUsers = () => {
  return API.get("/admin/users");
};