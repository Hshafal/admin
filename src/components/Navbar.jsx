import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		setIsAuthenticated(!!token);
	}, [navigate]);	

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login"); // Redirect to the login page or any other page after logout
	};

	if (!isAuthenticated) {
		return null; // Do not render the navbar if there is no token
	}

	return (
		<nav className="bg-blue-500 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white text-lg font-bold">أدمن الملحقية</div>
				<div className="flex gap-5">
					<a href="/" className="text-white hover:text-gray-300">
						أخبار
					</a>
					<button onClick={handleLogout} className="text-white hover:text-gray-300">
						تسجيل خروج
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
