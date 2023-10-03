const lodash = require("lodash");
const Globals = require("../../utility/globals");
const GoogleSuiteHelper = require("../helpers/gsuite_helper");
// const UsersModel = require("../models/users"); // replace with ps
const AuthHelper = require("../../utility/auth_utils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const GSuiteApi = module.exports;

/**
 * Generate an oauth url and send that to the FE for further google oauth flows
 * @param {*} req
 * @param {*} res
 * @returns
 */
GSuiteApi.handleGoogleOAuth = async (req, res) => {
	const { state_payload } = req.query;
	try {
		const gSuite = new GoogleSuiteHelper();
		const url = await gSuite.getconsentURL({
			state: state_payload || null,
		});
		if (url) {
			return res.status(200).send({ url });
		}
		throw new Error("Failed to authenticate with google");
	} catch (error) {
		throw error;
	}
};

GSuiteApi.parseJWT = (token) => {
	try {
		return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
	} catch (err) {
		return null;
	}
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 */
GSuiteApi.handleGoogleOAuthRedirect = async (req, res) => {
	try {
		let user;
		const gSuite = new GoogleSuiteHelper();
		const tokens = await gSuite.getTokens(req.query);

		const decodedJWT =
			tokens && tokens.id_token ? GSuiteApi.parseJWT(tokens.id_token) : null;
		const userEmail = lodash.get(decodedJWT, "email");
		// const existingUser = await UsersModel.findOne({ email: userEmail });
		let existingUser = await prisma.user.findUnique({
			where: { email: userEmail },
		  });

		let refreshToken = lodash.get(tokens, ["refresh_token"]);

		let authTokenResponse;
		if (!existingUser) {
			// user = new UsersModel({
			// 	name: lodash.get(decodedJWT, "name"),
			// 	email: userEmail,
			// });
			// await user.save();
			user = await prisma.user.create({
				data: {
				  username: lodash.get(decodedJWT, "name"),
				  email: userEmail,
				  password: 'lock'
				},
			  });
		} else {
			user = existingUser;
		}
		if (!refreshToken) {
			console.log(
				`[OAUTH-GOOGLE] Missing RefreshToken & existingUser not found for Email: ${userEmail}`
			);
		}
		// await UsersModel.updateOne(
		// 	{ _id: user._id },
		// 	{
		// 		"oauth_tokens.google.access_token": lodash.get(tokens, [
		// 			"access_token",
		// 		]),
		// 		"oauth_tokens.google.expiry_date": lodash.get(tokens, ["expiry_date"]),
		// 		"oauth_tokens.google.refresh_token": refreshToken,
		// 		"oauth_tokens.google.scope": lodash.get(tokens, ["scope"]).split(" "),
		// 		"oauth_tokens.google.token_type": lodash.get(tokens, ["token_type"]),
		// 		"oauth_tokens.google.token_updated_at": new Date(),
		// 		"oauth_tokens.google.email": userEmail,
		// 	}
		// );
		await prisma.user.update({
			where: { id: user.id },
			data: {
			oauth_tokens: {
				create: {
				  google: {
					access_token: lodash.get(tokens, "access_token"),
					expiry_date: lodash.get(tokens, "expiry_date"),
					refresh_token: refreshToken,
					scope: lodash.get(tokens, "scope").split(" "),
					token_type: lodash.get(tokens, "token_type"),
					tokenUpdatedAt: new Date(),
					email: userEmail,
				  },
				},
			  },
			},
		  });

		if (!authTokenResponse) {
			authTokenResponse = await AuthHelper.createAPIToken({ user });
		}
		const rv = {
			access_token: lodash.get(tokens, ["access_token"]),
			// user: await UsersHelperCommon.getUserProfileInternal(user),
			api_token: (authTokenResponse || {}).api_token,
		};
		return res.status(200).send(rv);
	} catch (error) {
		throw error;
	}
};

GSuiteApi.logout = async (req, res) => {
	const { user } = req;
	const gSuite = new GoogleSuiteHelper();
	// const existingUser = await UsersModel.findOne({ _id: user._id });
	let existingUser = await prisma.user.findUnique({
		where: { email: user.email },
	  });
	const access_token = lodash.get(existingUser, "oauth_tokens.google.access_token");
	const tokens = await gSuite.logout({ access_token });
	if (tokens) {
		return res.status(200).send({
			message: "Logout success",
		});
	}
};
