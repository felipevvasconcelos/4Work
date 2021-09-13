import React, { useState, useContext, useRef, useEffect } from "react";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { StatusClass } from "../../classes";
import { chartPallete } from "../../styles/pallete";

import { getSession } from 'next-auth/client'

//COMPONENTES
import { CardPanel, Layout, Loading, siteTittle, AppointmentCompleteDialog } from "../../components";
import { Grid, IconButton, makeStyles, Tooltip, RadioGroup, Radio, MenuItem, Select, InputLabel, FormControl, FormControlLabel, TextField } from "@material-ui/core";

//ICONES
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

//DEVEXPRESS
import { EditingState, IntegratedEditing, ViewState } from "@devexpress/dx-react-scheduler";
import { Scheduler, WeekView, Appointments, Toolbar, AppointmentTooltip, MonthView, DayView, DragDropProvider, DateNavigator } from "@devexpress/dx-react-scheduler-material-ui";
import { Chart, ArgumentAxis, ValueAxis, BarSeries, LineSeries, Legend, Tooltip as TooltipChart } from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette, Stack, ValueScale } from "@devexpress/dx-react-chart";
import { AlarmAdd } from "@material-ui/icons";
import { useSession } from "next-auth/client";
import { TimesheetContextProvider } from '../../Context/TImesheetContext';
import TimesheetClass from '../../classes/TimeSheetClass';

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
	primary: {
		backgroundColor: theme.palette.primary,
	},
}));

const chartData = [
	{
		month: "Janeiro",
		melhoria1: 30,
		melhoria2: 40,
		projeto1: 30,
		chamado1: 10,
		projeto2: 60,
		projeto3: 10,
		total: 156,
	},
	{
		month: "Fevereiro",
		melhoria1: 30,
		melhoria2: 40,
		projeto1: 30,
		chamado1: 10,
		total: 176,
	},
	{
		month: "Março",
		melhoria1: 30,
		melhoria2: 40,
		chamado1: 10,
		projeto2: 60,
		projeto3: 10,
		total: 168,
	},
	{
		month: "Abril",
		melhoria1: 30,
		melhoria2: 40,
		projeto1: 30,
		chamado1: 10,
		projeto2: 60,
		total: 176,
	},
	{
		month: "Maio",
		melhoria1: 30,
		projeto1: 30,
		chamado1: 10,
		projeto2: 60,
		projeto3: 10,
		total: 168,
	},
	{
		month: "Junho",
		melhoria1: 30,
		melhoria2: 40,
		total: 176,
	},
];

const currentDate = "2018-11-01";

const ExternalViewSwitcher = ({ currentViewName, onChange }) => (
	<RadioGroup aria-label="Views" style={{ flexDirection: "row" }} name="views" value={currentViewName} onChange={onChange}>
		<FormControlLabel value="Day" control={<Radio color="primary" />} label="Diário" />
		<FormControlLabel value="Week" control={<Radio color="primary" />} label="Semana" />
		<FormControlLabel value="Month" control={<Radio color="primary" />} label="Mensal" />
	</RadioGroup>
);

const appointmentComponent = ({ children, style, ...restProps }) => (
	<Appointments.Appointment
		{...restProps}
		style={{
			...style,
			backgroundColor: "#cc6828",
		}}
	>
		{children}
	</Appointments.Appointment>
);

export default function Timesheet({ data, handleConfirmDialogOpen, handleConfirmDialogClose, GridTimesheet }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [session] = useSession();
	const [loading, setLoading] = useState(false);
	const [viewName, setViewName] = useState("Month");
	const [radioChart, setRadioChart] = useState("month");
	const [appoitmentDialog, setAppoitmentDialog] = React.useState(false);
	const [schedulerData, setSchedulerData] = useState([]);
	const [state, setState] = useState();
	const timesheetForm = useRef(null);

	useEffect(() =>{
		GridTimesheet.map((timesheet) => {
			var state = GridTimesheet;
			console.log(state);
			console.log(timesheet[timesheet.type].name || timesheet[timesheet.type].title);
			state.push({
				endDate: timesheet.timeEnd,
				id: timesheet._id,
				startDate: timesheet.timeStart,
				title: timesheet[timesheet.type].name || timesheet[timesheet.type].title
			})
			setSchedulerData(state);
		})
	},[])

	const handleAppoitment = () => {
		setAppoitmentDialog(!appoitmentDialog);
	};

	const handleViewSwitcher = (e) => {
		setViewName(e.target.value);
	};
	const handleRadioChart = (e) => {
		setRadioChart(e.target.value);
	};

	const handleOnChange = (event) => {
		setState({...state, [event.target.name]: event.target.value});
	}

	const handleEditScheduler = ({ added, changed, deleted }) => {
		let data = schedulerData;

		if (added) {
			const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
			data = [...data, { id: startingAddedId, ...added }];
		}

		if (changed) {
			data = data.map((appointment) => (changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
		}

		if (deleted !== undefined) {
			data = data.filter((appointment) => appointment.id !== deleted);
		}

		setSchedulerData(data);
	};

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<Grid container spacing={1} direction="row" alignItems="flex-start" xs={12}>
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Lançamentos de Horas" color="primary">
						<Grid container justify="flex-end" direction="row" spacing={2}>
							<ExternalViewSwitcher currentViewName={viewName} onChange={handleViewSwitcher} />
							<Tooltip title={"Adicionar Apontamento"}>
								<IconButton onClick={handleAppoitment} color="inherit" aria-label="open drawer" edge="start">
									<AlarmAdd style={{ color: "green" }} />
								</IconButton>
							</Tooltip>
						</Grid>
						<Scheduler data={schedulerData} locale="pt-BR" onAppointmentFormOpening>
							<ViewState defaultCurrentDate={Date.now()}  currentViewName={viewName} />
							<EditingState onCommitChanges={handleEditScheduler} />
							<IntegratedEditing />
							<Toolbar />

							<WeekView startDayHour={9} endDayHour={19} />
							<WeekView name="Work Week" excludedDays={[0, 6]} startDayHour={9} endDayHour={19} />
							<MonthView />
							<DayView />

							<DateNavigator />
							<Appointments appointmentComponent={appointmentComponent} />
							<AppointmentTooltip showCloseButton showOpenButton showDeleteButton />

							<DragDropProvider />
						</Scheduler>
					</CardPanel>
				</Grid>
				<Grid item xs={12} lg={6}>
					<CardPanel color="primary" subtitle="Visualização de Horas">
						<Grid container spacing={1} direction="row" alignItems="center" xs={12}>
							<Grid item xs={12} style={{ padding: "10px" }}>
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
													id="timeEnd"
													name="timeEnd"
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
												<FormControl fullWidth margin="normal">
													<InputLabel id="demo-simple-select-helper-label">Filtro Tipo</InputLabel>
													<Select labelId="demo-simple-select-label" id="demo-simple-select">
														<MenuItem value={10}>Todos</MenuItem>
														<MenuItem value={10}>Projeto tal</MenuItem>
														<MenuItem value={20}>Melhoria x</MenuItem>
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

							<Grid item xs={12} style={{ marginTop: "15px" }}>
								<Chart data={chartData}>
									<Palette scheme={chartPallete} />
									<ValueScale name="month" />

									<ArgumentAxis />
									<ValueAxis scaleName="month" />

									<BarSeries name="Melhoria 1" valueField="melhoria1" argumentField="month" scaleName="month" />
									<BarSeries name="Melhoria 2" valueField="melhoria2" argumentField="month" scaleName="month" />
									<BarSeries name="Projeto 1" valueField="projeto1" argumentField="month" scaleName="month" />
									<BarSeries name="Chamado 1" valueField="chamado1" argumentField="month" scaleName="month" />
									<BarSeries name="Projeto 2" valueField="projeto2" argumentField="month" scaleName="month" />
									<BarSeries name="Projeto 3" valueField="projeto3" argumentField="month" scaleName="month" />

									<LineSeries name="Meta Mês" valueField="total" argumentField="month" scaleName="month" color="green" />

									<Stack stacks={[{ series: ["Melhoria 1", "Melhoria 2", "Projeto 1", "Chamado 1", "Projeto 2", "Projeto 3"] }]} />

									<EventTracker />
									<TooltipChart />
									<Animation />
									<Legend />
								</Chart>
							</Grid>
						</Grid>
					</CardPanel>
				</Grid>
			</Grid>
			<AppointmentCompleteDialog open={appoitmentDialog} session={session} closeFunction={handleAppoitment}></AppointmentCompleteDialog>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const data = await new StatusClass().getAll();
	const timesheetClass = new TimesheetClass();

	const session = await getSession(context);
	
	const GridTimesheet = await timesheetClass.getByFilter({ user: session.user._id });

	return { props: { data, GridTimesheet } };
}
