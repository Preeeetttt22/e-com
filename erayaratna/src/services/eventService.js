import axiosInstance from '../utils/axiosInstance';

export const createEvent = async (formData) => {
  const res = await axiosInstance.post('/api/admin/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getAllEvents = async () => {
  const res = await axiosInstance.get('/api/admin/events/all');
  return res.data;
};

export const updateEvent = async (id, formData) => {
  const res = await axiosInstance.put(`/api/admin/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axiosInstance.delete(`/api/admin/events/${id}`);
  return res.data;
};

export const getEventsForHome = async () => {
  const res = await axiosInstance.get('/api/events'); // This fetches only active events sorted by startTime
  return res.data;
};

export const subscribeToEvent = async (eventId, email) => {
  const res = await axiosInstance.post('/api/events/notifications/subscribe', {
    eventId,
    email,
  });
  return res.data;
};

export const getUserSubscriptions = async (email) => {
  const res = await axiosInstance.get(`/api/events/notifications/${email}`);
  return res.data; // should return array of event IDs
};

export const unsubscribeFromEvent = async (eventId, email) => {
  const res = await axiosInstance.post('/api/events/notifications/unsubscribe', {
    eventId,
    email,
  });
  return res.data;
};

export const subscribeToAllEvents = async (email) => {
  const res = await axiosInstance.post('/api/events/notifications/subscribe-all', { email });
  return res.data;
};

export const unsubscribeFromAllEvents = async (email) => {
  const res = await axiosInstance.post('/api/events/notifications/unsubscribe-all', { email });
  return res.data;
};

export const checkAllEventSubscription = async (email) => {
  const res = await axiosInstance.get(`/api/events/notifications/check-all/${email}`);
  return res.data; // { subscribed: true/false }
};
