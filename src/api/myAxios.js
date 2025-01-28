import axios from "axios";

export const BASE_URL = import.meta.env.DEV ? "http://localhost:5000/api" : "https://moulhaqia.vercel.app/api";

const myAxios = axios.create({
	baseURL: BASE_URL,
});


myAxios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default myAxios;
