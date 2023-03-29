const jwt = require("jsonwebtoken");


// function will create access token
module.exports.createAccessToken = async ( username, voterID ) => {
	const accessToken = jwt.sign({username,voterID}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "300s" });
	return accessToken;
};

//function will verify access token
module.exports.accessTokenVerification = (accessToken) => {
	try {
		//1.Verify incoming access token
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		return {data:decoded,error:null};
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return { data: null, error: "TokenExpiredError" };
		} else
			throw error;
	}
};