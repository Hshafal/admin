import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import myAxios, { IMAGES_URL } from "../api/myAxios";

const NewsDetailsPage = () => {
	const { id } = useParams();

	const { data, isLoading, error } = useQuery({
		queryKey: ["news", id],
		queryFn: async () => {
			const res = await myAxios.get(`/news/${id}`);
			return res.data;
		},
	});

	if (isLoading) return <div>جاري التحميل...</div>;
	if (error) return <div>حدث خطأ أثناء جلب البيانات</div>;

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	return (
		<div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-3xl font-bold mb-4">{data.title}</h1>
			<div className="mb-4">
				<img
					src={data.thumbnail ? `${IMAGES_URL}/${data.thumbnail}` : "/news3.jpg"}
					alt={data.title}
					className="w-full h-64 object-cover rounded-md mb-4"
				/>
			</div>
			<div className="mb-4">
				<div className="border p-4 rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: data.description }} />
			</div>
			<p className="text-gray-700 mb-2">{formatDate(data.date)}</p>
			<p className="text-gray-700 mb-4">{data.category}</p>
			{data.images && data.images.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.images.map((image, index) => (
						<img
							key={index}
							src={`${IMAGES_URL}/${image}`}
							alt={`News ${index}`}
							className="w-full h-48 object-cover rounded-md"
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default NewsDetailsPage;
