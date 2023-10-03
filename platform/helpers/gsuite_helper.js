const { google } = require("googleapis");
const lodash = require("lodash");
const people = google.people("v1");
const Globals = require("../../utility/globals");

module.exports = class GoogleSuiteHelper {
	constructor() {
		this.oauth2Client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_SECRET,
			process.env.GOOGLE_REDIRECT_URI
		);
	}

	async getconsentURL(params = {}) {
		const { state } = params;
		const url = this.oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: "offline",
			// redirect_uri: process.env.GOOGLE_REDIRECT_URI,
			// If you only need one scope you can pass it as a string
			scope: Globals.SCOPES.GOOGLE.Google_scopes,
			state: state || "backend",
		});
		// const code = getUrlSearchParam('code');
		// const scope = getUrlSearchParam('scope');
		return url;
	}

	async getTokens(params) {
		const { code } = params;
		const { tokens } = await this.oauth2Client.getToken(code);
		return tokens;
	}

	async getTokenInfo(params) {
		const { access_token } = params;
		const response = await this.oauth2Client.getTokenInfo(access_token);
		return response;
	}

	async getUserProfile() {
		try {
			const response = await people.people.get({
				resourceName: "people/me",
				personFields: "names,emailAddresses",
				auth: this.oauth2Client,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async refreshToken(params) {
		try {
			const { user_id, refresh_token } = params;
			const refreshTokenRequest = {
				refresh_token,
				scope: Globals.SCOPES.GOOGLE.Google_scopes,
			};

			const response = await this.oauth2Client.getAccessToken();
			return response.res;
		} catch (error) {
			throw error;
		}
	}

	setUserCredentials(refreshToken) {
		this.oauth2Client.setCredentials({ refresh_token: refreshToken });
	}

	// logout
	async logout(params) {
		try {
			const { access_token } = params;
			const response = await this.oauth2Client.revokeToken(access_token);
			return response;
		} catch (error) {
			throw error;
		}
	}
};
