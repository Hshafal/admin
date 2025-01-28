import { useState } from "react";
import myAxios from "../api/myAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { mutate } = useMutation({
		mutationFn: async (password) => {
			const res = await myAxios.post("/admin/login", { password });
			return res.data;
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			navigate("/");
		},
		onError: (error) => {
			console.log(error);
			toast.error("فشل في تسجيل الدخول");
		},
	});

	function handleSubmit(e) {
		e.preventDefault();
		mutate(password);
	}

	return (
		<div dir="rtl" className="bg-gray-100 w-full h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h2>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="password"
					>
						كلمة المرور
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="flex items-center justify-between">
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
					>
						تسجيل دخول
					</button>
				</div>
			</form>
		</div>
	);
}
