import axios from "axios";

let api;
let apiDetail = {
	baseURL: "http://localhost:5000",
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	},
};

const setAPI = (apiDetail) => {
	api = axios.create(apiDetail);
};

setAPI(apiDetail);

const setHeadersWithUserToken = (token) => {
	api.defaults.headers.common["Authorization"] = token;
};

const unsetHeadersWithUserToken = () => {
	delete api.defaults.headers.common["Authorization"];
};

export { api, setHeadersWithUserToken, unsetHeadersWithUserToken };
