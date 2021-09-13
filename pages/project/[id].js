import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Person } from "@material-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { RootRef, ListSubheader, Paper, List, ListItemSecondaryAction, Typography, ListItem, FormControl, ListItemText, MenuItem, Button, Grid, Container, makeStyles, Stepper, Step, StepLabel, StepContent, TextField, Select, InputLabel, ListItemAvatar, Avatar } from "@material-ui/core";
import { ProjectClass, CompanyClass, StatusClass, UserClass } from "../../classes";
import { CardPanel, Layout, Loading, siteTittle, TextFieldMask } from "../../components";
import { useSession } from "next-auth/client";
import moment from "moment";
import dayjs from "dayjs";
import { AtuhenticationContext } from "../../Context/AuthenticationContextAPI";
import { PermissionViewContext } from "../../Context/PermissionViewContext";
import { Authentication } from "../../middlewares/AuthenticationRoutes";

const steps = ["Dados Gerais", "Estrutura", "Recursos", "Confirmação"];

const useStyles = makeStyles((theme) => ({
	padding: {
		padding: "0px",
		width: "100%",
	},
	stepper: {
		padding: "20px 0px",
	},
	gridPaper: {
		padding: "0px",
		width: "100%",
		height: "100%",
		maxHeight: "400px",
		minHeight: "100%",
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
	typography: {
		marginTop: theme.spacing(2),
	},
	paper: {
		display: "flex",
		width: "100%",
		height: "100%",
		maxHeight: "400px",
	},
	list: {
		width: "100%",
	},
	listItem: {
		width: "100%",
	},
	inputHours: {
		width: "100px",
		marginTop: "-4px",
		marginBottom: "10px",
		marginRight: "10px",
	},
}));

function currencyFormatterBr(value) {
	if (!Number(value)) return "";

	const amount = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value / 100);

	return `${amount}`;
}

function formaterHour(value) {
	var strValue = value.toString();
	return `${strValue.substring(0, strValue.length - 2)}:${strValue.substring(strValue.length - 2, strValue.length)}`;
}

function timeStringToFloat(time) {
	var hoursMinutes = time.split(/[.:]/);
	var hours = parseInt(hoursMinutes[0], 10);
	var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
	return hours + minutes / 60;
}

export default function ProjectById({ data, companies, statusList, users }) {
	const router = useRouter();
	const classes = useStyles();
	const [session] = useSession();
	const myForm = React.useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = React.useState(0);
	const [stateProject, setStateProject] = useState(data);
	const [stateAllUsers, setStateAllUsers] = useState(users);
	const [stateIncludeUsers, setStateIncludeUsers] = useState([]);

	const { filterPermissionByScreen } = useContext(PermissionViewContext);
	const { permission } = useContext(AtuhenticationContext);

	useEffect(() => {
		const permissionsScren = filterPermissionByScreen("60bc3091f582fe96a40b729a");
		if (!Authentication(permissionsScren, permission?.name)) {
			return router.push("/");
		}
	}, []);

	useEffect(() => {
		if (data.includeUsers.length !== 0) {
			let AvailableUsers = stateAllUsers;
			let IncludeUsersArray = [];
			stateAllUsers.map((User, index) => {
				data.includeUsers.map((UserFilter) => {
					if (User._id === UserFilter.user) {
						User.hours = UserFilter.hours;
						User.sumPricebyHours = User.priceHour * (User.hours / 100);
						console.log(User);
						IncludeUsersArray.push(User);
						AvailableUsers.splice(index, 1);
					}
				});
			});
			setStateAllUsers(AvailableUsers);
			setStateIncludeUsers(IncludeUsersArray);
		}
	}, [users]);

	const handleOnDragEnd = ({ source, destination }) => {
		if (destination === undefined || destination === null) return null;
		if (source.droppableId === destination.droppableId && destination.index === source.index) return null;

		if (source.droppableId === destination.droppableId) {
			if (source.droppableId === "allUsers") {
				const newList = stateAllUsers.filter((_, idx) => idx !== source.index);
				newList.splice(destination.index, 0, stateAllUsers[source.index]);
				setStateAllUsers(newList);
			} else {
				const newList = stateIncludeUsers.filter((_, idx) => idx !== source.index);
				newList.splice(destination.index, 0, stateIncludeUsers[source.index]);
				setStateIncludeUsers(newList);
			}
		} else {
			if (source.droppableId === "allUsers") {
				setStateAllUsers(stateAllUsers.filter((_, idx) => idx !== source.index));
				setStateIncludeUsers([...stateIncludeUsers, Object.assign({ hours: "", sumPricebyHours: "" }, stateAllUsers[source.index])]);
			} else {
				setStateIncludeUsers(stateIncludeUsers.filter((_, idx) => idx !== source.index));
				setStateAllUsers([...stateAllUsers, stateIncludeUsers[source.index]]);
			}
		}

		return null;
	};
	const handleChangeProject = (e) => {
		let project = { ...stateProject, [e.target.name]: e.target.value };

		if (e.target.name.includes("hour") && stateIncludeUsers.length > 0) {
			const totalHours = stateIncludeUsers.reduce(function (prev, current) {
				return parseInt(prev) + parseInt(current.hours);
			}, 0);

			if (totalHours > project.hoursTotal) {
				enqueueSnackbar("Valor não pode ser menor que o total estipulado para os recursos!", { variant: "error" });
				return null;
			}
		}

		setStateProject(project);
	};
	const handleChangeHours = (e, i) => {
		let users = [...stateIncludeUsers];
		let user = { ...stateIncludeUsers[i] };
		user.hours = e.target.value;
		user.sumPricebyHours = user.priceHour * (user.hours / 100);
		users[i] = user;

		const totaHours = users.reduce(function (prev, current) {
			return parseInt(prev) + parseInt(current.hours);
		}, 0);

		console.log(totaHours);
		console.log(stateProject.hoursTotal);

		if (totaHours > stateProject.hoursTotal) {
			enqueueSnackbar("Valor não pode ultrapassar o total do projeto", { variant: "error" });
		} else {
			const totaSumPricebyHours = users.reduce(function (prev, current) {
				return prev + current.sumPricebyHours;
			}, 0);

			setStateIncludeUsers(users);
			setStateProject({ ...stateProject, priceCalculated: totaSumPricebyHours });
		}
	};
	const sumHours = () => {
		var hour1 = stateProject.hoursDevelopment ? parseInt(stateProject.hoursDevelopment) : 0;
		var hour2 = stateProject.hoursHomologation ? parseInt(stateProject.hoursHomologation) : 0;
		var hour3 = stateProject.hoursDeploy ? parseInt(stateProject.hoursDeploy) : 0;
		var hour4 = stateProject.hoursDocumentation ? parseInt(stateProject.hoursDocumentation) : 0;
		var hour5 = stateProject.hoursSurvey ? parseInt(stateProject.hoursSurvey) : 0;
		var hour6 = stateProject.hoursInteraction ? parseInt(stateProject.hoursInteraction) : 0;
		var hour7 = stateProject.hoursManagement ? parseInt(stateProject.hoursManagement) : 0;

		setStateProject({ ...stateProject, hoursTotal: hour1 + hour2 + hour3 + hour4 + hour5 + hour6 + hour7 });
	};
	const handleNext = () => {
		if (!myForm.current.checkValidity()) {
			enqueueSnackbar("Preencha todos os campos obrigatórios nesta etapa", { variant: "error" });
			return;
		} else {
			if (!stateProject._id) {
				console.log(stateProject.dateCreate);
				console.log(stateProject);
				console.log(dayjs() < dayjs());
				if (dayjs(stateProject.dateStart) < dayjs()) {
					enqueueSnackbar("A data de inico deve ser maior que a atual", { variant: "error" });
					return;
				}
				if (dayjs(stateProject.dateEnd) < dayjs(stateProject.dateStart)) {
					enqueueSnackbar("A data final deve ser maior ou igual a de inicio", { variant: "error" });
					return;
				}
			}
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	const handleSubmit = async (e) => {
		e.preventDefault(e);

		setLoading(true);

		var project = { ...stateProject };

		project.userModified = session.user._id;
		project.dateModified = Date.now();
		let arrayIncludes = [];
		stateIncludeUsers.map(function (u) {
			arrayIncludes.push({
				user: u._id,
				hours: u.hours,
			});
		});
		project.includeUsers = arrayIncludes;

		try {
			if (router.query.id === "new") {
				project.dateCreate = Date.now();
				project.userCreate = session.user._id;

				var res = await fetch("/api/project", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(project),
				});
			} else {
				var res = await fetch(`/api/project/${router.query.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(project),
				});
			}

			if (res.status === 200) {
				enqueueSnackbar("Projeto Salvo", { variant: "success" });
				router.push("/project");
			} else {
				var body = await res.json();
				console.log(body);
				enqueueSnackbar("Erro salvar o projeto, contate um administrador do sistema", { variant: "error" });
			}

			setLoading(false);
		} catch (e) {
			enqueueSnackbar(e, { variant: "error" });
			setLoading(false);
		}
	};

	function getStepContent(step) {
		switch (step) {
			case 0:
				return (
					<Grid xs={12} md={12} direction="row" className={classes.padding}>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={8} lg={6} direction="row">
								<TextField required id="name" name="name" margin="normal" onChange={handleChangeProject} value={stateProject.name} fullWidth label="Nome" />
							</Grid>
							<Grid item xs={4} lg={2} direction="row">
								<TextField disabled id="projectNumber" name="projectNumber" margin="normal" onChange={handleChangeProject} value={stateProject.projectNumber} fullWidth label="Nº" />
							</Grid>
						</Grid>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={8} lg={4} direction="row">
								<FormControl required fullWidth className={classes.formControl}>
									<InputLabel>Cliente</InputLabel>
									<Select id="company" name="company" value={stateProject.company} onChange={handleChangeProject} fullWidth>
										{companies.map((c) => (
											<MenuItem value={c._id}>{c.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={4} lg={4} direction="row">
								<FormControl required fullWidth className={classes.formControl}>
									<InputLabel>Status</InputLabel>
									<Select id="status" name="status" value={stateProject.status} onChange={handleChangeProject} fullWidth>
										{statusList.map((c) => (
											<MenuItem value={c._id}>{c.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Grid>
				);
			case 1:
				return (
					<Grid xs={12} md={12} direction="row" className={classes.padding}>
						<Typography variant="h6" className={classes.typography}>
							Período
						</Typography>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={12} md={6} lg={4} direction="row">
								<TextField required type="date" required id="dateStart" name="dateStart" margin="normal" onChange={handleChangeProject} value={moment(new Date(stateProject.dateStart)).format("YYYY-MM-DD")} fullWidth label="Data Início" InputLabelProps={{ shrink: true }} />
							</Grid>
							<Grid item xs={12} md={6} lg={4} direction="row">
								<TextField required type="date" required id="dateEnd" name="dateEnd" margin="normal" onChange={handleChangeProject} value={stateProject.dateEnd} fullWidth label="Data Fim" InputLabelProps={{ shrink: true }} />
							</Grid>
						</Grid>
						<Typography variant="h6" className={classes.typography}>
							Horas
						</Typography>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursInteraction" name="hoursInteraction" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursInteraction} fullWidth label="Interação" format={formaterHour} />
							</Grid>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursSurvey" name="hoursSurvey" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursSurvey} fullWidth label="Levantamento" format={formaterHour} />
							</Grid>
						</Grid>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursDocumentation" name="hoursDocumentation" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursDocumentation} fullWidth label="Documentação" format={formaterHour} />
							</Grid>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursManagement" name="hoursManagement" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursManagement} fullWidth label="Gerenciamento" format={formaterHour} />
							</Grid>
						</Grid>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursDevelopment" name="hoursDevelopment" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursDevelopment} fullWidth label="Desenvolvimento" format={formaterHour} />
							</Grid>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursDeploy" name="hoursDeploy" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursDeploy} fullWidth label="Implantação" format={formaterHour} />
							</Grid>
						</Grid>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask required id="hoursHomologation" name="hoursHomologation" margin="normal" onChange={handleChangeProject} onBlur={sumHours} value={stateProject.hoursHomologation} fullWidth label="Homologação" format={formaterHour} />
							</Grid>
							<Grid item xs={6} lg={4} direction="row">
								<TextFieldMask disabled id="hoursTotal" name="hoursTotal" margin="normal" value={stateProject.hoursTotal} fullWidth label="Total" format={formaterHour} />
							</Grid>
						</Grid>
					</Grid>
				);
			case 2:
				return (
					<Grid xs={12} md={12} className={classes.padding}>
						<Grid container spacing={3} direction="row" justifyContent="space-between" xs={12}>
							<DragDropContext onDragEnd={handleOnDragEnd}>
								<Grid xs={12} md={6} item className={classes.gridPaper}>
									<Droppable droppableId="allUsers">
										{(provided) => (
											<RootRef rootRef={provided.innerRef}>
												<Paper className={classes.paper} elevation={1}>
													<List subheader={<ListSubheader>Usuários</ListSubheader>} className={classes.list}>
														{stateAllUsers.map((u, index) => (
															<Draggable key={u._id} draggableId={u._id} index={index}>
																{(provided) => (
																	<ListItem className={classes.listItem} key={u._id} role={undefined} dense button ContainerComponent="li" ContainerProps={{ ref: provided.innerRef }} {...provided.draggableProps} {...provided.dragHandleProps}>
																		<ListItemAvatar>
																			{u.logo.image ? (
																				<Avatar src={u.logo.image} />
																			) : (
																				<Avatar>
																					<Person />
																				</Avatar>
																			)}
																		</ListItemAvatar>
																		<ListItemText primary={u.name} secondary={u.position.name} />
																		<ListItemSecondaryAction>{`${u.priceHour ? currencyFormatterBr(u.priceHour) : "R$ 0,00"}`}</ListItemSecondaryAction>
																	</ListItem>
																)}
															</Draggable>
														))}
														{provided.placeholder}
													</List>
												</Paper>
											</RootRef>
										)}
									</Droppable>
								</Grid>
								<Grid xs={12} md={6} item className={classes.gridPaper}>
									<Droppable droppableId="includeUsers">
										{(provided) => (
											<RootRef rootRef={provided.innerRef}>
												<Paper className={classes.paper} elevation={1}>
													<List subheader={<ListSubheader>Inclusos no Projeto</ListSubheader>} className={classes.list}>
														{stateIncludeUsers.map((u, index) => (
															<Draggable key={u._id} draggableId={u._id} index={index}>
																{(provided) => (
																	<ListItem alignItems="flex-start" className={classes.listItem} key={u._id} role={undefined} dense button ContainerComponent="li" ContainerProps={{ ref: provided.innerRef }} {...provided.draggableProps} {...provided.dragHandleProps}>
																		<ListItemAvatar>
																			{u.logo.image ? (
																				<Avatar src={u.logo.image} />
																			) : (
																				<Avatar>
																					<Person />
																				</Avatar>
																			)}
																		</ListItemAvatar>
																		<Grid container direction="row" justify="space-between" alignItems="flex-start">
																			<Grid item>
																				<ListItemText primary={u.name} secondary={`${u.position.name} - ${u.priceHour ? currencyFormatterBr(u.priceHour) : "R$ 0,00"}`} />
																			</Grid>
																			<Grid item>
																				<TextFieldMask required id={u._id} name={u._id} margin="normal" isNumericString={true} onChange={(e) => handleChangeHours(e, index)} value={u.hours} fullWidth label="Qtd Horas" format={formaterHour} className={classes.inputHours} />
																				<TextField disabled id={u._id} name={u._id} margin="normal" fullWidth label="Total" value={currencyFormatterBr(u.sumPricebyHours)} className={classes.inputHours} />
																			</Grid>
																		</Grid>
																		<ListItemSecondaryAction></ListItemSecondaryAction>
																	</ListItem>
																)}
															</Draggable>
														))}
														{provided.placeholder}
													</List>
												</Paper>
											</RootRef>
										)}
									</Droppable>
								</Grid>
							</DragDropContext>
						</Grid>
					</Grid>
				);
			case 3:
				return (
					<Grid xs={12} md={12} direction="row" className={classes.padding}>
						<Grid container spacing={1} direction="row" alignItems="flex-end" xs={12}>
							<Grid item xs={6} md={4} lg={3} direction="row">
								<TextFieldMask id="priceCalculated" name="priceCalculated" margin="normal" isNumericString={true} onChange={handleChangeProject} value={stateProject.priceCalculated} fullWidth label="Preço Calculado" format={currencyFormatterBr} disabled />
							</Grid>
							<Grid item xs={6} md={4} lg={3} direction="row">
								<TextFieldMask id="priceCharged" name="priceCharged" margin="normal" isNumericString={true} onChange={handleChangeProject} value={stateProject.priceCharged} fullWidth label="Preço Cobrado" format={currencyFormatterBr} />
							</Grid>
						</Grid>
					</Grid>
				);
			default:
				break;
		}
	}

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<CardPanel title={router.query.id != "new" ? "Edição de Projeto" : "Cadastro de Projeto"} subtitle="" color="primary">
				<Container maxWidth="xl">
					<form ref={myForm}>
						<Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
							{steps.map((label, index) => {
								const stepProps = {};
								const labelProps = {};
								return (
									<Step key={label} {...stepProps}>
										<StepLabel {...labelProps}>{label}</StepLabel>
										<StepContent>
											<Container maxWidth="xl">
												{getStepContent(index)}
												<div className={classes.actionsContainer}>
													<div>
														<Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
															Voltar
														</Button>
														{activeStep === steps.length - 1 ? (
															<Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
																Salvar
															</Button>
														) : (
															<Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
																Próximo
															</Button>
														)}
													</div>
												</div>
											</Container>
										</StepContent>
									</Step>
								);
							})}
						</Stepper>
					</form>
				</Container>
			</CardPanel>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const companies = await new CompanyClass().getAll();
	const statusList = await new StatusClass().getByFilter({ module: "Project" });
	const users = await new UserClass().getByFilter({ profile: { $in: process.env.PROFILES_TO_PROJECT.split(",") } });

	if (context.query.id == "new") {
		return {
			props: {
				data: {
					name: "",
					status: "",
					company: "",
					includeUsers: [],
					hoursDevelopment: "",
					hoursHomologation: "",
					hoursDeploy: "",
					hoursDocumentation: "",
					hoursSurvey: "",
					hoursInteraction: "",
					hoursManagement: "",
					priceCalculated: "",
					priceCharged: "",
					dateStart: "",
					dateEnd: "",
					dateCreate: "",
					dateModified: "",
					userCreate: "",
					userModified: "",
				},
				companies,
				statusList,
				users,
			},
		};
	} else {
		const data = await new ProjectClass().get(context.query.id);
		return { props: { data, companies, statusList, users } };
	}
}
