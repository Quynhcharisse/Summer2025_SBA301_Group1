import axiosClient from "../config/APIConfig.jsx";

const ClassesService = {
  getAll: async () => {
    const response = await axiosClient.get('/class');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/class/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/class', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/class/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosClient.delete(`/class/${id}`);
    return response.data;
  }
};

export default ClassesService;