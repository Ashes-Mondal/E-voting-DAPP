const express = require("express");
const crypto = require("crypto");
const { userModel } = require("../../../database/schemas");
const router = express.Router();

router.get('/getUserDetails', async (req, res) => {
	const { voterID, username } = req.body;
	try {
		const user = await userModel.findOne({ username, voterID }).populate({
			path: "elections",
			populate: {
				path: "pollID",
			},
		});
		res.json({ data: user, error: null });
	} catch (error) {
		res.status(500).json({ data: null, error: error });
	}
	res.end();
})

// Exporting routes
module.exports = router;