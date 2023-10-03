import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "../containers/Login/login";
import Dashboard from "../containers/Dashboard/dashboard";
import RedirectComponent from "../containers/Login/redirect";
// import FileUpload from "../containers/file/upload";
import ProtectedRoute from "./ProtectedRoute";

const MainRoutes = (props) => {
	let isLogin = sessionStorage.getItem("isLogin");
	console.log("main routes", props);
	console.log("window : ", window.location.search);
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" render={(props) => <Login {...props} />} />
				<Route
					exact
					path="/callback"
					render={(props) => (
						<RedirectComponent location={window.location.search} {...props} />
					)}
				/>
				<ProtectedRoute path="/dashboard" component={Dashboard} />
			</Switch>
		</BrowserRouter>
	);
};

export default MainRoutes;
