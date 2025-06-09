import axiosClient from '../config/APIConfig.jsx'


export const getFormTracking = async () => {
    const response = await axiosClient.get("/admission/form/list")
    return response ? response.data : null
}

export const processAdmissionForm = async (id, isApproved, reason)  => {
    const response = await axiosClient.put("/admission/form/process", {
        id: id,
        approved: isApproved,
        reason: reason,
    })
    return response ? response.data : null
}


