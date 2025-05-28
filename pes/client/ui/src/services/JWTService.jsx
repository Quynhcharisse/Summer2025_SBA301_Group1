import axiosClient from '../config/APIConfig.jsx'

export const refreshToken = async () => {
    const response = await axiosClient.post('/auth/refresh')
    response ? response.data : null
}