import axiosClient from '../config/APIConfig.jsx'

// Classes APIs
export const getAllClasses = async () => {
    try {
        const response = await axiosClient.get('/education/classes')
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch classes',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getClassById = async (classId) => {
    const response = await axiosClient.get(`/education/classes/${classId}`)
    return response ? response.data : null
}

export const getSyllabusByClassId = async (classId) => {
    const response = await axiosClient.get(`/education/classes/${classId}/syllabus`)
    return response ? response.data : null
}

export const getLessonsByClassId = async (classId) => {
    const response = await axiosClient.get(`/education/classes/${classId}/lessons`)
    return response ? response.data : null
}

export const getClassesByStatus = async (status) => {
    const response = await axiosClient.get(`/education/classes/status/${status}`)
    return response ? response.data : null
}

export const getClassesByGrade = async (grade) => {
    const response = await axiosClient.get(`/education/classes/grade/${grade}`)
    return response ? response.data : null
}

export const createClass = async (data) => {
    const response = await axiosClient.post('/education/classes', data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const updateClass = async (id, data) => {
    const response = await axiosClient.put(`/education/classes/${id}`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const removeClass = async (id) => {
    try {
        const response = await axiosClient.delete(`/education/classes/${id}`);
        return response.status === 204 ? { success: true, message: 'Class deleted successfully' } : response.data;
    } catch (error) {
        throw {
            error: true,
            message: error.response?.data?.message || 'Failed to delete class',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

// Syllabus APIs
export const getAllSyllabi = async () => {
    const response = await axiosClient.get('/education/syllabus')
    return response ? response.data : null
}

export const getSyllabusById = async (syllabusId) => {
    const response = await axiosClient.get(`/education/syllabus/${syllabusId}`)
    return response ? response.data : null
}

export const getLessonsBySyllabusId = async (syllabusId) => {
    const response = await axiosClient.get(`/education/syllabus/${syllabusId}/lessons`)
    return response ? response.data : null
}


export const createSyllabus = async (data) => {
    const response = await axiosClient.post('/education/syllabus', data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const updateSyllabus = async (id, data) => {
    const response = await axiosClient.put(`/education/syllabus/${id}`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const removeSyllabus = async (id) => {
    const response = await axiosClient.delete(`/education/syllabus/${id}`);
    return response.status === 204 ? { success: true, message: 'Syllabus deleted successfully' } : response.data;
}

// Lesson APIs
export const getAllLessons = async () => {
    try {
        const response = await axiosClient.get('/education/lessons')
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch lessons',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getLessonById = async (lessonId) => {
    const response = await axiosClient.get(`/education/lessons/${lessonId}`)
    return response ? response.data : null
}

export const getLessonsByTopic = async (topic) => {
    const response = await axiosClient.get(`/education/lessons/search?topic=${topic}`)
    return response ? response.data : null
}

export const createLesson = async (data) => {
    const response = await axiosClient.post('/education/lessons', data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const updateLesson = async (id, data) => {
    const response = await axiosClient.put(`/education/lessons/${id}`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const removeLesson = async (id) => {
    const response = await axiosClient.delete(`/education/lessons/${id}`);
    return response.status === 204 ? { success: true, message: 'Lesson deleted successfully' } : response.data;
}

// Lesson-Syllabus Assignment APIs
export const getSyllabiByLessonId = async (lessonId) => {
    try {
        const response = await axiosClient.get(`/education/lessons/${lessonId}/syllabi`)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch syllabi for lesson',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

// Activity APIs
export const createActivity = async (activityData) => {
    try {
        // Transform frontend data to match backend CreateActivityRequest
        const transformedData = {
            topic: activityData.topic || activityData.title,
            description: activityData.description,
            dayOfWeek: activityData.dayOfWeek,
            startTime: activityData.startTime,
            endTime: activityData.endTime,
            scheduleId: activityData.scheduleId,
            lessonId: activityData.lessonId
        }
        const response = await axiosClient.post('/education/activities', transformedData)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to create activity',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const updateActivity = async (activityId, activityData) => {
    try {
        // Transform frontend data to match backend UpdateActivityRequest
        const transformedData = {
            topic: activityData.topic || activityData.title,
            description: activityData.description,
            dayOfWeek: activityData.dayOfWeek,
            startTime: activityData.startTime,
            endTime: activityData.endTime,
            lessonId: activityData.lessonId
        }
        const response = await axiosClient.put(`/education/activities/${activityId}`, transformedData)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to update activity',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getActivityById = async (activityId) => {
    const response = await axiosClient.get(`/education/activities/${activityId}`)
    return response ? response.data : null
}

export const getAllActivities = async () => {
    try {
        const response = await axiosClient.get('/education/activities')
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch activities',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getActivitiesByScheduleId = async (scheduleId) => {
    const response = await axiosClient.get(`/education/activities/schedule/${scheduleId}`)
    return response ? response.data : null
}

export const getActivitiesByClassId = async (classId) => {
    const response = await axiosClient.get(`/education/activities/class/${classId}`)
    return response ? response.data : null
}

export const getActivitiesByLessonId = async (lessonId) => {
    const response = await axiosClient.get(`/education/activities/lesson/${lessonId}`)
    return response ? response.data : null
}

export const checkActivityDeletionImpact = async (activityId) => {
    try {
        const response = await axiosClient.get(`/education/activities/${activityId}/deletion-impact`)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to check activity deletion impact',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const deleteActivity = async (activityId) => {
    try {
        const response = await axiosClient.delete(`/education/activities/${activityId}`)
        return response.status === 204 ? { success: true, message: 'Activity deleted successfully' } : (response ? response.data : null)
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to delete activity',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const assignActivityToClass = async (assignData) => {
    const response = await axiosClient.post('/education/activities/assign', assignData)
    return response ? response.data : null
}

export const createActivitiesFromLessons = async (lessonsData) => {
    const response = await axiosClient.post('/education/activities/create-from-lessons', lessonsData)
    return response ? response.data : null
}

// Schedule APIs
export const createSchedule = async (scheduleData) => {
    try {
        // Transform frontend data to match backend CreateScheduleRequest
        const transformedData = {
            weekNumber: scheduleData.weekNumber,
            note: scheduleData.note || scheduleData.location || '',
            classId: scheduleData.classId
        }
        const response = await axiosClient.post('/education/schedules', transformedData)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to create schedule',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const updateSchedule = async (scheduleId, scheduleData) => {
    try {
        // Transform frontend data to match backend UpdateScheduleRequest
        const transformedData = {
            weekNumber: scheduleData.weekNumber,
            note: scheduleData.note || scheduleData.location || ''
        }
        const response = await axiosClient.put(`/education/schedules/${scheduleId}`, transformedData)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to update schedule',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getScheduleById = async (scheduleId) => {
    const response = await axiosClient.get(`/education/schedules/${scheduleId}`)
    return response ? response.data : null
}

export const getAllSchedules = async () => {
    try {
        const response = await axiosClient.get('/education/schedules')
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch schedules',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getSchedulesByClassId = async (classId) => {
    const response = await axiosClient.get(`/education/schedules/class/${classId}`)
    return response ? response.data : null
}

export const getWeeklySchedule = async (classId, weekNumber) => {
    const response = await axiosClient.get(`/education/schedules/class/${classId}/week/${weekNumber}`)
    return response ? response.data : null
}

export const deleteSchedule = async (scheduleId) => {
    const response = await axiosClient.delete(`/education/schedules/${scheduleId}`)
    return response.status === 204 ? { success: true, message: 'Schedule deleted successfully' } : (response ? response.data : null)
}

export const getAllTeachers = async (startYear) => {
    try {
        const params = startYear ? { startYear } : {};
        const response = await axiosClient.get('/education/teachers', { params });
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch teachers',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getTeacherById = async (teacherId) => {
    try {
        const response = await axiosClient.get(`/education/teachers/${teacherId}`)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch teacher details',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

// Student Assignment APIs
export const assignStudentsToClass = async (assignData) => {
    try {
        const response = await axiosClient.post('/education/classes/assign-students', assignData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response ? response.data : null;
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to assign students to class',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const unassignStudentsFromClass = async (unassignData) => {
    try {
        const response = await axiosClient.post('/education/classes/unassign-students', unassignData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response ? response.data : null;
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to unassign students from class',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getAllStudents = async () => {
    try {
        const response = await axiosClient.get('/education/students')
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch students',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getStudentsByClassId = async (classId) => {
    try {
        const response = await axiosClient.get(`/education/classes/${classId}/students`)
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch students for class',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getStudentClassAssignments = async () => {
    try {
        const response = await axiosClient.get('/education/student-class-assignments')
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch student class assignments',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}

export const getRoomAvailability = async (startYear) => {
    try {
        const params = startYear ? { startYear } : {};
        const response = await axiosClient.get('/education/rooms/availability', { params });
        return response ? response.data : null
    } catch (error) {
        throw {
            error: true,
            message: 'Failed to fetch room availability',
            status: error.response?.status,
            details: error.response?.data || error.message
        }
    }
}