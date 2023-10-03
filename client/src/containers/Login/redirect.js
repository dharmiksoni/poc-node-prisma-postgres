import React, { Fragment, useEffect, useState } from "react";
import { api } from "../../services/axios";
const RedirectComponent = (props) => {
	const { history } = props;
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		console.log("newLink : ", window.location.search);
		const query = new URLSearchParams(window.location.search);
		const code = query.get("code");
		const scope = query.get("scope");
		if (window.location.search) {
			(async () => {
				const getURL = await api.get(
					`http://localhost:5000/callback?code=${code}&scope=${scope}`
				);
				console.log("getURL : ", getURL);
				if (getURL.status === 200) {
					const token = getURL.data.api_token;
					setIsLoggedIn(true);
					sessionStorage.setItem("isLogin", true);
					sessionStorage.setItem("token", token);
					props.history.push("/dashboard");
				}
			})();
		}
	}, []);
	return (
		<Fragment>
			{isLoggedIn ? (
				<>
					<button onClick={false}>Sign Out</button>
				</>
			) : (
				<div>Failed to load</div>
			)}
		</Fragment>
	);
};

export default RedirectComponent;
