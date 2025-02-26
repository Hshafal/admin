import React from "react";
import myAxios from "../../api/myAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PdfForm = () => {
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
			const res = await myAxios.post("/pdfs", formData);
			return res.data;
		},
		onSuccess: (data) => {
			console.log(data);
			reset();
			queryClient.invalidateQueries({ queryKey: ["pdfs"] });
			toast.success("تم رفع الملف بنجاح");
		},
		onError: (error) => {
			console.log(error);
			toast.error("فشل في رفع الملف");
		},
	});

	const onSubmit = async (data) => {
		const formData = new FormData();

		// upload file first
		formData.append("pdf", data.pdf[0]);
		const res = await myAxios.post("/upload/pdf", formData);

		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("file", res.data.file.filename);
		formData.append("date", data.date);
		formData.append("category", data.category);

		try {
			mutate({
				title: data.title,
				description: data.description,
				file: res.data.file.filename,
				date: data.date,
				category: data.category,
			});
		} catch (error) {
			console.error("Error uploading PDF:", error);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" dir="rtl">
			<h2 className="text-2xl text-center font-bold mb-6">رفع ملف PDF</h2>
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
						<option value="MAGAZINE">مجلة</option>
						<option value="ANNOUNCE-CUL">تعميم ملحقية</option>
						<option value="ANNOUNCE-MIN">تعميم وزارة</option>
					</select>
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
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pdf">
						ملف PDF
					</label>
					<input
						type="file"
						id="pdf"
						accept="application/pdf"
						{...register("pdf", { required: true })}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="flex items-center justify-between">
					<button
						disabled={isPending || isSubmitting}
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{isPending || isSubmitting ? "جاري التحميل" : "رفع"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default PdfForm;
