import axios from './config';

export const getUserDetails = async () => {
    const url = '/api/v1/user/details'
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}