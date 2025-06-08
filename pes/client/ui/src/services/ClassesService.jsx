// frontend/src/services/ClassesService.jsx
import api from '../config/APIConfig.jsx'

const ClassesService = {
  getAll: async () => {
    const response = await api.get('/class');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/class/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/class', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/class/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/class/${id}`);
    return response.data;
  }
};

export default ClassesService;