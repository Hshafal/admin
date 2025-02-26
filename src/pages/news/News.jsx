import React, { useEffect } from "react";
import NewsForm from "./AddNewsForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import myAxios from "../../api/myAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useConfirm from "../../hooks/useConfirm";
import { UPLOAD_URL } from "../../api/myAxios";
import { formatDate } from "../../utils";

function News() {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	}, [navigate]);

	return (
		<div className="container mx-auto p-4">
			<NewsForm />
			<NewsList />
		</div>
	);
}

function NewsList() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [openDeleteModal, ConfirmDeleteModal] = useConfirm();

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

	const handleRowClick = (newsId) => {
		navigate(`/news/${newsId}`);
	};

	if (isLoading) {
		return <h1 className="text-center text-2xl mt-10">Loading ...</h1>;
	}

	if (isError) {
		return <h1 className="text-center text-2xl mt-10">Server error</h1>;
	}

	return (
		<div className="overflow-x-auto mt-6">
			<ConfirmDeleteModal />
			<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
				<thead className="bg-gray-50">
					<tr>
						<th className="py-2 px-4 border-b">العنوان</th>
						<th className="py-2 px-4 border-b">الصورة المصغرة</th>
						<th className="py-2 px-4 border-b">التاريخ</th>
						<th className="py-2 px-4 border-b">الصنف</th>
						<th className="py-2 px-4 border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{data &&
						data
							.slice() // Create a copy of the array to avoid mutating the original data
							.sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order
							.map((news) => (
								<tr
									key={news._id}
									className="cursor-pointer hover:bg-gray-100"
									onClick={() => handleRowClick(news._id)}
								>
									<td className="py-2 px-4 border-b">{news.title}</td>
									<td className="py-2 px-4 border-b">
										<img
											src={
												news.thumbnail
													? `${UPLOAD_URL}/${news.thumbnail}`
													: "/news3.jpg"
											}
											alt={news.title}
											className="w-24 h-16 object-cover rounded-md"
										/>
									</td>
									<td className="py-2 px-4 border-b">{formatDate(news.date)}</td>
									<td className="py-2 px-4 border-b">{news.category}</td>
									<td className="py-2 px-4 border-b">
										<button
											onClick={(e) => {
												e.stopPropagation(); // Prevent row click
												handleEdit(news._id);
											}}
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
										>
											تعديل
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation(); // Prevent row click
												handleDelete(news._id);
											}}
											className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
										>
											{isPending ? "جاري الحذف" : "حذف"}
										</button>
									</td>
								</tr>
							))}
				</tbody>
			</table>
		</div>
	);
}

export default News;
