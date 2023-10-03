import React, { useEffect, useState } from "react";
import { unsetHeadersWithUserToken } from "../../services/axios";
import axios from "axios";

const Header = (props) => {
	console.log("props in header : ", props);
	const logout = async (e) => {
		e.preventDefault();
		const token = sessionStorage.getItem("token");
		sessionStorage.removeItem("isLogin");
		unsetHeadersWithUserToken();
		// await logout();
		const logoutUrl = axios({
			method: "get",
			url: "http://localhost:5000/logout",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (response) {
				console.log(response);
			});
		sessionStorage.removeItem("token");
		props.history.push("/");
	};
	return (
		<header>
			<div className="header-area header-transparrent">
				<button onClick={(e) => logout(e)} className="btn head-btn2">
					Logout
				</button>
			</div>
		</header>
	);
};

export default Header;
