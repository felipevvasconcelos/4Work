import React, { useRef, useState } from "react";

import { chartPallete } from "../../styles/pallete";
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Legend, Tooltip as TooltipChart } from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette, Stack, ValueScale } from "@devexpress/dx-react-chart";
import moment from "moment";

export const filterObjectsChart = (arrayObjects, filter, type) => {
	if (type === "byType") {
		return arrayObjects.filter((element) => {
			var name = element.type === "project" ? "name" : "title";

			switch (element.type) {
				case "project":
					var numberName = "projectNumber";
					break;
				case "call":
					var numberName = "callNumber";
					break;
				case "improvement":
					var numberName = "improvementNumber";
					break;
				default:
					return;
			}

			if (filter.includes(`${element[element.type][numberName]} - ${element[element.type][name]}`)) return element;
		});
	} else {
		return arrayObjects.filter((element) => filter.includes(element.user.name));
	}
};

export const convertToAppointmentType = (arrayAppointment) => {
	if (arrayAppointment.length <= 0) return [];

	var firstDate = new Date(arrayAppointment[0].timeStart);
	var lastDate = new Date(arrayAppointment[arrayAppointment.length - 1].timeStart);
	var daysDiff = Math.trunc(moment.duration(moment(lastDate).diff(firstDate)).asDays());
	var formater = daysDiff <= 28 ? "DD-MM" : "MMMM";
	var newAppointments = [];

	Array.from(arrayAppointment).forEach((element) => {
		var startTime = new Date(element.timeStart);
		var endTime = new Date(element.timeEnd);

		var hoursDiff = moment.duration(moment(endTime).diff(startTime)).asHours();

		switch (element.type) {
			case "project":
				var numberName = "projectNumber";
				break;
			case "call":
				var numberName = "callNumber";
				break;
			case "improvement":
				var numberName = "improvementNumber";
				break;
			default:
				return;
		}

		var name = element.type === "project" ? "name" : "title";

		var newAppointment = newAppointments.filter((value) => value.xTarget == moment(startTime).locale("pt").format(formater))[0];

		if (newAppointment) {
			if (newAppointment.hasOwnProperty(`${element[element.type][numberName]} - ${element.name}`)) {
				newAppointment[`${element[element.type][numberName]} - ${element[element.type][name]}`] = newAppointment[element.type][`${element[numberName]} - ${element[element.type][name]}`] + hoursDiff;
			} else {
				newAppointment[`${element[element.type][numberName]} - ${element[element.type][name]}`] = hoursDiff;
			}
		} else {
			newAppointments.push({
				xTarget: moment(startTime).locale("pt").format(formater),
				[`${element[element.type][numberName]} - ${element[element.type][name]}`]: hoursDiff,
			});
		}
	});

	return newAppointments;
};

export const convertToAppointmentUser = (arrayAppointment) => {
	if (arrayAppointment.length <= 0) return [];

	var firstDate = new Date(arrayAppointment[0].timeStart);
	var lastDate = new Date(arrayAppointment[arrayAppointment.length - 1].timeStart);
	var daysDiff = Math.trunc(moment.duration(moment(lastDate).diff(firstDate)).asDays());
	var formater = daysDiff <= 28 ? "DD-MM" : "MMMM";
	var newAppointments = [];

	Array.from(arrayAppointment).forEach((element) => {
		var startTime = new Date(element.timeStart);
		var endTime = new Date(element.timeEnd);
		var hoursDiff = moment.duration(moment(endTime).diff(startTime)).asHours();

		var newAppointment = newAppointments.filter((value) => value.xTarget == moment(startTime).locale("pt").format(formater))[0];

		if (newAppointment) {
			if (newAppointment.hasOwnProperty(element.user.name)) {
				newAppointment[element.user.name] = newAppointment[element.user.name] + hoursDiff;
			} else {
				newAppointment[element.user.name] = hoursDiff;
			}
		} else {
			newAppointments.push({
				xTarget: moment(startTime).locale("pt").format(formater),
				[element.user.name]: hoursDiff,
			});
		}
	});

	return newAppointments;
};

export function CustomChartType({ dataChart, baseAppointmentObjects }) {
	return (
		<Chart data={convertToAppointmentType(dataChart)}>
			<Palette scheme={chartPallete} />
			<ValueScale name="xTarget" />

			<ArgumentAxis />
			<ValueAxis scaleName="xTarget" />

			{baseAppointmentObjects?.map((object) => (
				<BarSeries name={`${object.number} - ${object.name}`} valueField={`${object.number} - ${object.name}`} argumentField="xTarget" scaleName="xTarget" />
			))}

			<Stack stacks={[{ series: baseAppointmentObjects.map((value) => `${value.number} - ${value.name}`) }]} />

			<EventTracker />
			<TooltipChart />
			<Animation />
			<Legend />
		</Chart>
	);
}

export function CustomChartUser({ dataChart, baseAppointmentObjects }) {
	return (
		<Chart data={convertToAppointmentUser(dataChart)}>
			<Palette scheme={chartPallete} />
			<ValueScale name="xTarget" />

			<ArgumentAxis />
			<ValueAxis scaleName="xTarget" />

			{baseAppointmentObjects?.map((user) => (
				<BarSeries name={user.name} valueField={user.name} argumentField="xTarget" scaleName="xTarget" />
			))}

			<Stack
				stacks={[
					{
						series: baseAppointmentObjects.map((value) => value.name),
					},
				]}
			/>

			<EventTracker />
			<TooltipChart />
			<Animation />
			<Legend />
		</Chart>
	);
}
