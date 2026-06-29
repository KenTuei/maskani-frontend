import API from "./axios";

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/login", data);
};

export const signupUser = (data: any) => {
  return API.post("/signup", data);
};