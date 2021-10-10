import "date-fns";
import Head from "next/head";
import React, { useEffect } from "react";
import { CardPanel, Layout, siteTittle, TextFieldMask, Loading } from "../../components";
import { useRouter } from "next/router";
import { Container, Grid, TextField, FormControlLabel, Checkbox, Tooltip, Select, MenuItem, InputLabel, Button, IconButton, Hidden, Backdrop } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MUIRichTextEditor from "mui-rte";
import SaveIcon from "@material-ui/icons/Save";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import { Save, ViewList } from "@material-ui/icons";
import ImprovementClass from '../../classes/ImprovementClass'
import ProjectClass from '../../classes/ProjectClass'
import StatusClass from '../../classes/StatusClass'
import { useSession } from "next-auth/dist/client";
import { useSnackbar } from "notistack";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import UserClass from '../../classes/UserClass';
import { Person } from "@material-ui/icons";

import { RootRef, ListSubheader, Paper, List, ListItemSecondaryAction, Typography, ListItem, FormControl, ListItemText, Stepper, Step, StepLabel, StepContent,ListItemAvatar, Avatar } from "@material-ui/core";

function formaterHour(value) {
	var strValue = value.toString();
	return `${strValue.substring(0, strValue.length - 2)}:${strValue.substring(strValue.length - 2, strValue.length)}`;
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			width: "100%",
			height: "100%",
		},
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
}));
export default function ImprovementById({ Improvement, projects, status, users }) {

	const route = useRouter();
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = React.useState(false);
	const [hidden, setHidden] = React.useState(false);
	const [state, setState] = React.useState(Improvement);
	const [selectedDate, setSelectedDate] = React.useState(new Date("2021-03-18T21:11:54"));
	const [age, setAge] = React.useState("");
	const ImprovementForm = React.useRef(null);
	const [loading, setLoading] = React.useState(false);
	const [session] = useSession();
	const [stateAllUsers, setStateAllUsers] = React.useState(users);

	useEffect(() =>{
		let data = {...state, 
			userModified: {
				_id: session?.user._id,
				name: session?.user.name
			},
			dateCreate: Date.now(),
			dateStart: Date.now(),
			dateModified: Date.now()
		};
		if(!state._id){
			data = {...data, userCreate: {
				_id: session?.user._id,
				name: session?.user.name
			}}
		}
		else{
			data = {...data, project: Improvement.project._id, status: Improvement.status._id, dateEnd: Date.now(), dateModified: Date.now()}
		}
		setState(data);
	},[session])

	const handleSelectChange = (event) => {
		setAge(event.target.value);
	};
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.value });
	};
	const handleChangeDescriptionForm = (event) => {
		setState({ ...state, description: event });
		enqueueSnackbar("Descrição salva com sucesso!", { variant: "success" });
	};

	const handleOnDragEnd = ({ source, destination }) => {
		if (destination === undefined || destination === null) return null;
		if (source.droppableId === destination.droppableId && destination.index === source.index) return null;

		if (source.droppableId === destination.droppableId) {
			if (source.droppableId === "allUsers") {
				const newList = stateAllUsers.filter((_, idx) => idx !== source.index);
				newList.splice(destination.index, 0, stateAllUsers[source.index]);
				setStateAllUsers(newList);
			} else {
				const newList = state.users.filter((_, idx) => idx !== source.index);
				newList.splice(destination.index, 0, state.users[source.index]);
				setState({...state, users: newList});
			}
		} else {
			if (source.droppableId === "allUsers") {
				setStateAllUsers(stateAllUsers.filter((_, idx) => idx !== source.index));
				setState({...state, users: [...state.users, Object.assign({ hours: "", sumPricebyHours: "" }, stateAllUsers[source.index])]})
			} else {
				setState({...state, users: state.users.filter((_, idx) => idx !== source.index)})
				setStateAllUsers([...stateAllUsers, state.users[source.index]]);
			}
		}

		return null;
	};

	const handleSubmit = async (event) => {
		event.preventDefault(event);

		if(!ImprovementForm.current.checkValidity()){
			enqueueSnackbar("Preencha todos os campos obrigatórios nesta etapa", { variant: "error" });
			return;
		}

		if(!state.description){
			enqueueSnackbar("Prencha a Descrição ou Salve ela!", { variant: "error" });
			return;
		}
		setLoading(true);

		try{
			const configFetch = (method) => {
				return({
					method,
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(state)
				})
			}
			console.log(state)
			var res = await fetch(
				`/api/improvement${route.query.id !== "new" ? "/" + route.query.id : ""}`, 
				configFetch(route.query.id === "new" ? "POST" : "PUT")
			);
			if(res.status === 200){
				enqueueSnackbar("Chamada Realizada!", { variant: "success" });
				route.push("/improvement")
			}
			else{
				console.log(await res.json());
				enqueueSnackbar("Erro salvar o chamado, contate um administrador do sistema", { variant: "error" });
			}
		}
		catch(error){
			console.log(error);
			enqueueSnackbar(error, { variant: "error" });
		}
		finally{
			setLoading(false);
		}
	};

	useEffect(() =>{
		if(state.users.length !== 0){
			let AvailableUsers = users;
			let IncludeUsersArray = [];
			state.users.map(_id => {
				stateAllUsers.map((User, index) => {
					if(User._id === _id){
						IncludeUsersArray.push(User);
						AvailableUsers.splice(index, 1);
					}
				})
			})
			setState({...state, users: IncludeUsersArray})
			setStateAllUsers(AvailableUsers);
			console.log(IncludeUsersArray, "Includes");
			console.log(state, "Includes");
		}
	},[])

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<Container maxWidth="xl">
				<CardPanel title={route.query.id == "new" ? "Nova Melhoria" : "Melhoria"} subtitle={route.query.id == "new" ? "Cadastro de novas melhorias" : "Edição de melhoria"} color="primary">
					<div className={classes.root}>
						<form ref={ImprovementForm} className={classes.formRoot}>
							<Grid container spacing={3} alignContent="flex-end">
								<Grid item xs={12}>
									<h3 style={{ marginBottom: "-30px" }}>Informações Principais</h3>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField 
										id="tittleCall" 
										margin="normal" 
										required 
										fullWidth 
										label="Título Chamado" 
										name="title"
										value={state.title}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} md={3} container alignContent="flex-end">
									{/* Pegar da tabela de status */}
									<FormControl fullWidth margin="normal">
										<InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
										<Select 
											labelId="demo-simple-select-label" 
											id="demo-simple-select" 
											required 
											name="status"
											value={state.status}
											onChange={handleChange}
										>
											{
												status.map((stats) => (
													<MenuItem value={stats._id}>{stats.name}</MenuItem>
												))
											}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={3} container alignContent="flex-end">
									<TextField 
										margin="normal"
										fullWidth 
										label="Número"
										disabled 
										value="1111"
										name="improvementNumber"
										value={state.improvementNumber}
										onChange={handleChange}
									/>
								</Grid>
							</Grid>

							<Grid container spacing={3} alignContent="flex-end">
								<Grid item xs={12} md={3}>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<KeyboardDatePicker 
											fullWidth 
											id="date-picker-inline"
											required 
											disabled 
											disableToolbar 
											variant="inline" 
											format="dd/MM/yyyy" 
											margin="normal" 
											label="Criado em" 
											KeyboardButtonProps={{ "aria-label": "change date" }} 
											name="dateCreate"
											value={state.dateCreate} 
											onChange={handleChange} 
										/>
									</MuiPickersUtilsProvider>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField 
										margin="normal"
										fullWidth
										label="Criado por"
										required 
										value={state.userCreate.name}
										disabled
										name="userCreate"
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<KeyboardDatePicker 
											fullWidth 
											id="date-picker-inline"
											required 
											disabled 
											disableToolbar 
											variant="inline" 
											format="dd/MM/yyyy" 
											margin="normal" 
											label="Modificado em" 
											KeyboardButtonProps={{ "aria-label": "change date" }} 
											name="dateModified" 
											value={state.dateModified} 
											onChange={handleChange} 
										/>
									</MuiPickersUtilsProvider>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField 
										margin="normal"
										fullWidth 
										label="Modificado por"
										required 
										disabled 
										name="userModified" 
										value={state.userModified.name} 
										onChange={handleChange}  
									/>
								</Grid>
							</Grid>

							<Grid container spacing={3} alignContent="flex-end">
								<Grid item xs={12} md={3} container alignContent="flex-end">
									<FormControl fullWidth margin="normal">
										<InputLabel id="demo-simple-select-helper-label">Projeto</InputLabel>
										<Select 
											labelId="demo-simple-select-label"
											required 
											id="demo-simple-select"
											name="project"
											value={state.project} 
											onChange={handleChange}  
										>
											{
												projects.map((project) => (
													<MenuItem value={project._id}>{project.name}</MenuItem>
												))
											}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={3} container alignContent="flex-end">
									<TextFieldMask 
										required 
										id="hoursInteraction"
										name="hoursInteraction"
										margin="normal"
										fullWidth 
										label="Horas Estimadas"
										format={formaterHour}
										name="hoursDevelopment"
										value={state.hoursDevelopment} 
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} style={{ minHeight: "200px" }}>
									<Grid item xs={12}>
										<h3 style={{ marginBottom: "-10px" }}>Pessoas</h3>
									</Grid>
									
									<Grid xs={12} md={12} className={classes.padding}>
										<Grid container spacing={3} direction="row" justifyContent="space-between" xs={12}>
											<DragDropContext onDragEnd={handleOnDragEnd}>
												<Grid xs={12} md={6} item className={classes.gridPaper}>
													<Droppable droppableId="allUsers">
														{(provided) => (
															<RootRef rootRef={provided.innerRef}>
																<Paper className={classes.paper} elevation={1}>
																	<List subheader={<ListSubheader>Usuários</ListSubheader>} className={classes.list}>
																		{
																		stateAllUsers.map((u, index) => (
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
												<Grid xs={12} md={6} item className={classes.gridPaper}>
													<Droppable droppableId="includeUsers">
														{(provided) => (
															<RootRef rootRef={provided.innerRef}>
																<Paper className={classes.paper} elevation={1}>
																	<List subheader={<ListSubheader>Inclusos no Projeto</ListSubheader>} className={classes.list}>
																		{state.users.map((u, index) => (
																			<Draggable key={u?._id} draggableId={u?._id} index={index}>
																				{(provided) => (
																					<ListItem alignItems="flex-start" className={classes.listItem} key={u?._id} role={undefined} dense button ContainerComponent="li" ContainerProps={{ ref: provided.innerRef }} {...provided.draggableProps} {...provided.dragHandleProps}>
																						<ListItemAvatar>
																							{u?.logo?.image ? (
																								<Avatar src={u?.logo?.image} />
																							) : (
																								<Avatar>
																									<Person />
																								</Avatar>
																							)}
																						</ListItemAvatar>
																						<Grid container direction="row" justify="space-between" alignItems="flex-start">
																							<Grid item>
																								<ListItemText primary={u?.name} secondary={u?.position?.name} />
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

								</Grid>
								<Grid item xs={12} style={{ minHeight: "200px" }}>
									<Grid item xs={12}>
										<h3 style={{ marginBottom: "-10px" }}>Solicitação</h3>
									</Grid>
									<MUIRichTextEditor 
										name="description"
										onSave={handleChangeDescriptionForm} 
										required
										value={state.description}
										label="Descreva sua solicitação aqui..."
									/>
								</Grid>
							</Grid>
							<Hidden smDown>
								<Grid container xs="12" justify="flex-end" style={{ marginTop: "10px" }} className={classes.marginBtn}>
									<Button color="secondary" margin="normal" startIcon={<ViewList />} onClick={(e) => route.push("/call")}>
										Voltar para Lista
									</Button>
									<Button color="primary" variant="outlined" type="submit" onClick={handleSubmit} startIcon={<Save />}>
										Salvar
									</Button>
								</Grid>
							</Hidden>
							<Hidden mdUp>
								<Backdrop open={open} />
								<SpeedDial ariaLabel="SpeedDial" className={classes.fab} hidden={hidden} icon={<MenuIcon />} onClose={handleClose} onOpen={handleOpen} open={open}>
									<SpeedDialAction key="Lista" icon={<ViewList className={classes.info} />} tooltipTitle="Lista" tooltipOpen onClick={(e) => route.push("/improvement")} />
									<SpeedDialAction key="Salvar" icon={<SaveIcon className={classes.info} />} tooltipTitle="Salvar" tooltipOpen />
								</SpeedDial>
							</Hidden>
						</form>
					</div>
				</CardPanel>
			</Container>
		</Layout>
	);
}

export async function getServerSideProps(context){
	try{
		const improvementClass = new ImprovementClass();
		const projectClass = new ProjectClass();
		const statusClass = new StatusClass();
		const userClass = new UserClass();

		const projects = await projectClass.getAll();
		const status = await statusClass.getByFilter({ module: "Melhorias" });
		const users = await userClass.getAll();

		if(context.query.id !== "new"){
			const data = await improvementClass.get(context.query.id);
			return {props: { Improvement: data, projects, status, users }}
		}
		else{
			return { props: { Improvement: {
				_id: null,
				title: "",
				improvementNumber: 0,
				description: "",
				hoursDevelopment: "",
				dateStart: Date.now(),
				dateEnd: null,
				dateCreate: Date.now(),
				dateModified: Date.now(),
				users: [],
				userCreate: {},
				userModified: "",
				project: "",
				status: ""
			}, projects, status, users }} 
		}
	}
	catch(error){
		return { notFound: true };
	}
}