// ReachEditor.js
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Define custom toolbar options
const toolbarOptions = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	["bold", "italic", "underline"], // toggled buttons
	["link"],
	[{ list: "ordered" }, { list: "bullet" }],
	[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
	[{ color: [] }, { background: [] }], // dropdown with defaults from theme
	[{ align: [] }],
	["clean"], // remove formatting button
];

const ReachEditor = ({ id, register, setValue, required }) => {
	const modules = {
		toolbar: {
			container: toolbarOptions,
			handlers: {
				direction: function (value) {
					const quill = this.quill;
					const currentDirection = quill.root.style.direction;
					quill.root.style.direction = currentDirection === "rtl" ? "ltr" : "rtl";
				},
			},
		},
	};

	return (
		<div className="mb-4">
			<ReactQuill
				id={id}
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				{...register(id, { required })}
				onChange={(value) => setValue(id, value)}
				modules={modules}
			/>
		</div>
	);
};

export default ReachEditor;
