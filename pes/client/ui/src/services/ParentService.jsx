import axiosClient from "../config/APIConfig.jsx";

export const getFormInformation = async () => {
    const response = await axiosClient.get("/parent/form/list")
    return response ? response.data : null
}

export async function submittedForm(requestBody) {
    try {
        const response = await axiosClient.post(
            "/parent/form/submit",
            requestBody,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        return {
            success: false,
            message: "Network error occurred"
        };
    }
}

// thêm headers : Content-Type: application/json bắt buộc để Spring hiểu đây là raw JSON
// nếu ko co headers : nó bị sai định dạng gây lỗi null..
export const cancelAdmission = async (id) => {
    const response = await axiosClient.put("/parent/form/cancel", id, {
       id: id
    });
    return response ? response.data : null;
};

export const getChildrenList = async () => {
    try {
        const response = await axiosClient.get("/parent/child");
        console.log("Raw API Response:", response);
        console.log("API Response data:", response?.data);
        console.log("API Response success:", response?.data?.success);
        if (response?.data?.data) {
            console.log("First child data:", response.data.data[0]);
            console.log("First child dateOfBirth:", response.data.data[0]?.dateOfBirth);
        }
        return response?.data || null;
    } catch (error) {
        console.error("Error in getChildrenList:", error);
        throw error;
    }
};

export const addChild = async (childData) => {
    try {
        // Convert gender to match backend format
        const formattedData = {
            ...childData,
            gender: childData.gender?.toLowerCase()
        };

        const response = await axiosClient.post("/parent/child", formattedData);
        console.log("Response from addChild:", response);
        return response?.data || null;
    } catch (error) {
        console.error("Error in addChild:", error);
        throw error;
    }
};

export const updateChild = async (childData) => {
    try {
        const response = await axiosClient.put(
            "/parent/child",
            {
                id: childData.id,
                name: childData.name,
                gender: childData.gender,
                dateOfBirth: childData.dateOfBirth,
                placeOfBirth: childData.placeOfBirth,
                profileImage: childData.profileImage,
                birthCertificateImg: childData.birthCertificateImg,
                householdRegistrationImg: childData.householdRegistrationImg
            },
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const viewParentProfile = async () => {
    const response = await axiosClient.get("/parent/profile");
    return response ? response.data : null;
};

export const updateParentProfile = async (data) => {
    const response = await axiosClient.put("/parent/profile", data);
    return response ? response.data : null;
};

export const viewStudentClasses = async (studentId) => {
    const response = await axiosClient.get(`/parent/student-classes/${studentId}`);
    console.log("Response from viewStudentClasses:", response);
    return response ? response.data : null;
}

export const viewSyllabusByClass = async (classId) => {
    const response = await axiosClient.get(`/parent/syllabus/${classId}`);
    console.log("Response from viewSyllabusByClass:", response);
    return response ? response.data : null;
}

export const viewActivitiesByClass = async (classId) => {
    const response = await axiosClient.get(`/parent/activities/${classId}`);
    console.log("Response from viewActivitiesByClass:", response);
    return response ? response.data : null;
}