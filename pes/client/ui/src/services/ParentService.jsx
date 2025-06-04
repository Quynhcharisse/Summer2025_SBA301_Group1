import axiosClient from '../config/APIConfig.jsx'

export const getForms = async () => {
    const response = await axiosClient.get("/parent/form/list")
    return response ? response.data : null
}