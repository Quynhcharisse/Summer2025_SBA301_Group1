import axiosClient from "../config/APIConfig.jsx";

export const getFormInformation = async () => {
    const response = await axiosClient.get("/parent/form/list")
    return response ? response.data : null
}

export const submittedForm = async (
    studentId,
    householdRegistrationAddress,
    profileImage,
    birthCertificateImg,
    householdRegistrationImg,
    commitmentImg,
    note) => {
    const response = await axiosClient.post("/parent/form/submit", {
        studentId: studentId,
        householdRegistrationAddress: householdRegistrationAddress,
        profileImage: profileImage,
        birthCertificateImg: birthCertificateImg,
        householdRegistrationImg: householdRegistrationImg,
        commitmentImg: commitmentImg,
        note: note
    })
    return response ? response.data : null
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
    const response = await axiosClient.get("/parent/child");
    console.log("Response from getChildrenList:", response);
    
    return response ? response.data : null;
};

export const addChild = async (child) => {
    const response = await axiosClient.post("/parent/child", child);
    console.log("Response from addChild:", response);

    return response ? response.data : null;
}

export const updateChild = async (child) => {
    console.log("Updating child with ID:", child.id || child.studentId);
    
    const response = await axiosClient.put("/parent/child", child);
    console.log("Response from updateChild:", response);

    return response ? response.data : null;
}

export const viewParentProfile = async () => {
    const response = await axiosClient.get("/parent/profile");
    return response ? response.data : null;
}

export const updateParentProfile = async (profileData) => {
    const response = await axiosClient.put("/parent/profile", profileData);
    return response ? response.data : null;
}