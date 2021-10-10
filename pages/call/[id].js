import "date-fns";
import Head from "next/head";
import React, { useEffect } from "react";
import { CardPanel, Layout, siteTittle, Loading } from "../../components";
import { useRouter } from "next/router";
import { Container, Grid, TextField, FormControlLabel, Checkbox, Tooltip, Select, MenuItem, FormControl, InputLabel, Button, IconButton, Hidden, Backdrop, Avatar, ListItemAvatar, Stepper, Step, StepLabel, StepContent, Typography } from "@material-ui/core";
import { Block, Edit, Person } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { useSnackbar } from "notistack";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MUIRichTextEditor from "mui-rte";
import SaveIcon from "@material-ui/icons/Save";
import QueueIcon from "@material-ui/icons/Queue";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import { Save, ViewList } from "@material-ui/icons";
import CallClass from "../../classes/CallClass";
import ProjectClass from "../../classes/ProjectClass";
import StatusClass from "../../classes/StatusClass";
import TypeCallClass from "../../classes/TypeCallClass";
import { useSession } from "next-auth/dist/client";
import dayjs from "dayjs";
import UserClass from "../../classes/UserClass";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			width: "100%",
			height: "100%",
		},
	},
	padding: {
		padding: "0px",
		width: "100%",
	},
	formRoot: {
		display: "flex",
		flexWrap: "wrap",
		padding: "20px",
	},
	info: {
		color: theme.palette.info.main,
	},
	danger: {
		color: theme.palette.error.light,
	},
	fab: {
		margin: 0,
		top: "auto",
		right: 20,
		bottom: 20,
		left: "auto",
		position: "fixed",
	},
	fabInfo: {
		color: "white",
		backgroundColor: theme.palette.info.main,
		"&:hover": {
			color: theme.palette.info.main,
			background: "white",
		},
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
		marginLeft: theme.spacing(-2),
	},
}));

export default function CallById({ projects, data, status, typesCall, users }) {
	const route = useRouter();
	const classes = useStyles();
	const [session] = useSession();
	const [open, setOpen] = React.useState(false);
	const [state, setState] = React.useState(data);
	const [hidden, setHidden] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [activeStep, setActiveStep] = React.useState(data.treatments.length - 1);
	const [editTreatment, setEditTreatment] = React.useState({ toolbar: false, readOnly: true });

	const { enqueueSnackbar } = useSnackbar();
	const callForm = React.useRef(null);

	const CalculateDeadline = (TypeCall) => {
		const InitialTerm = state.dateCreate || Date.now();
		const DeadLine = dayjs(InitialTerm).add(TypeCall || 1, "hour");
		return DeadLine;
	};

	useEffect(() => {
		if (state.type) {
			const selectedObejct = typesCall.find((element) => element._id === state.type);

			if (selectedObejct) {
				const newDeadLine = CalculateDeadline(selectedObejct.slaDefault);

				setState({ ...state, deadline: newDeadLine });
			}
		}
	}, [state.type]);

	useEffect(() => {
		if (!state._id && session) {
			setState({ ...state, userCreateName: session.user.name, userModifiedName: session.user.name, userCreate: session.user._id, userModified: session.user._id });
		} else if (session) {
			setState({ ...state, userModifiedName: session.user.name, userModified: session.user._id, userCreateName: state.userCreate.name, userCreate: state.userCreate._id, dateModified: Date.now() });
		}
	}, [session]);

	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.value });
		console.log(event);
	};
	const handleChangeDescriptionForm = (event) => {
		setState({ ...state, description: event });
		enqueueSnackbar("Descrição salva com sucesso!", { variant: "success" });
	};

	const handleChangeDescriptionTreatment = async (description, index) => {
		let treatments = [...state.treatments];
		treatments[index] = { ...state.treatments[index], description: description, userModified: session.user._id, dateModified: new Date() };

		var res = await fetch(`/api/call/treatments/${route.query.id}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(treatments),
		});

		if (res.status === 200) {
			setState({ ...state, treatments: treatments });
			handleEditTreatment();
			enqueueSnackbar("Tratativa salva com sucesso!", { variant: "success" });
		} else {
			enqueueSnackbar("Erro ao salvar a tratativa!", { variant: "error" });
		}
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleBack = () => {
		if (editTreatment.toolbar) handleEditTreatment();
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleNext = () => {
		if (editTreatment.toolbar) handleEditTreatment();
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleEditTreatment = () => {
		setEditTreatment({ toolbar: !editTreatment.toolbar, readOnly: !editTreatment.readOnly });
	};

	const handleAddTreatment = () => {
		let treatments = [...state.treatments];
		treatments.push({ description: "", userModified: session.user._id, dateModified: new Date(), userCreate: { _id: session.user._id, name: session.user.name }, dateCreate: new Date() });
		setState({ ...state, treatments: treatments });
		setActiveStep(treatments.length - 1);
	};

	function getStepContent(step) {
		return (
			<Grid xs={12} md={12} direction="row" className={classes.padding}>
				<Grid item xs={12} style={{ minHeight: "200px" }}>
					<Grid item xs={12}>
						<h3 style={{ marginBottom: "-10px" }}>Tratativa de {state.treatments[step].userCreate.name}</h3>
					</Grid>
					{/* <Typography>{state.treatments[step].description}</Typography> */}
					<Grid item xs={12}>
						<Grid container justify="flex-end" xs={12}>
							<Tooltip title={"Editar"}>
								<IconButton size="small" color="primary" onClick={handleEditTreatment}>
									{editTreatment.toolbar ? <Block /> : <Edit />}
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
					<MUIRichTextEditor id={step} toolbar={editTreatment.toolbar} readOnly={editTreatment.readOnly} onSave={(event) => handleChangeDescriptionTreatment(event, step)} label="Descreva sua tratativa aqui..." value={state.treatments[step].description} />
				</Grid>
			</Grid>
		);
	}

	const handleSubmitForm = async (elementForm) => {
		elementForm.preventDefault(elementForm);

		if (!callForm.current.checkValidity()) {
			enqueueSnackbar("Prencha todos os campos!", { variant: "error" });
			return;
		}

		if (!state.description) {
			enqueueSnackbar("Prencha a Descrição ou Salve ela!", { variant: "error" });
			return;
		}
		setLoading(true);

		try {
			const configFetch = (method) => {
				return {
					method,
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(state),
				};
			};

			var res = await fetch(`/api/call${route.query.id !== "new" ? "/" + route.query.id : ""}`, configFetch(route.query.id === "new" ? "POST" : "PUT"));

			if (res.status === 200) {
				enqueueSnackbar("Chamada Realizada!", { variant: "success" });
				route.push("/call");
			} else {
				console.log(await res.json());
				enqueueSnackbar("Erro salvar o chamado, contate um administrador do sistema", { variant: "error" });
			}
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<Container maxWidth="xl">
				<Grid container spacing={3} xs={12}>
					<Grid item xs={12} md={route.query.id == "new" ? 12 : 6}>
						<CardPanel title={route.query.id == "new" ? "Novo Chamado" : "Chamado"} subtitle={route.query.id == "new" ? "Cadastro de novos chamados" : "Edição de chamado"} color="primary">
							<div className={classes.root}>
								<form className={classes.formRoot} ref={callForm}>
									<Grid container spacing={3} alignContent="flex-end">
										<Grid item xs={12}>
											<h3 style={{ marginBottom: "-30px" }}>Informações Principais</h3>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField id="tittleCall" margin="normal" name="title" onChange={handleChange} fullWidth label="Título Chamado" required value={state.title} />
										</Grid>
										<Grid item xs={12} md={3} container alignContent="flex-end">
											<FormControl fullWidth margin="normal">
												<InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
												<Select required labelId="demo-simple-select-label" id="demo-simple-select" onChange={handleChange} name="status" value={state.status}>
													{status && status.map((element) => <MenuItem value={element._id}>{element.name}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12} md={3} container alignContent="flex-end">
											<TextField margin="normal" fullWidth label="Número" onChange={handleChange} name="callNumber" disabled value={state.callNumber} />
										</Grid>
									</Grid>

									<Grid container spacing={3} alignContent="flex-end">
										<Grid item xs={12} md={3}>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<KeyboardDatePicker fullWidth id="date-picker-inline" disabled disableToolbar variant="inline" format="dd/MM/yyyy HH:MM" margin="normal" label="Criado em" value={state.dateCreate} name="dateCreate" onChange={handleChange} KeyboardButtonProps={{ "aria-label": "change date" }} />
											</MuiPickersUtilsProvider>
										</Grid>
										<Grid item xs={12} md={3}>
											<TextField margin="normal" fullWidth label="Criado por" name="userCreateName" onChange={handleChange} disabled value={state.userCreateName} />
										</Grid>
										<Grid item xs={12} md={3}>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<KeyboardDatePicker fullWidth id="date-picker-inline" disabled disableToolbar variant="inline" format="dd/MM/yyyy HH:MM" margin="normal" label="Modificado em" value={state.dateModified} name="dateModified" onChange={handleChange} KeyboardButtonProps={{ "aria-label": "change date" }} />
											</MuiPickersUtilsProvider>
										</Grid>
										<Grid item xs={12} md={3}>
											<TextField margin="normal" fullWidth label="Modificado por" name="userModifiedName" onChange={handleChange} disabled value={state.userModifiedName} />
										</Grid>
									</Grid>

									<Grid container spacing={3} alignContent="flex-end">
										<Grid item xs={12} md={3} container alignContent="flex-end">
											<FormControl fullWidth margin="normal">
												<InputLabel id="demo-simple-select-helper-label">Projeto</InputLabel>
												<Select labelId="demo-simple-select-label" onChange={handleChange} required name="project" value={state.project} id="demo-simple-select">
													{projects &&
														projects.map((project, key) => (
															<MenuItem value={project._id} key={key}>
																{project.name}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12} md={3} container alignContent="flex-end">
											<FormControl fullWidth margin="normal">
												<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
												<Select labelId="demo-simple-select-label" id="demo-simple-select" onChange={handleChange} name="type" required value={state.type}>
													{typesCall && typesCall.map((element) => <MenuItem value={element._id}>{element.name}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12} md={3} container alignContent="flex-end">
											<FormControl fullWidth margin="normal">
												<InputLabel id="demo-simple-select-helper-label">Atendente</InputLabel>
												<Select labelId="demo-simple-select-label" id="demo-simple-select" onChange={handleChange} name="user" required value={state.user}>
													{users &&
														users.map((element) => (
															<MenuItem value={element._id}>
																<ListItemAvatar>
																	{element.logo.image ? (
																		<Avatar src={u.logo.image} />
																	) : (
																		<Avatar>
																			<Person />
																		</Avatar>
																	)}
																</ListItemAvatar>
																{element.name}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12} md={3}>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<KeyboardDatePicker fullWidth id="date-picker-inline" disabled disableToolbar variant="inline" format="dd/MM/yyyy HH:MM" margin="normal" label="Prazo" value={state.deadline} name="deadline" onChange={handleChange} KeyboardButtonProps={{ "aria-label": "change date" }} />
											</MuiPickersUtilsProvider>
										</Grid>
										{/* <Grid item xs={12} md={6} container alignContent="flex-end">
									<FormControl fullWidth margin="normal">
										<Button variant="outlined" component="label">
											{" "}
											Adicionar arquivo
											<input type="file" hidden />
										</Button>
									</FormControl>
								</Grid> */}
										<Grid item xs={12} style={{ minHeight: "200px" }}>
											<Grid item xs={12}>
												<h3 style={{ marginBottom: "-10px" }}>Solicitação</h3>
											</Grid>
											<MUIRichTextEditor id="description" label="Descreva sua solicitação aqui..." onSave={handleChangeDescriptionForm} value={state.description} />
										</Grid>
									</Grid>
									<Hidden smDown>
										<Grid container xs="12" justify="flex-end" style={{ marginTop: "10px" }} spacing={3} className={classes.marginBtn}>
											<Button color="secondary" margin="normal" startIcon={<ViewList />} onClick={(e) => route.push("/call")}>
												Voltar para Lista
											</Button>
											<Button name="saveAndClose" color="primary" variant="outlined" type="submit" onClick={handleSubmitForm} startIcon={<Save />}>
												Salvar e Fechar
											</Button>
										</Grid>
									</Hidden>
									<Hidden mdUp>
										<Backdrop open={open} />
										<SpeedDial ariaLabel="SpeedDial" className={classes.fab} hidden={hidden} icon={<MenuIcon />} onClose={handleClose} onOpen={handleOpen} open={open}>
											<SpeedDialAction key="Lista" icon={<ViewList className={classes.info} />} tooltipTitle="Lista" tooltipOpen onClick={(e) => route.push("/call")} />
											<SpeedDialAction name="saveAndClose" key="Salvar" icon={<SaveIcon className={classes.info} />} tooltipTitle="Salvar e Fechar" tooltipOpen type="submit" onClick={handleSubmitForm} />
										</SpeedDial>
									</Hidden>
								</form>
							</div>
						</CardPanel>
					</Grid>
					{route.query.id != "new" && (
						<Grid item xs={12} md={6}>
							<CardPanel title="Tratativas" subtitle="Linha de tempo das tratativas do chamado" color="primary">
								<Grid container justify="flex-end" xs={12}>
									<Tooltip title={"Nova Tratativa"}>
										<IconButton
											onClick={handleAddTreatment}
											size="small"
											color="primary"
											style={{
												color: "#66d393",
											}}
										>
											<QueueIcon />
										</IconButton>
									</Tooltip>
								</Grid>
								<Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
									{state.treatments.map((value, index) => {
										const stepProps = {};
										const labelProps = {};
										return (
											<Step key={value.dateCreate} {...stepProps}>
												<StepLabel {...labelProps}>{moment(value.dateCreate).format("DD/MM/YYYY HH:mm")}</StepLabel>
												<StepContent>
													<Container maxWidth="xl">
														{getStepContent(index)}
														<div className={classes.actionsContainer}>
															<div>
																<Button name="backStep" disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
																	Voltar
																</Button>
																<Button name="nextStep" disabled={activeStep === state.treatments.length - 1} variant="contained" color="primary" onClick={handleNext} className={classes.button}>
																	Próximo
																</Button>
															</div>
														</div>
													</Container>
												</StepContent>
											</Step>
										);
									})}
								</Stepper>
							</CardPanel>
						</Grid>
					)}
				</Grid>
			</Container>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const callClass = new CallClass();
	const projectClass = new ProjectClass();
	const statusClass = new StatusClass();
	const typeCallClass = new TypeCallClass();
	const userClass = new UserClass();

	const projects = await projectClass.getAll();
	const status = await statusClass.getByFilter({ module: "Chamados" });
	const typesCall = await typeCallClass.getAll();
	const users = await userClass.getByFilter({ profile: "60bc30e5f582fe96a40b72a3" });

	if (context.query.id == "new") {
		const data = {
			title: "",
			callNumber: 0,
			description: "",
			dateCreate: Date.now(),
			dateModified: Date.now(),
			userCreate: "",
			userModified: "",
			treatments: [],
			type: "",
			status: "",
			deadline: Date.now(),
			project: "",
			user: "",
		};

		return {
			props: { data, projects, status, typesCall, users },
		};
	} else {
		const data = await callClass.get(context.query.id);
		console.log(data);
		return { props: { data, projects, status, typesCall, users } };
	}
}
