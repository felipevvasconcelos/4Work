import React, { useState } from "react";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { CardPanel, Layout, Loading, siteTittle, BtnExportExcel, CustomChartType, CustomChartUser, filterObjectsChart, convertToAppointmentUser } from "../../components";
import { FormControl, InputLabel, Grid, makeStyles, Select, MenuItem, TextField, Chip } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { TimeSheetClass, UserClass } from "../../classes";
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

export default function Timemanager({ users, appointmentsData, appointmentObjects, dtEnd, dtStart }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [selectType, setSelectType] = useState([]);
	const [selectUser, setSelectUser] = useState([]);

	const [dataChartType, setDataChartType] = useState(appointmentsData);
	const [dataChartUser, setDataChartUser] = useState(appointmentsData);
	const [baseDataChartType, setBaseDataChartType] = useState(appointmentsData);
	const [baseDataChartUser, setBaseDataChartUser] = useState(appointmentsData);

	const [baseAppointmentObjects, setBaseAppointmentObjects] = useState(appointmentObjects);

	const [datesType, setDatesTypes] = useState({ dtStartType: dtStart, dtEndType: dtEnd });
	const [datesUser, setDatesUser] = useState({ dtStartUser: dtStart, dtEndUser: dtEnd });

	const handleChangeDate = async (e) => {
		if (e.target.name.includes("Type")) {
			setDatesTypes({ ...datesType, [e.target.name]: e.target.value });
		} else {
			setDatesUser({ ...datesUser, [e.target.name]: e.target.value });
		}
	};

	const handleBlurDate = async (e) => {
		try {
			if (e.target.name.includes("Type")) {
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
			} else {
				var res = await fetch(`/api/timesheet/appointments/filter`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ timeStart: { $gte: datesUser.dtStartUser }, timeEnd: { $lte: datesUser.dtEndUser } }),
				});

				if (res.status !== 200) throw "Erro ao buscar os apontamentos!";

				const { appointments, appointmentsObjects } = await res.json();

				appointmentsObjects.map((value) => !newObjects.filter((valueFilter) => valueFilter._id == value._id) && newObjects.push(value));
				setBaseAppointmentObjects(newObjects);

				if (Array.from(appointments).length > 0) {
					setBaseDataChartUser(appointments);
					setDataChartUser(appointments);
				} else {
					setBaseDataChartUser([]);
					setDataChartUser([]);
				}
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

			case "selectUser":
				if (selecteds.includes("Todos") || selecteds.length == 0) {
					setDataChartUser(baseDataChartUser);
				} else {
					setDataChartUser(filterObjectsChart(baseDataChartUser, selecteds));
				}
				setSelectUser(selecteds);
				break;

			default:
				break;
		}
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
											<BtnExportExcel apiData={dataChartType} fileName={`HorasPorTipo_${new Date().toISOString()}`} />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<CustomChartType dataChart={dataChartType} baseAppointmentObjects={baseAppointmentObjects} />
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
												name="dtStartUser"
												type="date"
												fullWidth
												label="Início"
												InputLabelProps={{
													shrink: true,
												}}
												value={datesUser.dtStartUser}
												onChange={handleChangeDate}
												onBlur={handleBlurDate}
											></TextField>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												name="dtEndUser"
												type="date"
												fullWidth
												label="Fim"
												InputLabelProps={{
													shrink: true,
												}}
												value={datesUser.dtEndUser}
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
														<MenuItem id={user._id} key={user._id} value={user.name}>
															{user.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={1}>
											<BtnExportExcel apiData={convertToAppointmentUser(dataChartUser)} fileName={`HorasPorUsuario_${new Date().toISOString()}`} />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12}>
							<CustomChartUser dataChart={dataChartUser} baseAppointmentObjects={users} />
						</Grid>
					</CardPanel>
				</Grid>
			</Grid>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	var timesheetClass = new TimeSheetClass();
	var dtStart = new Date();
	var dtEnd = new Date();
	dtStart.setDate(dtStart.getDate() - 50);

	const appointmentsData = await timesheetClass.getAppoitments({ timeStart: { $gte: dtStart }, timeEnd: { $lte: dtEnd } });
	const appointmentObjects = await timesheetClass.getAppoitmentObjects({ timeStart: { $gte: dtStart }, timeEnd: { $lte: dtEnd } });
	const users = await new UserClass().getByFilter({});

	dtStart = moment(dtStart).format("YYYY-MM-DD");
	dtEnd = moment(dtEnd).format("YYYY-MM-DD");

	return { props: { appointmentsData, appointmentObjects, users, dtEnd, dtStart } };
}
