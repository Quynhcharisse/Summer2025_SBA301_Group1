import axiosClient from '../config/APIConfig.jsx'

export const refreshToken = async () => {
    const response = await axiosClient.post('/auth/refresh')
    console.log(response);
    
    return response ? response.data : null
}