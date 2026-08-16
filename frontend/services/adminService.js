import api from "./api";

export const getAdminOrders = () => {
  return api.get("/owners/orders");
};

export const updateOrderStatus = (orderId, data) => {
  return api.put(`/owners/orders/${orderId}/status`, data);
};
