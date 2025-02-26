import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import myAxios from "../../api/myAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const NewsForm = () => {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting },
	} = useForm();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData) => {
			const res = await myAxios.post("/news", formData);
			return res.data;
		},
		onSuccess: (data) => {
			console.log(data);
			reset();
			queryClient.invalidateQueries({ queryKey: ["news"] });
			toast.success("تم إنشاء الخبر بنجاح");
		},
		onError: (error) => {
			console.log(error);
			toast.error("فشل في إنشاء الخبر");
		},
	});

	const onSubmit = async (data) => {
		const formData = new FormData();
		const allImages = [...data.images, data.thumbnail[0]]; // Combine all images

		// Append all images to the FormData
		allImages.forEach((file) => {
			formData.append("images", file);
		});

		// Upload all images in a single request
		const res = await myAxios.post("/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const uploadedImageFilenames = res.data.files.map((file) => file.filename);

		// The last filename is the thumbnail
		const thumbnailFilename = uploadedImageFilenames.pop();
		const imagesFilenames = uploadedImageFilenames;

		// Append the rest of the data with the filenames
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("isImportant", data.isImportant);
		formData.append("thumbnail", thumbnailFilename);
		formData.append("images", JSON.stringify(imagesFilenames));
		formData.append("category", data.category);
		formData.append("date", data.date);

		try {
			mutate({
				title: data.title,
				description: data.description,
				isImportant: data.isImportant,
				thumbnail: thumbnailFilename,
				images: imagesFilenames,
				category: data.category,
				date: data.date,
			});
		} catch (error) {
			console.error("Error creating news:", error);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" dir="rtl">
			<h2 className="text-2xl text-center font-bold mb-6">إنشاء محتوى</h2>
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
						{...register("description", { required: true })}
						onChange={(value) => setValue("description", value)}
					/>
				</div>

				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="thumbnail"
					>
						الصورة المصغرة
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
						name="date"
						{...register("date")}
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
						{...register("category")}
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
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="isImportant"
					>
						مهم
					</label>
					<input type="checkbox" id="isImportant" {...register("isImportant")} />
				</div>
				<div className="flex items-center justify-between">
					<button
						disabled={isPending || isSubmitting}
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{isPending || isSubmitting ? "جاري التحميل" : "إضافة"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewsForm;
