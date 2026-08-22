import api from "./api";

export const registerUser = (userData) => {
    return api.post("/users/register", userData);
};

export const loginUser = (userData) => {
    return api.post("/users/login", userData);
};

export const loginAdmin = (userData) => {
    return api.post("/users/admin/login", userData);
};

export const logoutUser = () => {
    return api.get("/users/logout");
};

export const getUserProfile = () => {
    return api.get("/users/profile");
};