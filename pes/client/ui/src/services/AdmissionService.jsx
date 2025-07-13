import axiosClient from '../config/APIConfig.jsx'
import {enqueueSnackbar} from "notistack";

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
        enqueueSnackbar("Get term list error:", error)
    }
}

export const createTerm = async (
    startDate,
    endDate,
    grade,
    maxNumberRegistration
) => {
    const response = await axiosClient.post("/admission/term", {
        grade: grade,
        startDate: startDate,
        endDate: endDate,
        maxNumberRegistration: maxNumberRegistration
    });
    return response ? response.data : null;
};

export const createExtraTerm = async (data) => {
    try {
        console.log('Creating Extra Term - Request Data:', {
            admissionTermId: data.termId,
            startDate: data.startDate,
            endDate: data.endDate,
            maxNumberRegistration: data.maxNumberRegistration
        });

        const response = await axiosClient.post('/admission/extra/term', {
            admissionTermId: data.termId,
            startDate: data.startDate,
            endDate: data.endDate,
            maxNumberRegistration: data.maxNumberRegistration
        });

        return response.data;
    } catch (error) {
        enqueueSnackbar("Extra Term Creation Error:", error)
    }
};

export const updateAdmissionTerm = async (termId) => {
    try {
        const response = await axiosClient.put("/admission/term", {
            termId: termId
        });
        return response ? response.data : null;
    } catch (error) {
        console.error("Update admission term error:", error);
        throw error;
    }
};
