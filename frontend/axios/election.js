import { decryptVote, encryptVote } from '../cryptography/ECC';
import axios from './config';

export const createNewPoll = async ({ candidates, currentAccount }) => {
    const data = { candidates, currentAccount }
    const url = '/api/v1/election/createPoll'
    try {
        const res = await axios.post(url, data);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}

export const castMyVote = async (myVote, pollID, hostPublicKey, userPrivateKey, userPublickey) => {
    try {
        let url = `/api/v1/election/giveUniqueID/${pollID}`
        const res = await axios.get(url);
        const encryptedUID = res.data.data;
        const UUID = await decryptVote(encryptedUID, userPrivateKey)
        const encryptedVote = await encryptVote(myVote, hostPublicKey);
        const encryptedVote_user = await encryptVote(myVote, userPublickey);
        const data = { UUID, encryptedVote, pollID, encryptedVote_user }
        url = `/api/v1/election/castVote`
        const resp = await axios.post(url, data);
        if (resp.data.error) {
            return{data:null,error:resp.data.error}
        }
        return encryptedVote;
    } catch (error) {
        if (error.message == "Voting Phase closed!")
            throw Error(error);
        throw error.response ? error.response.data : { data: null, error: 'Not Connected to server' };
    }
}