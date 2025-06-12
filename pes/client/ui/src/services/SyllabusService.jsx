import api from '../config/APIConfig.jsx';

const SyllabusService = {
  getAll: async () => {
    const response = await api.get('/syllabus');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/syllabus/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/syllabus', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/syllabus/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/syllabus/${id}`);
    return response.data;
  },

  getAllLessons: async () => {
    const response = await api.get('/lesson');
    return response.data;
  },

  getLessons: async (syllabusId) => {
    const response = await api.get(`/syllabus/${syllabusId}/lessons`);
    return response.data;
  },

  addLesson: async (syllabusId, lessonData) => {
    const response = await api.post(`/syllabus/${syllabusId}/lessons`, lessonData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  removeLesson: async (syllabusId, lessonId) => {
    const response = await api.delete(`/syllabus/${syllabusId}/lessons/${lessonId}`);
    return response.data;
  }
};

export default SyllabusService;

