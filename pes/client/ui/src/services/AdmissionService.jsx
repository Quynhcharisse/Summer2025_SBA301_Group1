import axiosClient from '../config/APIConfig.jsx'


export const getFormTracking = async () => {
    const response = await axiosClient.get("/admission/form/list")
    return response ? response.data : null
}

export const processAdmissionForm = async (id, approved, reason)  => {
    const response = await axiosClient.put("/admission/form/process", {
        id: id,
        approved: approved,
        reason: reason,
    })
    return response ? response.data : null
}


