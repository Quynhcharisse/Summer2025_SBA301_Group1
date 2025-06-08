// frontend/src/services/LessonService.jsx
import api from '../config/APIConfig.jsx';

const LessonService = {
  getAll: async () => {
    const response = await api.get('/lesson');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/lesson/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/lesson', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/lesson/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/lesson/${id}`);
    return response.data;
  }
};

export default LessonService;