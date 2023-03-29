const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	voterID: String,
	username: String,
	hashedPwd: String,
	publicKey: String,
	pollsCreated: [{
		pollID:
		{
			type: Schema.Types.ObjectId,
			ref: 'Elections'
		},
		smartContractAddress: String
	}],
	elections: [
		{
			pollID: { type: Schema.Types.ObjectId, ref: 'Elections' },
			encryptedVote://encryted with public key of client 
			{
				type: String,
				default: ""
			},
			encryptedUID://encryted with public key of client 
			{
				type: String,
				default: ""
			},
			hashedUID://encryted with public key of client 
			{
				type: String,
				default: ""
			}
		}
	]
});

const electionSchema = new Schema({
	smartContractAddress: String,
	hostVoterID: String,
	hostPublicKey: String,
	candidates: [{ type: String }],
})

module.exports = {
	userModel: mongoose.model('Users', userSchema),
	electionModel: mongoose.model('Elections', electionSchema)
};