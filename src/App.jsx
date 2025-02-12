import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import News from "./components/News";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EditNewsPage from "./components/EditNewsPage";
import NewsDetailsPage from "./components/NewsDetails";

function App() {
	return (
		<div dir="rtl">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<News />} />
					<Route path="/news/:id" element={<NewsDetailsPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/edit-news/:id" element={<EditNewsPage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
