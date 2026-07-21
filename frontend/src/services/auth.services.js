import api from "./authInterceptor";

export const loginService = async (data) => {
  return await api.post("/users/login", data);
};
export const getUserService = async () => {
  return await api.get("/users/profile");
};

export const logoutService = async () => {
  return await api.post("/users/logout");
};
 

export const registerService = async (data) => {
  return await api.post("/users/register", data);
}