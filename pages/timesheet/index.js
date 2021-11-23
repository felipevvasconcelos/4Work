import React, { useState, useContext, useRef, useEffect } from "react";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { StatusClass, TimeSheetClass } from "../../classes";
import { chartPallete } from "../../styles/pallete";
import { getSession, useSession } from "next-auth/dist/client";
import { TimesheetContext } from '../../Context/TImesheetContext';

//COMPONENTES
import { CardPanel, Layout, Loading, siteTittle, AppointmentCompleteDialog, CustomChartType, filterObjectsChart, BtnExportExcel, convertToAppointmentType } from "../../components";
import { Grid, IconButton, makeStyles, Tooltip, RadioGroup, Radio, MenuItem, Select, InputLabel, FormControl, FormControlLabel, TextField, Chip, Input } from "@material-ui/core";

//ICONES
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

//DEVEXPRESS
import { EditingState, IntegratedEditing, ViewState } from "@devexpress/dx-react-scheduler";
import { Scheduler, WeekView, Appointments, Toolbar, AppointmentTooltip, MonthView, DayView, DragDropProvider, DateNavigator, AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { AlarmAdd } from "@material-ui/icons";
import moment from "moment";

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

export default function Timesheet({ data, handleConfirmDialogOpen, handleConfirmDialogClose, GridTimesheet, appointmentsData, appointmentObjects, dtEnd, dtStart }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [session] = useSession();
	const [loading, setLoading] = useState(false);
	const [viewName, setViewName] = useState("Month");
	const [appoitmentDialog, setAppoitmentDialog] = React.useState(false);
	const [schedulerData, setSchedulerData] = useState([]);

	const [selectType, setSelectType] = useState([]);
	const [datesType, setDatesTypes] = useState({ dtStartType: dtStart, dtEndType: dtEnd });
	const [dataChartType, setDataChartType] = useState(appointmentsData);
	const [baseDataChartType, setBaseDataChartType] = useState(appointmentsData);
	const [baseAppointmentObjects, setBaseAppointmentObjects] = useState(appointmentObjects);
	const [editAppotinmentState, setEditAppotinmentState] = useState({});
	const [modalEditAppotiment, setModalEditAppotiment] = useState(false);

	useEffect(() => {
		GridTimesheet.map((timesheet) => {
			var state = GridTimesheet;
			// console.log(state);
			// console.log(timesheet[timesheet.type].name || timesheet[timesheet.type].title);
			state.push({
				endDate: timesheet.timeEnd,
				id: timesheet._id,
				startDate: timesheet.timeStart,
				title: timesheet[timesheet.type].name || timesheet[timesheet.type].title,
			});
			setSchedulerData(state);
		});
	}, []);

	const handleChangeDate = async (e) => setDatesTypes({ ...datesType, [e.target.name]: e.target.value });
	const handleAppoitment = () => setAppoitmentDialog(!appoitmentDialog);
	const handleAppoitmentEdit = () => setModalEditAppotiment(!modalEditAppotiment);
	const handleViewSwitcher = (e) => setViewName(e.target.value);

	const { validateTimesheet } = useContext(TimesheetContext);

	const handleCahngeStateAppointment = async () => {
		const data = { user: session.user._id }

		const timesheet = await fetch('/api/timesheet/filter', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		let response = await timesheet.json();
		var state = response;
			// console.log(state);
			// console.log(timesheet[timesheet.type].name || timesheet[timesheet.type].title);
			response.map((timesheet) => {
				state.push({
					endDate: timesheet.timeEnd,
					id: timesheet._id,
					startDate: timesheet.timeStart,
					title: timesheet[timesheet.type].name || timesheet[timesheet.type].title,
				});
			})
			
		setSchedulerData(response);

	}

	const handleGestingAppointment = async (element) => {
		// console.log(element.id);
		// const isValidUpdate = await validateTimesheet({
		// 	timeStart: element?.startDate || null,
		// 	timeEnd: element?.endDate || null,
		// 	_id: element?.id || null
		// });
		// if(isValidUpdate.success){
			console.log("Tentou Atualizar")
			await fetch(`api/timesheet/${element.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					_id: element.id,
			 		timeStart: element.startDate,
					timeEnd: element.endDate
				})
			})
		// }
		// else {
		// 	enqueueSnackbar("Verifique o Apontamento de horas!", { variant: "error" });
		// }
	}

	const hanldeDeletedAppotinment = async (element) => {
		await fetch(`api/timesheet/${element.id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		})
	}

	const handleBlurDate = async (e) => {
		try {
			var res = await fetch(`/api/timesheet/appointments/filter`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ timeStart: { $gte: datesType.dtStartType }, timeEnd: { $lte: datesType.dtEndType } }),
			});

			if (res.status !== 200) throw "Erro ao buscar os apontamentos!";

			const { appointments, appointmentsObjects } = await res.json();

			var newObjects = baseAppointmentObjects;
			appointmentsObjects.map((value) => !newObjects.filter((valueFilter) => valueFilter._id == value._id) && newObjects.push(value));
			setBaseAppointmentObjects(newObjects);

			if (Array.from(appointments).length > 0) {
				setBaseDataChartType(appointments);
				setDataChartType(appointments);
			} else {
				setBaseDataChartType([]);
				setDataChartType([]);
			}
		} catch (e) {
			enqueueSnackbar("Erro ao buscar os apontamentos", { variant: "error" });
			console.log(e);
		}
	};

	const handleSelect = (e) => {
		var selecteds = e.target.value;

		switch (e.target.name) {
			case "selectType":
				if (selecteds.includes("Todos") || selecteds.length == 0) {
					setDataChartType(baseDataChartType);
				} else {
					setDataChartType(filterObjectsChart(baseDataChartType, selecteds, "byType"));
				}

				setSelectType(selecteds);
				break;

			default:
				break;
		}
	};

	const handleEditScheduler = ({ added, changed, deleted }) => {
		let data = schedulerData;

		if (added) {
			const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
			data = [...data, { id: startingAddedId, ...added }];
		}

		if (changed) {
			data = data.map((appointment) => {
				changed[appointment.id] && handleGestingAppointment({
					...changed[appointment.id],
					id: appointment.id
				});
				return changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
			})
		}

		if (deleted !== undefined) {
			data = data.filter((appointment) => {
				appointment.id === deleted && hanldeDeletedAppotinment({ id: appointment.id });
				return appointment.id !== deleted
			})
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
							<ViewState defaultCurrentDate={Date.now()} currentViewName={viewName} />
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
							<AppointmentForm readOnly visible={false} onAppointmentDataChange={(appointment) => {
									if(appointment?.id){
										GridTimesheet.map((timesheet) => {
											timesheet._id === appointment.id && setEditAppotinmentState(timesheet)
										})
										handleAppoitmentEdit();
									}
									else{
										handleAppoitment();
									}
									
								}} 
							/>
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
													name="dtStartType"
													type="date"
													fullWidth
													label="Início"
													InputLabelProps={{
														shrink: true,
													}}
													value={datesType.dtStartType}
													onChange={handleChangeDate}
													onBlur={handleBlurDate}
												></TextField>
											</Grid>
											<Grid item xs={12} md={6}>
												<TextField
													name="dtEndType"
													type="date"
													fullWidth
													label="Fim"
													InputLabelProps={{
														shrink: true,
													}}
													value={datesType.dtEndType}
													onChange={handleChangeDate}
													onBlur={handleBlurDate}
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
														{baseAppointmentObjects?.map((value) => (
															<MenuItem id={value._id} key={value._id} value={`${value.number} - ${value.name}`}>
																{`${value.number} - ${value.name}`}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={1}>
												<BtnExportExcel apiData={convertToAppointmentType(dataChartType)} fileName={`HorasPorTipo_${new Date().toISOString()}`} />
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12} style={{ marginTop: "15px" }}>
								<CustomChartType dataChart={dataChartType} baseAppointmentObjects={baseAppointmentObjects} />
							</Grid>
						</Grid>
					</CardPanel>
				</Grid>
			</Grid>
			<AppointmentCompleteDialog open={appoitmentDialog} session={session} saveStateAppointment={handleCahngeStateAppointment} closeFunction={handleAppoitment}></AppointmentCompleteDialog>
			<AppointmentCompleteDialog open={modalEditAppotiment} session={session} saveStateAppointment={handleCahngeStateAppointment} onEdit={editAppotinmentState} closeFunction={handleAppoitmentEdit}></AppointmentCompleteDialog>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	//START CHART
	const timesheetClass = new TimeSheetClass();
	var dtStart = new Date();
	var dtEnd = new Date();
	dtStart.setDate(dtStart.getDate() - 20);

	const appointmentsData = await timesheetClass.getAppoitments({ timeStart: { $gte: dtStart }, timeEnd: { $lte: dtEnd } });
	const appointmentObjects = await timesheetClass.getAppoitmentObjects({ timeStart: { $gte: dtStart }, timeEnd: { $lte: dtEnd } });

	dtStart = moment(dtStart).format("YYYY-MM-DD");
	dtEnd = moment(dtEnd).format("YYYY-MM-DD");

	//END CHART

	const data = await new StatusClass().getAll();
	const session = await getSession(context);

	const GridTimesheet = await timesheetClass.getByFilter({ user: session.user._id });

	return { props: { appointmentsData, appointmentObjects, dtEnd, dtStart, data, GridTimesheet } };
}
