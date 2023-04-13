import axios from './config';

export const createAccount = async (data) => {
    const url = '/auth/signup'
    try {
        const res = await axios.post(url, data);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}

export const logIntoAccount = async (data) => {
    const url = '/auth/login'
    try {
        const res = await axios.post(url, data);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}

export const logOutOfAccount = async () => {
    const url = '/auth/logout'
    try {
        const res = await axios.delete(url);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}