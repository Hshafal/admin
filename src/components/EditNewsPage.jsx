import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import myAxios from "../api/myAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditNewsPage = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isImportant, setIsImportant] = useState(false);
	const [thumbnail, setThumbnail] = useState(null);
	const [date, setDate] = useState("");
	const [category, setCategory] = useState("");
	const queryClient = useQueryClient();
	const { id } = useParams();

	const { data, isLoading, error, isSuccess } = useQuery({
		queryKey: ["news", id],
		queryFn: async () => {
			const res = await myAxios.get(`/news/${id}`);
			return res.data;
		},
	});

	useEffect(() => {
		if (id && data) {
			setTitle(data.title);
			setDescription(data.description);
			setIsImportant(data.isImportant);
			setCategory(data.category);

			// Convert the date to yyyy-MM-dd format
			const dateObj = new Date(data.date);
			const formattedDate = dateObj.toISOString().split("T")[0];
			setDate(formattedDate);
		}
	}, [isSuccess, data, id]);

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData) => {
			const res = await myAxios.put(`/news/${id}`, formData);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["news"] });
			toast.success("تم تعديل الخبر بنجاح");
		},
		onError: () => {
			toast.error("فشل في تعديل الخبر");
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		// first upload the image alone
		if (thumbnail) {
			formData.append("images", thumbnail);

			const res = await myAxios.post("/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			formData.append("thumbnail", res.data.files[0].filename);
		}

		// send the rest of the data
		formData.append("title", title);
		formData.append("description", description);
		formData.append("isImportant", isImportant);
		formData.append("category", category); // Add category to formData
		formData.append("date", date); // Add date to formData
		try {
			mutate({
				title,
				description,
				isImportant,
				thumbnail: formData.get("thumbnail") || data.thumbnail,
				category, // Include category in the mutation
				date, // Include date in the mutation
			});
		} catch (error) {
			console.error("Error updating news:", error);
		}
	};

	if (isLoading) return <div>جاري التحميل...</div>;
	if (error) return <div>حدث خطأ أثناء جلب البيانات</div>;

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" dir="rtl">
			<h2 className="text-2xl font-bold mb-6">تعديل خبر</h2>
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
					<ReactQuill
						id="description"
						value={description}
						onChange={setDescription}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
						التاريخ
					</label>
					<input
						type="date"
						id="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
						الصنف
					</label>
					<select
						id="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
					>
						<option value="">اختر الصنف</option>
						<option value="NEWS">NEWS</option>
						<option value="AD">AD</option>
						<option value="NOTIFICATION">NOTIFICATION</option>
					</select>
				</div>
				<div className="flex items-center justify-between">
					<button
						disabled={isPending}
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{isPending ? "جاري التحميل" : "تعديل"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditNewsPage;
