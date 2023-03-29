const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const winston = require('winston');
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
	]
});
const { userModel } = require("../database/schemas");
const { createAccessToken } = require("../utils/jwt");

router.post("/signup", async (req, res) => {
	const { username, pwd, publicKey, voterID } = req.body;
	try {
		if(!(username && pwd && publicKey && voterID) ){
			res.sendStatus(400);
			return;
		}
		const user = await userModel.findOne({ username, voterID })
		if(user){
			res.status(200).json({data:null,error:"Already signed up!"});
			res.end();
			return;
		}
		const hashedPwd = await bcrypt.hash(pwd, 10);
		const doc = await userModel.create({ username,voterID,publicKey,hashedPwd});
		res.status(200).json({data:"Success",error:null});
	} catch (error) {
		console.error(error)
		res.sendStatus(500);
	}
	res.end();
});

router.post("/login", async (req, res) => {
	const { username, pwd } = req.body;
	if (username && pwd) {
		let user;
		try {
			user = await userModel.findOne({ username }).populate({
				path: "elections",
				populate: {
					path: "pollID",
				},
			});
		} catch (error) {
			res.sendStatus(500);
			res.end()
			return;
		}

		if (!user) {
			res.sendStatus(404);
		} else if (await bcrypt.compare(pwd, user.hashedPwd)) {
			const accessToken = await createAccessToken(user.username, user.voterID)
			res.clearCookie("AUTH");
			res.cookie("AUTH", JSON.stringify({ accessToken: accessToken }), {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});
			res.json({ data: user, error: null });
		} else {
			res.status(403).send("Password not matching!!");
		}
	} else {
		res.sendStatus(403);
	}
	res.end();
});

router.delete("/logout", (req, res) => {
	res.clearCookie("AUTH");
	res.status(200).send("Successfully logged out!")
	res.end()
});

// Exporting routes
module.exports = router;