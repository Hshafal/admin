export function formatDate(isoDate) {
	if (!isoDate) return "";
	const date = new Date(isoDate);
	const options = { year: "numeric", month: "numeric", day: "numeric" };
	return date.toLocaleDateString("ru-RU", options);
}
