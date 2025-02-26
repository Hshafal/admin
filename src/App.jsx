import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import News from "./pages/news/News";
import EditNewsPage from "./pages/news/EditNewsPage";
import NewsDetailsPage from "./pages/news/NewsDetails";
import PDFs from "./pages/pdf";

function App() {
	return (
		<div dir="rtl">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<News />} />
					<Route path="/pdfs" element={<PDFs />} />
					<Route path="/news/:id" element={<NewsDetailsPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/edit-news/:id" element={<EditNewsPage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
