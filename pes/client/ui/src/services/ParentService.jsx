import axiosClient from '../config/APIConfig.jsx'

export const getForms = async () => {
    const response = await axiosClient.get("/parent/form/list")
    return response ? response.data : null
}

export const getChildren = async () => {
    const response = await axiosClient.get("/parent/children")
    return response ? response.data : null
}

export const submittedAdmission = async (
    name,
    gender,
    dateOfBirth,
    placeOfBirth,
    householdRegistrationAddress,
    profileImage,
    birthCertificateImg,
    householdRegistrationImg,
    commitmentImg,
    note) => {
    const response = await axiosClient.post("/parent/form/submit", {
        name: name,
        gender: gender,
        dateOfBirth: dateOfBirth,
        placeOfBirth: placeOfBirth,
        householdRegistrationAddress: householdRegistrationAddress,
        profileImage: profileImage,
        birthCertificateImg: birthCertificateImg,
        householdRegistrationImg: householdRegistrationImg,
        commitmentImg: commitmentImg,
        note: note,
    })
    return response ? response.data : null
}

export const cancelAdmission = async (id) => {
    const response = await axiosClient.put("/parent/form/cancel", {
        id: id
    })
    return response ? response.data : null
}