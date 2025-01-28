import React, { useEffect } from "react";
import NewsForm from "./AddNewsForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import myAxios from "../api/myAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useConfirm from "../hooks/useConfirm";

function News() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [openDeleteModal, ConfirmDeleteModal] = useConfirm();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	}, [navigate]);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["news"],
		queryFn: async () => {
			const res = await myAxios.get("/news");
			return res.data;
		},
	});

	const { mutate: deleteNews, isPending } = useMutation({
		mutationFn: async (newsId) => {
			await myAxios.delete(`/news/${newsId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["news"] });
			toast.success("تم حذف الخبر بنجاح");
		},
		onError: (error) => {
			console.log(error);
			toast.error("فشل في حذف الخبر");
		},
	});

	const handleDelete = (newsId) => {
		openDeleteModal(() => {
			deleteNews(newsId);
		}, "هل تريد حذف هذا الخبر");
	};

	const handleEdit = (newsId) => {
		navigate(`/edit-news/${newsId}`);
	};

	if (isLoading) {
		return <h1 className="text-center text-2xl mt-10">Loading ...</h1>;
	}

	if (isError) {
		return <h1 className="text-center text-2xl mt-10">Server error</h1>;
	}

	return (
		<div className="container mx-auto p-4">
			<ConfirmDeleteModal />
			<NewsForm />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
				{data &&
					data.map((news) => (
						<div key={news._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
							<h2 className="text-xl font-bold mb-2">{news.title}</h2>
							<p className="text-gray-700 mb-4">{news.description}</p>
							<img src="/news3.jpg" alt={news.title} className="w-full h-48 object-cover rounded-md mb-4" />
							<div className="flex justify-between">
								<button
									onClick={() => handleEdit(news._id)}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									تعديل
								</button>
								<button
									onClick={() => handleDelete(news._id)}
									className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									{isPending ? "جاري الحذف" : "حذف"}
								</button>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

export default News;
