import axiosClient from '../config/APIConfig.jsx'

export const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', {
        email,
        password
    })
    return response ? response.data : null
}

export const logout = async  () => {
    const response = await axiosClient.get('/auth/logout')
    return response ? response.data : null
}