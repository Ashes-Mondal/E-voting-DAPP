import axios from './config';

export const createNewPoll = async ({ voterID, username, candidates, smartContractAddress }) => {
	const data = { voterID, username, candidates, smartContractAddress }
    const url = '/api/v1/election/createPoll'
    try {
        const res = await axios.post(url,data);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}