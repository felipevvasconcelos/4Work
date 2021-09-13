import React, { useState } from "react";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

import { FormControl, InputLabel, Grid, IconButton, makeStyles, Select, MenuItem, TextField, Tooltip, Chip } from "@material-ui/core";
import { Chart, ArgumentAxis, ValueAxis, BarSeries, LineSeries, Legend, Tooltip as TooltipChart } from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette, Stack, Title, ValueScale } from "@devexpress/dx-react-chart";
import { chartPallete } from "../../styles/pallete";
import { Input } from "@material-ui/core";
import { ProjectClass, UserClass } from "../../classes";

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
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
	noLabel: {
		marginTop: theme.spacing(3),
	},
}));

const filterObjectsChart = (arrayObjects, filter) => {
	let newArray = [];

	arrayObjects.map((value) => {
		let newObject = {};

		for (var prop in value) {
			if (!(filter.includes(prop) || prop == "xTarget")) {
				newObject = Object.assign(newObject, { [prop]: 0 });
			} else {
				newObject = Object.assign(newObject, { [prop]: value[prop] });
			}
		}

		newArray.push(newObject);
	});

	return newArray;
};

const chartDataType = [
	{
		xTarget: "Janeiro",
		["4 - Projeto1"]: 30,
		["5 - Projeto2"]: 40,
	},
	{
		xTarget: "Fevereiro",
		["4 - Projeto1"]: 30,
		["5 - Projeto2"]: 40,
	},
	{
		xTarget: "Março",
		["4 - Projeto1"]: 30,
		["5 - Projeto2"]: 40,
	},
	{
		xTarget: "Abril",
		["4 - Projeto1"]: 30,
		["5 - Projeto2"]: 40,
	},
	{
		xTarget: "Maio",
		["4 - Projeto1"]: 30,
		["5 - Projeto2"]: 40,
	},
	{
		xTarget: "Junho",
		["4 - Projeto1"]: 30,
		["5 - Projeto2"]: 40,
	},
];

const chartDataUser = [
	{
		user: "Felipe",
		melhoria1: 30,
		melhoria2: 40,
		projeto1: 30,
		chamado1: 10,
		projeto2: 60,
		projeto3: 10,
		total: 156,
	},
	{
		user: "Vinicius",
		melhoria1: 30,
		melhoria2: 40,
		projeto1: 30,
		chamado1: 10,
		total: 176,
	},
	{
		user: "Tiago",
		melhoria1: 30,
		melhoria2: 40,
		chamado1: 10,
		projeto2: 60,
		projeto3: 10,
		total: 168,
	},
	{
		user: "Nathan",
		melhoria1: 30,
		melhoria2: 40,
		projeto1: 30,
		chamado1: 10,
		projeto2: 60,
		total: 176,
	},
	{
		user: "Rafael",
		melhoria1: 30,
		projeto1: 30,
		chamado1: 10,
		projeto2: 60,
		projeto3: 10,
		total: 168,
	},
	{
		user: "Paulo",
		melhoria1: 30,
		melhoria2: 40,
		total: 176,
	},
];

export default function Timemanager({ users, projects, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);

	const [baseDataChartType, setBaseDataChartType] = useState(chartDataType);
	const [baseDataChartUser, setBaseDataChartUser] = useState(chartDataUser);

	const [dataChartType, setDataChartType] = useState(chartDataType);
	const [dataChartUser, setDataChartUser] = useState(chartDataUser);

	const [selectType, setSelectType] = useState([]);
	const [selectUser, setSelectUser] = useState([]);

	const handleChangeDate = (e) => {
		//buscar dados somente quando ouver alteração de dados
	};

	const handleSelect = (e) => {
		var selecteds = e.target.value;

		switch (e.target.name) {
			case "selectType":
				if (selecteds.includes("Todos")) {
					setDataChartType(baseDataChartType);
				} else {
					setDataChartType(filterObjectsChart(baseDataChartType, selecteds));
				}
				break;

			case "selectUser":
				if (selecteds.includes("Todos")) {
					setDataChartUser(baseDataChartUser);
				} else {
					setDataChartUser(filterObjectsChart(baseDataChartUser, selecteds));
				}

				break;

			default:
				break;
		}

		setSelectType(selecteds);
	};

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<Grid container spacing={1} direction="row" alignItems="flex-start" xs={12}>
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Visualização por Tipo" color="primary">
						<Grid item xs={12} style={{ padding: "15px" }}>
							<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12}>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12} style={{ marginBottom: "4px" }}>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Início"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Fim"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
										<Grid item xs={10} md={8}>
											<FormControl fullWidth className={classes.formControl}>
												<InputLabel id="demo-mutiple-chip-label">Origem</InputLabel>
												<Select
													labelId="demo-mutiple-chip-label"
													id="demo-mutiple-chip"
													name="selectType"
													multiple
													value={selectType}
													onChange={handleSelect}
													input={<Input id="select-multiple-chip" />}
													renderValue={(selected) => (
														<div className={classes.chips}>
															{selected.map((value) => (
																<Chip key={value} label={value} color="primary" className={classes.chip} />
															))}
														</div>
													)}
												>
													<MenuItem id="todos" key="todos" value="Todos">
														Todos
													</MenuItem>
													{projects?.map((project) => (
														<MenuItem id={project._id} key={project._id} value={`${project.projectNumber} - ${project.name}`}>
															{`${project.projectNumber} - ${project.name}`}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={1}>
											<Tooltip title={"Exportar Relatório"}>
												<IconButton style={{ color: "grey" }}>
													<FontAwesomeIcon icon={faFileExport} />
												</IconButton>
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Chart data={dataChartType}>
								<Palette scheme={chartPallete} />
								<ValueScale name="xTarget" />

								<ArgumentAxis />
								<ValueAxis scaleName="xTarget" />

								{projects?.map((project) => (
									<BarSeries name={`${project.projectNumber} - ${project.name}`} valueField={`${project.projectNumber} - ${project.name}`} argumentField="xTarget" scaleName="xTarget" />
								))}

								<Stack stacks={[{ series: projects.map((value) => `${value.projectNumber} - ${value.name}`) }]} />

								<EventTracker />
								<TooltipChart />
								<Animation />
								<Legend />
							</Chart>
						</Grid>
					</CardPanel>
				</Grid>
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Visualização por Usuário" color="primary">
						<Grid item xs={12} style={{ padding: "15px" }}>
							<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12}>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12} style={{ marginBottom: "4px" }}>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Início"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Fim"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
										<Grid item xs={10} md={8}>
											<FormControl fullWidth className={classes.formControl}>
												<InputLabel id="demo-mutiple-chip-label">Usuários</InputLabel>
												<Select
													labelId="demo-mutiple-chip-label"
													id="demo-mutiple-chip"
													name="selectUser"
													multiple
													value={selectUser}
													onChange={handleSelect}
													input={<Input id="select-multiple-chip" />}
													renderValue={(selected) => (
														<div className={classes.chips}>
															{selected.map((value, index) => (
																<Chip key={index} label={value} color="primary" className={classes.chip} />
															))}
														</div>
													)}
												>
													<MenuItem id="todos" key="todos" value="Todos">
														Todos
													</MenuItem>
													{users?.map((user) => (
														<MenuItem id={user._id} key={user.name} value={user.name}>
															{user.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={1}>
											<Tooltip title={"Exportar Relatório"}>
												<IconButton style={{ color: "grey" }}>
													<FontAwesomeIcon icon={faFileExport} />
												</IconButton>
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12}>
							<Chart data={dataChartUser}>
								<Palette scheme={chartPallete} />
								<ValueScale name="user" />

								<ArgumentAxis />
								<ValueAxis scaleName="user" />

								<BarSeries name="Melhoria 1" valueField="melhoria1" argumentField="user" scaleName="user" />
								<BarSeries name="Melhoria 2" valueField="melhoria2" argumentField="user" scaleName="user" />
								<BarSeries name="Projeto 1" valueField="projeto1" argumentField="user" scaleName="user" />
								<BarSeries name="Chamado 1" valueField="chamado1" argumentField="user" scaleName="user" />
								<BarSeries name="Projeto 2" valueField="projeto2" argumentField="user" scaleName="user" />
								<BarSeries name="Projeto 3" valueField="projeto3" argumentField="user" scaleName="user" />

								<Stack stacks={[{ series: ["Melhoria 1", "Melhoria 2", "Projeto 1", "Chamado 1", "Projeto 2", "Projeto 3"] }]} />

								<EventTracker />
								<TooltipChart />
								<Animation />
								<Legend />
							</Chart>
						</Grid>
					</CardPanel>
				</Grid>
			</Grid>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	// const date = Date.now();
	const projects = await new ProjectClass().getByFilter({});
	const users = await new UserClass().getByFilter({});

	return { props: { projects, users } };
}
