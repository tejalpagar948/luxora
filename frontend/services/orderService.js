import api from "./api";

export const getUserOrders = () => {
    return api.get("/orders");
};

export const getUserOrderDetails = (orderId) => {
    return api.get(`/orders/${orderId}`);
};

export const cancelOrder = (orderId, reason) => {
    return api.post(`/orders/${orderId}/cancel`, { reason });
};
