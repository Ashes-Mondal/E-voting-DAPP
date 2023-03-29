const { accessTokenVerification } = require("../utils/jwt")

module.exports.checkauthorization = async (req, res, next) => {
	if (!req.cookies["AUTH"]) {
		res.status(403).send("No Access token found!");
		res.end();
	} else {
		try {
			const accessToken = JSON.parse(req.cookies["AUTH"]).accessToken;
			const { data, error } = await accessTokenVerification(accessToken);
			if (!error) {
				req.body.voterID = data.voterID;
				req.body.username = data.username;
				next();
			}
			else if (error === "TokenExpiredError") {
				res.clearCookie("AUTH");
				res.status(403).send("Session expired!");
				res.end();
			}
		} catch (error) {
			res.status(403).send(error);
			res.end();
		}
	}
}