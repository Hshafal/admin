import React, { useEffect } from "react";
import PdfForm from "./uploadPDFForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import myAxios from "../../api/myAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useConfirm from "../../hooks/useConfirm";
import { UPLOAD_URL } from "../../api/myAxios";
import { formatDate } from "../../utils";

function PDFs() {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	}, [navigate]);

	return (
		<div className="container mx-auto p-4">
			<PdfForm />
			<PDFList />
		</div>
	);
}

function PDFList() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [openDeleteModal, ConfirmDeleteModal] = useConfirm();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["pdfs"],
		queryFn: async () => {
			const res = await myAxios.get("/pdfs");
			console.log(res.data);
			return res.data;
		},
	});

	const { mutate: deletePDF, isPending } = useMutation({
		mutationFn: async (pdfId) => {
			await myAxios.delete(`/pdfs/${pdfId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pdfs"] });
			toast.success("PDF deleted successfully");
		},
		onError: (error) => {
			console.log(error);
			toast.error("Failed to delete PDF");
		},
	});

	const handleDelete = (pdfId) => {
		openDeleteModal(() => {
			deletePDF(pdfId);
		}, "Do you want to delete this PDF?");
	};

	const handleEdit = (pdfId) => {
		navigate(`/edit-pdfs/${pdfId}`);
	};

	// const handleRowClick = (pdfId) => {
	// 	navigate(`/pdfs/${pdfId}`);
	// };

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
						<th className="py-2 px-4 border-b">Title</th>
						<th className="py-2 px-4 border-b">Date</th>
						<th className="py-2 px-4 border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((pdf) => (
							<tr key={pdf._id} className="cursor-pointer hover:bg-gray-100">
								<td className="py-2 px-4 border-b">
									<a download href={UPLOAD_URL + "/" + pdf.file}>
										{pdf.title}
									</a>
								</td>
								<td className="py-2 px-4 border-b">{formatDate(pdf.date)}</td>
								<td className="py-2 px-4 border-b">
									<button
										onClick={(e) => {
											e.stopPropagation(); // Prevent row click
											handleEdit(pdf._id);
										}}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation(); // Prevent row click
											handleDelete(pdf._id);
										}}
										className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
									>
										{isPending ? "Deleting" : "Delete"}
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default PDFs;
