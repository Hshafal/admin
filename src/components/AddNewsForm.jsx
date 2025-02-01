import React, { useState } from "react";
import myAxios from "../api/myAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const NewsForm = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isImportant, setIsImportant] = useState(false);
	const [thumbnail, setThumbnail] = useState(null);
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData) => {
			const res = await myAxios.post("/news", formData);
			return res.data;
		},
		onSuccess: () => {
			setTitle("");
			setDescription("");
			setIsImportant(false);
			setThumbnail(null);
			queryClient.invalidateQueries({ queryKey: ["news"] });
			toast.success("تم إنشاء الخبر بنجاح");
		},
		onError: (error) => {
			console.log(error);
			toast.error("فشل في إنشاء الخبر");
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		// first uplaod the image alone
		formData.append("images", thumbnail);

		const res = await myAxios.post("/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}); 

		// send the rest of the data with the name of the file
		formData.append("title", title);
		formData.append("description", description);
		formData.append("isImportant", isImportant);
		formData.append("thumbnail", res.data.files[0].filename);
		try {
			mutate({
				title,
				description,
				isImportant,
				thumbnail: res.data.files[0].filename,
			});
		} catch (error) {
			console.error("Error creating news:", error);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" dir="rtl">
			<h2 className="text-2xl font-bold mb-6">إنشاء خبر</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
						العنوان
					</label>
					<input
						type="text"
						id="title"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
						الوصف
					</label>
					<textarea
						id="description"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isImportant">
						مهم
					</label>
					<input
						type="checkbox"
						id="isImportant"
						checked={isImportant}
						onChange={(e) => setIsImportant(e.target.checked)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
						صورة الخبر
					</label>
					<input
						type="file"
						id="thumbnail"
						accept="image/*"
						onChange={(e) => setThumbnail(e.target.files[0])}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="flex items-center justify-between">
					<button
						disabled={isPending}
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{isPending ? "جاري التحميل" : "إضافة"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewsForm;
