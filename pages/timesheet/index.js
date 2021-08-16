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
import { ViewState } from "@devexpress/dx-react-scheduler";
import { Scheduler, WeekView, Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { Chart, ArgumentAxis, ValueAxis, BarSeries, LineSeries, Legend } from "@devexpress/dx-react-chart-material-ui";
import { ValueScale } from "@devexpress/dx-react-chart";
import { FormControl } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";

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

const chartData = [
	{ month: "Jan", sale: 50, total: 987 },
	{ month: "Feb", sale: 100, total: 3000 },
	{ month: "March", sale: 30, total: 1100 },
	{ month: "April", sale: 107, total: 7100 },
	{ month: "May", sale: 95, total: 4300 },
	{ month: "June", sale: 150, total: 7500 },
];

const data1 = [
	["Descrição Teste", "Chamado", "Chamado Teste", "09:00", "13:00"],
	["Descrição Teste", "Melhoria", "Melhoria Teste", "14:00", "16:00"],
	["Descrição Teste", "Projeto", "Projeto Teste", "16:00", "18:00"],
];

const currentDate = "2018-11-01";
const schedulerData = [
	{ startDate: "2018-11-01T09:45", endDate: "2018-11-01T11:00", title: "Meeting" },
	{ startDate: "2018-11-01T12:00", endDate: "2018-11-01T13:30", title: "Go to a gym" },
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
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Lançamentos de Horas" color="primary">
						<Scheduler data={schedulerData}>
							<ViewState currentDate={currentDate} />
							<WeekView startDayHour={9} endDayHour={19} />
							<Appointments />
						</Scheduler>
					</CardPanel>
				</Grid>
				<Grid item xs={12} lg={6}>
					<CardPanel color="primary" subtitle="Visualização de Horas">
						<Grid container spacing={1} direction="row" alignItems="center" xs={12}>
							<Grid item xs={12}>
								<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
									<Grid item xs={12} md={3}>
										<FormControl fullWidth margin="normal">
											<InputLabel id="demo-simple-select-helper-label">Período</InputLabel>
											<Select labelId="demo-simple-select-label" id="demo-simple-select">
												<MenuItem value={10}>Mensal</MenuItem>
												<MenuItem value={20}>Semanal</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={3}>
										<FormControl fullWidth margin="normal">
											<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
											<Select labelId="demo-simple-select-label" id="demo-simple-select">
												<MenuItem value={10}>Projeto tal</MenuItem>
												<MenuItem value={20}>Melhoria x</MenuItem>
											</Select>
										</FormControl>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Chart data={chartData}>
									<ValueScale name="sale" />
									<ValueScale name="total" />
									<ArgumentAxis />
									<ValueAxis scaleName="sale" showGrid={false} showLine showTicks />
									<ValueAxis scaleName="total" position="right" showGrid={false} showLine showTicks />
									<BarSeries name="Units Sold" color="black" valueField="sale" argumentField="month" scaleName="sale" />
									<LineSeries name="Total Transactions" valueField="total" argumentField="month" scaleName="total" />
									<Legend />
								</Chart>
							</Grid>
						</Grid>
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
