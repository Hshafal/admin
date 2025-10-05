// NewsForm.js
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import myAxios from "../../api/myAxios";
import ReachEditor from "../../components/RichEditor"; // Import the ReachEditor component

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
			reset();
			queryClient.invalidateQueries({ queryKey: ["news"] });
			toast.success("تم إنشاء الخبر بنجاح");
		},
		onError: (error) => {
			console.error(error);
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
		const res = await myAxios.post("/upload/images", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const uploadedImageFilenames = res.data.files.map((file) => file.filename);
		const thumbnailFilename = uploadedImageFilenames.pop(); // Last filename is the thumbnail
		const imagesFilenames = uploadedImageFilenames;

		// Append the rest of the data with the filenames
		formData.append("title", data.title);
		formData.append("titleEnglish", data.titleEnglish);
		formData.append("titleRussian", data.titleRussian);
		formData.append("description", data.description);
		formData.append("descriptionEnglish", data.descriptionEnglish);
		formData.append("descriptionRussian", data.descriptionRussian);
		formData.append("isImportant", data.isImportant);
		formData.append("thumbnail", thumbnailFilename);
		formData.append("images", JSON.stringify(imagesFilenames));
		formData.append("category", data.category);
		formData.append("date", data.date);

		try {
			mutate({
				title: data.title,
				titleEnglish: data.titleEnglish,
				titleRussian: data.titleRussian,
				description: data.description,
				descriptionEnglish: data.descriptionEnglish,
				descriptionRussian: data.descriptionRussian,
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
		<div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" dir="rtl">
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
						htmlFor="titleEnglish"
					>
						العنوان بالإنجليزية
					</label>
					<input
						type="text"
						id="titleEnglish"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						{...register("titleEnglish")}
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="titleRussian"
					>
						العنوان بالروسية
					</label>
					<input
						type="text"
						id="titleRussian"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						{...register("titleRussian")}
					/>
				</div>
				{/* ReachEditor for descriptions */}
				<ReachEditor id="description" register={register} setValue={setValue} required />
				<ReachEditor id="descriptionEnglish" register={register} setValue={setValue} />
				<ReachEditor id="descriptionRussian" register={register} setValue={setValue} />

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
						<option value="SCHOLARSHIP">SCHOLARSHIP</option>
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
