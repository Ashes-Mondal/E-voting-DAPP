import { Navigate } from "react-router-dom";
import Header from "../src/components/Header";

const Protected = ({ userDataLoading, user, children }) => {
	if (userDataLoading) {
		return <h1>Loading data...</h1>
	}
	else if (!user) {
		return <Navigate to="/" replace />;
	}
	else return (
		<section>
			<Header />
			{children}
		</section>
	);
};
export default Protected;