import axiosClient from '../config/APIConfig.jsx'

// Classes APIs
export const getAllClasses = async () => {
    const response = await axiosClient.get('/classes')
    return response ? response.data : null
}

export const getClassById = async (classId) => {
    const response = await axiosClient.get(`/classes/${classId}`)
    return response ? response.data : null
}

export const getSyllabusByClassId = async (classId) => {
    const response = await axiosClient.get(`/classes/${classId}/syllabus`)
    return response ? response.data : null
}

export const getLessonsByClassId = async (classId) => {
    const response = await axiosClient.get(`/classes/${classId}/lessons`)
    return response ? response.data : null
}

export const getClassesByStatus = async (status) => {
    const response = await axiosClient.get(`/classes/status/${status}`)
    return response ? response.data : null
}

export const getClassesByGrade = async (grade) => {
    const response = await axiosClient.get(`/classes/grade/${grade}`)
    return response ? response.data : null
}

// Syllabus APIs
export const getAllSyllabi = async () => {
    const response = await axiosClient.get('/syllabus')
    return response ? response.data : null
}

export const getSyllabusById = async (syllabusId) => {
    const response = await axiosClient.get(`/syllabus/${syllabusId}`)
    return response ? response.data : null
}

export const getLessonsBySyllabusId = async (syllabusId) => {
    const response = await axiosClient.get(`/syllabus/${syllabusId}/lessons`)
    return response ? response.data : null
}

// Lesson APIs
export const getAllLessons = async () => {
    const response = await axiosClient.get('/lessons')
    return response ? response.data : null
}

export const getLessonById = async (lessonId) => {
    const response = await axiosClient.get(`/lessons/${lessonId}`)
    return response ? response.data : null
}

export const getLessonsByTopic = async (topic) => {
    const response = await axiosClient.get(`/lessons/search?topic=${topic}`)
    return response ? response.data : null
}

// Activity APIs
export const createActivity = async (activityData) => {
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
    const response = await axiosClient.post('/activities', transformedData)
    return response ? response.data : null
}

export const updateActivity = async (activityId, activityData) => {
    // Transform frontend data to match backend UpdateActivityRequest
    const transformedData = {
        topic: activityData.topic || activityData.title,
        description: activityData.description,
        dayOfWeek: activityData.dayOfWeek,
        startTime: activityData.startTime,
        endTime: activityData.endTime,
        lessonId: activityData.lessonId
    }
    const response = await axiosClient.put(`/activities/${activityId}`, transformedData)
    return response ? response.data : null
}

export const getActivityById = async (activityId) => {
    const response = await axiosClient.get(`/activities/${activityId}`)
    return response ? response.data : null
}

export const getAllActivities = async () => {
    const response = await axiosClient.get('/activities')
    return response ? response.data : null
}

export const getActivitiesByScheduleId = async (scheduleId) => {
    const response = await axiosClient.get(`/activities/schedule/${scheduleId}`)
    return response ? response.data : null
}

export const getActivitiesByClassId = async (classId) => {
    const response = await axiosClient.get(`/activities/class/${classId}`)
    return response ? response.data : null
}

export const getActivitiesByLessonId = async (lessonId) => {
    const response = await axiosClient.get(`/activities/lesson/${lessonId}`)
    return response ? response.data : null
}

export const deleteActivity = async (activityId) => {
    const response = await axiosClient.delete(`/activities/${activityId}`)
    return response ? response.data : null
}

export const assignActivityToClass = async (assignData) => {
    const response = await axiosClient.post('/activities/assign', assignData)
    return response ? response.data : null
}

export const bulkCreateActivities = async (bulkData) => {
    const response = await axiosClient.post('/activities/bulk-create', bulkData)
    return response ? response.data : null
}

export const createActivitiesFromLessons = async (lessonsData) => {
    const response = await axiosClient.post('/activities/create-from-lessons', lessonsData)
    return response ? response.data : null
}

// Schedule APIs
export const createSchedule = async (scheduleData) => {
    // Transform frontend data to match backend CreateScheduleRequest
    const transformedData = {
        weekNumber: scheduleData.weekNumber,
        note: scheduleData.note || scheduleData.location || '',
        classId: scheduleData.classId
    }
    const response = await axiosClient.post('/schedules', transformedData)
    return response ? response.data : null
}

export const updateSchedule = async (scheduleId, scheduleData) => {
    // Transform frontend data to match backend UpdateScheduleRequest
    const transformedData = {
        weekNumber: scheduleData.weekNumber,
        note: scheduleData.note || scheduleData.location || ''
    }
    const response = await axiosClient.put(`/schedules/${scheduleId}`, transformedData)
    return response ? response.data : null
}

export const getScheduleById = async (scheduleId) => {
    const response = await axiosClient.get(`/schedules/${scheduleId}`)
    return response ? response.data : null
}

export const getAllSchedules = async () => {
    const response = await axiosClient.get('/schedules')
    return response ? response.data : null
}

export const getSchedulesByClassId = async (classId) => {
    const response = await axiosClient.get(`/schedules/class/${classId}`)
    return response ? response.data : null
}

export const getWeeklySchedule = async (classId, weekNumber) => {
    const response = await axiosClient.get(`/schedules/class/${classId}/week/${weekNumber}`)
    return response ? response.data : null
}

export const deleteSchedule = async (scheduleId) => {
    const response = await axiosClient.delete(`/schedules/${scheduleId}`)
    return response ? response.data : null
}