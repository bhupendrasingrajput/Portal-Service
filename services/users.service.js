import { userApi } from '../apis/index.js'

export const findUserByEmail = async (email) => {
    try {
        const { data } = await userApi.get(`/user/${email}`);
        return data.user;
    } catch (error) {
        throw new Error('Error fetching user by email');
    }
}

export const createUser = async (userData) => {
    try {
        const { data } = await userApi.post(`/user/create`, userData);
        return data.user;
    } catch (error) {
        throw new Error('Error creating user');
    }
}