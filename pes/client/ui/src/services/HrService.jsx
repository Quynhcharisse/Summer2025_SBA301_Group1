import axiosClient from "../config/APIConfig"

export const viewParentList = async () => {
    const response = await axiosClient.get("/hr/parent-list");
    return response ? response.data : null;
}

export const getParentById = async (id) => {
    const response = await axiosClient.get(`/hr/parent/${id}`);
    return response ? response.data : null;
}

export const banParent = async(id) => {
    const response = await axiosClient.put(`/hr/parent/remove?id=${id}`);
    return response ? response.data : null;
}

export const unbanParent = async(id) => {
    const response = await axiosClient.put(`/hr/parent/unban?id=${id}`);
    return response ? response.data : null;
}

export const getTeacherList = async() => {
    const response = await axiosClient.get("/hr/teachers");
    return response ? response.data : null;
}

export const addTeacher = async(teacher) => {
    const response = await axiosClient.post(`/hr/teachers/add`, teacher, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response ? response.data : null;
}

export const updateTeacher = async(id, teacher) => {
    const response = await axiosClient.put(`/hr/teachers/update/${id}`, teacher, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response ? response.data : null;
}