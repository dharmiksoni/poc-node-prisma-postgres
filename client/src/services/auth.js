import { api } from "./axios";
import { setHeadersWithUserToken } from "./axios";
import axios from "axios";
import { useState } from "react";
// import GoogleOauthRedirectionPage from '../containers/Login/redirect'
const createHistory = require("history").createBrowserHistory;
const server = "http://localhost:5000";
const login = async (props) => {
	// const userDetail = { username: email, password };
	console.log("history in login: ", props);
	// const [newLink, setNewLink] = useState();
	try {
		// sessionStorage.setItem("isLogin", true);
		let history = createHistory();
		console.log("history : ", history);
		let url;
		const getURL = await api.get(`${server}/oauth/authenticate/google`);
		if (getURL.status === 200) {
			// 	sessionStorage.setItem("isLogin", true);
			url = getURL.data.url;
			// sessionStorage.setItem('url', url);
			// window.location.href = url;
			// setNewLink(window.location.search)
			console.log("location : ", url);
			history.push("/google/oauth/redirect");
		}
	} catch (error) {
		return error.response;
	}
};

const redirectUser = async (url) => {
	console.log("newLink :");
	console.log("window : ", window.location.search);
};

export { login, redirectUser };
