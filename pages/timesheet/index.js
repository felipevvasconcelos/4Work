import React, { useState } from "react";
import { Button, Container, Grid, IconButton, makeStyles, Paper, Switch, TextField, Tooltip } from "@material-ui/core";
import { AddToQueue, Delete } from "@material-ui/icons";
import Head from "next/head";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import moment from "moment";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { StatusClass } from "../../classes";
import { Link } from "@material-ui/core";
import QueueIcon from "@material-ui/icons/Queue";
import { Inject, Month, ScheduleComponent, ViewDirective, ViewsDirective, Week, WorkWeek } from "@syncfusion/ej2-react-schedule";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "10px",
	},
	padding: {
		padding: "20px",
		width: "100%",
	},
	paddingBtn: {
		padding: "10px",
	},
}));

const columns = ["Descrição", "Tipo", "Fonte", "Hora Início", "Hora Fim", "Hora Início", "Hora Fim", "Total"];

const data1 = [
	["Descrição Teste", "Chamado", "Chamado Teste", "09:00", "13:00"],
	["Descrição Teste", "Melhoria", "Melhoria Teste", "14:00", "16:00"],
	["Descrição Teste", "Projeto", "Projeto Teste", "16:00", "18:00"],
];

const schedule = [
	{
		Id: 1,
		Subject: "Meeting - 1",
		StartTime: new Date(2018, 1, 15, 10, 0),
		EndTime: new Date(2018, 1, 16, 12, 30),
		IsAllDay: false,
	},
];

const customToolbar = (
	<Link href="#">
		<Tooltip title={"Nova Linha"}>
			<IconButton
				aria-label="add"
				style={{
					order: -1,
					color: "#66d393",
					marginLeft: "25px",
					marginRight: "-40px",
				}}
			>
				<QueueIcon />
			</IconButton>
		</Tooltip>
	</Link>
);

export default function Timesheet({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data1);

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<Grid container spacing={1} direction="row" alignItems="flex-start" xs={12}>
				<Grid item xs={6}>
					<CardPanel title="" subtitle="Visualização de lançamentos de horas" color="primary">
						<ScheduleComponent width="100%" height="100%" selectedDate={new Date(2018, 1, 15)} eventSettings={{ dataSource: schedule }}>
							<ViewsDirective>
								<ViewDirective option="WorkWeek" startHour="08:00" endHour="18:00" />
								<ViewDirective option="Week" startHour="08:00" endHour="18:00" />
								<ViewDirective option="Month" showWeekend={false} />
							</ViewsDirective>
							<Inject services={[WorkWeek, Week, Month]} />
						</ScheduleComponent>
					</CardPanel>
				</Grid>
				<Grid item xs={6}>
					<CardPanel title="" subtitle="Apontamento de horas" color="primary">
						<div className={classes.root}>
							<CustomDataTable data={dataTable} columns={columns}>
								{customToolbar}
							</CustomDataTable>
						</div>
					</CardPanel>
				</Grid>
			</Grid>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const data = await new StatusClass().getAll();
	return { props: { data } };
}
