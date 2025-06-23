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

// Extra Term APIs
export const createExtraTerm = async (data) => {
    try {
        console.log('🚀 Creating Extra Term - Request Data:', {
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

        console.log('✅ Extra Term Creation Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Extra Term Creation Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
};
