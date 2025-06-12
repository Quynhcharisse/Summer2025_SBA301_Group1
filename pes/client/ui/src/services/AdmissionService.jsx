import axiosClient from '../config/APIConfig.jsx'

export const getFormTracking = async () => {
    const response = await axiosClient.get("/admission/form/list")
    return response ? response.data : null
}

export const processAdmissionForm = async (id, isApproved, reason) => {
    const response = await axiosClient.put("/admission/form/process", {
        id: id,
        approved: isApproved,
        reason: reason,
    })
    return response ? response.data : null
}

export const getTermList = async () => {
    try {
        const response = await
            axiosClient.get("/admission/term")
        return response.data
    } catch (error) {
        console.error("Get term list error:", error);
        throw error;
    }
}

export const createTerm = async (
    grade,
    startDate,
    endDate,
    maxNumberRegistration,
) => {

    try {
        const response = await
            axiosClient.post("/admission/term", {
                    grade: grade,
                    startDate: startDate,
                    endDate: endDate,
                    maxNumberRegistration: maxNumberRegistration,
                }
            );
        return response.data;
    } catch (error) {
        console.error("Create term error:", error);
        throw error;
    }
}


export const updateTerm = async (
    id,
    grade,
    startDate,
    endDate,
    maxNumberRegistration,
) => {

    try {
        const response = await
            axiosClient.put("/admission/term", {
                    id: id,
                    grade: grade,
                    startDate: startDate,
                    endDate: endDate,
                    maxNumberRegistration: maxNumberRegistration,
                }
            );
        return response.data;
    } catch (error) {
        console.error("Update term error:", error);
        throw error;
    }
}