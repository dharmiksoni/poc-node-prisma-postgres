// const { ObjectId } = require("mongodb");
const JWT = require("jsonwebtoken");
const Globals = require("./globals");
const ErrorUtils = require("../utility/error_utils");
// const User = require("../platform/models/users");
const AuthHelper = module.exports;
const axios = require('axios');
const axiosRetry = require('axios-retry');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
/**
 * Create the Token based on user information
 * @param {*} params
 */
AuthHelper.createAPIToken = async (params) => {
	const { user } = params;
	// create a token payload
	const tokenPayload = { user_id: user._id };
	const apiToken = JWT.sign(tokenPayload, process.env.JWT_TOKEN_SECRET);
	return {
		api_token: apiToken,
		user: {
			name: user.name,
			_id: user._id,
		},
	};
};

/**
 * Authenticate the APIs using the JWT token which has the tokenPayload
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
AuthHelper.authenticateJWTToken = async (req, res, next) => {
	const apiToken = req.headers.authorization;
	try {
		if (!apiToken) {
			throw Globals.ERRORS.API_TOKEN_HEADER_MISSING;
		}
		const decodedPayload = JWT.verify(apiToken, process.env.JWT_TOKEN_SECRET);
		if (!decodedPayload || !decodedPayload.user_id) {
			throw Globals.ERRORS.API_TOKEN_INVALID_SIGNATURE;
		}
		// const user = await User.findOne({ _id: ObjectId(decodedPayload.user_id) });
		const user = await prisma.user.findUnique({
			where: {
			  id: decodedPayload.user_id,
		},
		  });
		if (!user) {
			throw Globals.ERRORS.API_TOKEN_USER_INVALID;
		}
		// updating the request object to add the user
		req.user = user;
		return next();
	} catch (error) {
		if (error && error.name === "JsonWebTokenError") {
			return ErrorUtils.APIError(
				res,
				Globals.ERRORS.API_TOKEN_INVALID_SIGNATURE
			);
		}
		return ErrorUtils.APIError(res, error);
	}
};

axiosRetry(axios, {
	retries: 3, // number of retries
	retryDelay: (retryCount) => {
		console.log(`retry attempt: ${retryCount}`);
		return retryCount * 1000; // time interval between retries
	},
	retryCondition: (error) => {
		console.log('error in component:', error);
		return error.response.status === 501;
	},
});