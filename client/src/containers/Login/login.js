import React, { useState, useEffect } from "react";
import { api } from "../../services/axios";

const server = "http://localhost:5000";
const Login = (props) => {
	console.log("props : ", props);

	const createGoogleAuthLink = async (e) => {
		e.preventDefault();
		try {
			const request = await api.get(`${server}/auth`);
			console.log("request : ", request);
			if (request.status === 200) {
				window.location.href = request.data.url;
			}
		} catch (error) {
			console.log("App.js 12 | error", error);
			throw new Error("Issue with Login", error.message);
		}
	};

	return (
		<div className="App">
			<h1>Google</h1>
			<button onClick={createGoogleAuthLink}>Login</button>
		</div>
	);
};

export default Login;
