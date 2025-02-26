import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import myAxios from "../../api/myAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const EditNewsPage = () => {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting },
	} = useForm();
	const queryClient = useQueryClient();
	const { id } = useParams();

	const { data, isLoading, error } = useQuery({
		queryKey: ["news", id],
		queryFn: async () => {
			const res = await myAxios.get(`/news/${id}`);
			return res.data;
		},
	});

	useEffect(() => {
		if (id && data) {
			setValue("title", data.title);
			setValue("description", data.description);
			setValue("isImportant", data.isImportant);
			setValue("category", data.category);

			// Convert the date to yyyy-MM-dd format
			const dateObj = new Date(data.date);
			const formattedDate = dateObj.toISOString().split("T")[0];
			setValue("date", formattedDate);
		}
	}, [data, id, setValue]);

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

	const onSubmit = async (formData) => {
		const formDataToSend = new FormData();
		const allImages = [...formData.images, formData.thumbnail[0]]; // Combine all images

		// Append all images to the FormData
		allImages.forEach((file) => {
			formDataToSend.append("images", file);
		});

		// Upload all images in a single request
		const res = await myAxios.post("/upload/images", formDataToSend, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const uploadedImageFilenames = res.data.files.map((file) => file.filename);

		// The last filename is the thumbnail
		const thumbnailFilename = uploadedImageFilenames.pop();
		const imagesFilenames = uploadedImageFilenames;

		// Append the rest of the data with the filenames
		formDataToSend.append("title", formData.title);
		formDataToSend.append("description", formData.description);
		formDataToSend.append("isImportant", formData.isImportant);
		formDataToSend.append("thumbnail", thumbnailFilename);
		formDataToSend.append("images", JSON.stringify(imagesFilenames));
		formDataToSend.append("category", formData.category);
		formDataToSend.append("date", formData.date);

		try {
			mutate({
				title: formData.title,
				description: formData.description,
				isImportant: formData.isImportant,
				thumbnail: thumbnailFilename,
				images: imagesFilenames,
				category: formData.category,
				date: formData.date,
			});
		} catch (error) {
			console.error("Error updating news:", error);
		}
	};

	if (isLoading) return <div>جاري التحميل...</div>;
	if (error) return <div>حدث خطأ أثناء جلب البيانات</div>;

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" dir="rtl">
			<h2 className="text-2xl text-center font-bold mb-6">تعديل المحتوى</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
						العنوان
					</label>
					<input
						type="text"
						id="title"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						{...register("title", { required: true })}
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="description"
					>
						الوصف
					</label>
					<ReactQuill
						id="description"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						{...register("description")}
						onChange={(value) => setValue("description", value)}
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="isImportant"
					>
						مهم
					</label>
					<input type="checkbox" id="isImportant" {...register("isImportant")} />
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="thumbnail"
					>
						صورة الخبر
					</label>
					<input
						type="file"
						id="thumbnail"
						accept="image/*"
						{...register("thumbnail")}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
						الصور
					</label>
					<input
						type="file"
						id="images"
						accept="image/*"
						multiple
						{...register("images")}
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
						{...register("date", { required: true })}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="category"
					>
						الصنف
					</label>
					<select
						id="category"
						{...register("category", { required: true })}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					>
						<option value="">اختر الصنف</option>
						<option value="NEWS">NEWS</option>
						<option value="AD">AD</option>
						<option value="NOTIFICATION">NOTIFICATION</option>
						<option value="ACTIVITY">ACTIVITY</option>
						<option value="EVENT">EVENT</option>
					</select>
				</div>
				<div className="flex items-center justify-between">
					<button
						disabled={isPending || isSubmitting}
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{isPending || isSubmitting ? "جاري التحميل" : "تعديل"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditNewsPage;
