const express = require("express");
const router = express.Router();
const GSuiteApi = require("../apis/gsuite_api");
// const UsersApi = require("../apis/users_api");
const AuthHelper = require("../../utility/auth_utils");

// google sign in
router.get("/auth", GSuiteApi.handleGoogleOAuth);
router.get("/callback", GSuiteApi.handleGoogleOAuthRedirect);
// router.get('/verify', GSuiteApi.handleGoogleOAuthVerification);
router.get("/logout", AuthHelper.authenticateJWTToken, GSuiteApi.logout);

module.exports = router;
