import axiosClient from '../config/APIConfig.jsx'


export async function login(email, password) {
    try {
        const response = await axiosClient.post('/auth/login', { email, password });
        return response ? response.data : null;
    } catch (error) {
        if (error.response && error.response.data) {
            // Lấy message từ backend kể cả khi lỗi HTTP
            return error.response.data;
        }
        return { success: false, message: "Login failed!" };
    }
}

export const logout = async  () => {
    const response = await axiosClient.get('/auth/logout')
    return response ? response.data : null
}

export const register = async (user) => {
    const response = await axiosClient.post('/auth/register', user);
    console.log(response);
    return response ? response.data : null;
}