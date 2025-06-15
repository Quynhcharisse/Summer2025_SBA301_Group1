import axiosClient from "../config/APIConfig.jsx";

const SyllabusService = {
  getAll: async () => {
    const response = await axiosClient.get('/syllabus');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/syllabus/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/syllabus', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/syllabus/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosClient.delete(`/syllabus/${id}`);
    return response.data;
  },

  getAllLessons: async () => {
    const response = await axiosClient.get('/lesson');
    return response.data;
  },

  getLessons: async (syllabusId) => {
    const response = await axiosClient.get(`/syllabus/${syllabusId}/lessons`);
    return response.data;
  },

  addLesson: async (syllabusId, lessonData) => {
    const response = await axiosClient.post(`/syllabus/${syllabusId}/lessons`, lessonData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  removeLesson: async (syllabusId, lessonId) => {
    const response = await axiosClient.delete(`/syllabus/${syllabusId}/lessons/${lessonId}`);
    return response.data;
  }
};

export default SyllabusService;

