
import axiosClient from "../config/APIConfig.jsx";

const LessonService = {
  getAll: async () => {
    const response = await axiosClient.get('/lesson');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/lesson/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/lesson', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/lesson/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosClient.delete(`/lesson/${id}`);
    return response.data;
  }
};

export default LessonService;