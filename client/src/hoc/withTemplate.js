import React, { Fragment } from "react";
import Header from "../containers/Header/header";
// import Slider from '../common/Slider/slider';
// import Footer from "../containers/common/Footer";

const withTemplate = (WrappedComponent, page = "other", otherProps = null) => {
	return (props) => {
		return (
			<React.Fragment>
				<Header {...props} />
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-10 mx-auto">
							<WrappedComponent {...props} />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	};
};

export default withTemplate;
