export function jsonify(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export function timeStringToFloat(time) {
	var hoursMinutes = time.split(/[.:]/);
	var hours = parseInt(hoursMinutes[0], 10);
	var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
	return hours + minutes / 60;
}

export function currencyFormatterBr(value) {
	if (!Number(value)) return "";

	const amount = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value / 100);

	console.log(amount);

	return `${amount}`;
}