import axiosInstance from '../utils/axiosInstance';

export const getUserAddresses = async () => {
  const res = await axiosInstance.get('/api/address');
  return res.data;
};

export const addUserAddress = async (payload) => {
  const res = await axiosInstance.post('/api/address', payload);
  return res.data;
};

export const setDefaultAddress = async (addressId) => {
  const res = await axiosInstance.put(`/api/address/default/${addressId}`);
  return res.data;
};

export const deleteUserAddress = async (addressId) => {
  const res = await axiosInstance.delete(`/api/address/${addressId}`);
  return res.data;
};
