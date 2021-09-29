import moment from "moment";

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

export function compareValues(key, order = "asc") {
	return function innerSort(a, b) {
		if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0;
		}

		const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
		const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}
		return order === "desc" ? comparison * -1 : comparison;
	};
}


