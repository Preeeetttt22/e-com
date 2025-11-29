import axiosInstance from "../utils/axiosInstance";

export const createOrder = async (orderData) => {
  const res = await axiosInstance.post("/api/orders", orderData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/api/orders/my-orders");
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
  return res.data;
};