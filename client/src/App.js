import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MainRoutes from "./global/main.routes";

function App() {
	return (
		<div className="container mt-4">
			<h4 className="display-4 text-center mb-4">
				<i className="fab fa-react" /> Login Demo
			</h4>
			<MainRoutes />
		</div>
	);
}

export default App;
