//Dependencies
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const winston = require('winston');
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectMongo = require("./database/connectMongoDb");
const auth = require("./routes/auth")
const api = require("./routes/api")
require('./database/schemas')

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
	]
});

try {
	const port = process.env.PORT || 8000;
	const app = express();

	//Middlewares
	app.use(cookieParser(process.env.COOKIE_SECRET));
	app.use(cors({ origin: true, credentials: true }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	//mongoDB connection
	connectMongo()
		.then((mongoDefaultConnection) => {
			logger.info("Successfully connected to mongoDB server");
			global.mongoDefaultConnection = mongoDefaultConnection;
		})
		.catch(() => {
			logger.error("Failed to connect mongoDB server",);
			console.warn("Stopping the server...",);
			process.exit(0);
		});

	//api endpoints
	app.use('/auth', auth)
	app.use('/api', api)

	//serve static assets when in production
	if (process.env.NODE_ENV === "production") {
		app.use(express.static("frontend/build"));
		app.get("*", (req, res) => {
			res.sendFile(
				path.resolve(__dirname, "frontend", "build", "index.html")
			);
		});
	}

	app.listen(port, () => {
		logger.info(`Server is listening to port: ${port}`);
	});
} catch (error) {
	logger.error(error)
	logger.warn("Stopping the server...")
	process.exit(0);
}