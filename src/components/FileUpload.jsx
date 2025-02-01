// src/components/FileUpload.js
import React, { useState } from "react";
import myAxios from "../api/myAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const FileUpload = () => {
	const [files, setFiles] = useState(null);
	const queryClient = useQueryClient();

	const uploadMutation = useMutation({
		mutationFn: async (formData) => {
			const response = await myAxios.post("/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(response.data)
			return response.data;
		},
	});

	const handleFileChange = (event) => {
		setFiles(event.target.files);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (files) {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append("images", files[i]);
			}
			uploadMutation.mutate(formData);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input type="file" multiple onChange={handleFileChange} />
				<button type="submit">Upload</button>
			</form>
			{uploadMutation.isLoading && <p>Uploading...</p>}
			{uploadMutation.isError && <p>Error uploading files</p>}
			{uploadMutation.isSuccess && <p>Files uploaded successfully</p>}
			
		</div>
	);
};

export default FileUpload;
