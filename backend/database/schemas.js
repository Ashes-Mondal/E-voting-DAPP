const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	voterID: String,
	username: String,
	hashedPwd: String,
	publicKey: String,
	elections: [
		{
			pollID: { type: Schema.Types.ObjectId, ref: 'Elections', },
			encryptedVote://encryted with public key of client 
			{
				type: String,
				default: ""
			},
			encryptedUID://encryted with public key of client 
			{
				type: String,
				default: ""
			}
		}
	]
});

const electionSchema = new Schema({
	pollID: Schema.Types.ObjectId,
	smartContractAddress: String,
	hostVoterID: String,
	hostPublicKey: String,
	candidates: [{ type: String }],
	votersUIDhashed: [{ type: String }]
})

module.exports = {
	USER: mongoose.model('Users', userSchema),
	ELECTION: mongoose.model('Elections', electionSchema)
};