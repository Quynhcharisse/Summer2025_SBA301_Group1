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