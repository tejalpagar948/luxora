import api from "./api";

export const getAdminOrders = (params) => {
  return api.get("/owners/orders", { params });
};

export const updateOrderStatus = (orderId, data) => {
  return api.put(`/owners/orders/${orderId}/status`, data);
};
