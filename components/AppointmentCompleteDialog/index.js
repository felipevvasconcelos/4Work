import React, { useEffect, useRef, useState, useContext } from "react";
import { FormControlLabel, Switch, Collapse, Select, Slide, TextField, MenuItem, Grid, InputLabel, Dialog, DialogTitle, DialogContent, Button, FormControl, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { Close, Edit, Save } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { ObjectId } from "mongoose";
import { TimesheetContext } from '../../Context/TImesheetContext';
import { AtuhenticationContext } from '../../Context/AuthenticationContextAPI';
import dayjs from "dayjs";

const useStyles = makeStyles({
	btn: {
		marginTop: "10px",
		marginBottom: "10px",
	},
});

const appointment = {
	timeStart: "",
	description: "",
	type: "",
	project: "",
	improvement: "",
	call: "",
	user: "",
};

export default function AppointmentCompleteDialog({ open, session, closeFunction, onEdit, saveStateAppointment }) {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

	const [collpase, setCollpase] = useState(false);
	const [appointmentState, setAppointmentState] = useState({...appointment, user: session.user._id});
	const [appointmentType, setAppointmentType] = useState("");

	const [selectsData, setSelectsData] = useState([]);
	const appointmentForm = useRef(null);
	const { validateTimesheet } = useContext(TimesheetContext)
	const { userData } = useContext(AtuhenticationContext)

	const QuerrySelects = {
		project: async () => {
			return await fetch("/api/project/filter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({filter: {"includeUsers.user": session.user._id}}),
			})
		},
		improvement: async () => {
			return await fetch("/api/improvement/filter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({filter: {"users": session.user._id }}),
			})
		},
		call: async () => {
			return await fetch("/api/call/filter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filter: {"user": session.user._id}}),
			})
		}
	}

	useEffect(() =>{
		if(onEdit){
			setAppointmentState({appointmentState, ...onEdit})
			setCollpase(true);
		}
		console.log(onEdit, "teste");
	},[onEdit])

	useEffect(() =>{
		setAppointmentType(appointmentState[appointmentState.type]);
	},[selectsData])

	async function handleSelectonChange(type){
		if(QuerrySelects[type]){
			try{
				const data = await QuerrySelects[type]();

				console.log(data);
				if (!data.status === 200) throw "Erro ao carregar combos de origem, por favor, contate o administrador do sistema.";

				setSelectsData(await data.json());
			}
			catch(e){
				enqueueSnackbar(e.message, { variant: "error" });
			}
		}
	}

	useEffect(() =>{
		handleSelectonChange(appointmentState.type)
		switch (appointmentState.type) {
			case "project":
				setAppointmentState({...appointmentState, call: null, improvement: null});
				break;
			case "improvement":
				setAppointmentState({...appointmentState, call: null, project: null});
				break;
			case "call":
				setAppointmentState({...appointmentState, improvement: null, project: null});
				break;

			default:
				setAppointmentState({...appointmentState, improvement: null, project: null, call: null});
				break;
		}
	},[appointmentState.type])

	const handleChangeAppointment = (e) => {
		console.log([e.target.name], e.target.value);
		setAppointmentState({ ...appointmentState, [e.target.name]: e.target.value });

		if (e.target.name === "type") {
			setCollpase(true);
		}
	};
	const handleCancel = (e) => {
		setAppointmentState(appointment);
		closeFunction();
	};

	async function handleSubmit(e, method) {
		console.log("Submit");
		e.preventDefault(e);
		setAppointmentState({...appointmentState, user: userData._id});
		try {
			if(!appointmentForm.current.checkValidity()){
				enqueueSnackbar("Preencha todos os campos!", { variant: "error" });
				return;
			}
			//VALIDAÇÕES
			switch (appointmentState.type) {
				case "project":
					if (!appointmentState.project) throw "Campo projeto é obrigatório";
					break;
				case "improvement":
					if (!appointmentState.improvement) throw "Campo melhoria é obrigatório";
					break;
				case "call":
					if (!appointmentState.call) throw "Campo chamado é obrigatório";
					break;

				default:
					throw "Campo tipo é obrigatório";
					break;
			}
			const validate = await validateTimesheet(appointmentState);
			if(!validate.success){
				throw validate.message;
			}
			console.log(onEdit);
			if(onEdit){
				var res = await fetch(`/api/timesheet/${appointmentState.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(appointmentState),
				});
			}
			else{
				console.log("INSERIR");
				var res = await fetch("/api/timesheet", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(appointmentState),
				});
			}

			if(res.status == 200){
				enqueueSnackbar("Horas cadastradas!", { variant: "success" });
			}

			saveStateAppointment();

			onEdit && handleCancel();
			method === "SaveAndClose" && handleCancel();
			handleClearFields();
		} catch (e) {
			enqueueSnackbar(e, { variant: "error" });
		}
	}

	const handleClearFields = () => {
		setAppointmentState(appointment);
		setCollpase(false);
	}

	return (
		<Dialog
			fullWidth
			open={open}
			aria-labelledby="alert-dialog-title"
			onClose={(event, reason) => {
				if (reason === "backdropClick") {
					closeFunction();
				}
			}}
		>
			<DialogTitle>Lançamento de Horas</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit} ref={appointmentForm} >
					<Grid container spacing={0} direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
						<Grid item xs={12}>
							<Grid container direction="row" spacing={1} justify="flex-end" alignItems="flex-end" xs={12}>
								<Grid item xs={12} sm={6}>

									<TextField
										id="timeStart"
										name="timeStart"
										type="datetime-local"
										fullWidth
										label="Início"
										value={appointmentState.timeStart ? dayjs(appointmentState.timeStart).format('YYYY-MM-DDTHH:hh:mm') : null}
										onChange={handleChangeAppointment}
										InputLabelProps={{
											shrink: true,
										}}
										required
									></TextField>

								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										id="timeEnd"
										name="timeEnd"
										type="datetime-local"
										fullWidth
										label="Fim"
										value={appointmentState.timeEnd ? dayjs(appointmentState.timeEnd).format('YYYY-MM-DDTHH:hh:mm') : null}
										onChange={handleChangeAppointment}
										InputLabelProps={{
											shrink: true,
										}}
										required
									></TextField>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth margin="normal">
								<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
								<Select 
									name="type" 
									id="type" 
									value={appointmentState.type} 
									onChange={handleChangeAppointment}
									required
								>
									<MenuItem value="project">Projeto</MenuItem>
									<MenuItem value="improvement">Melhoria</MenuItem>
									<MenuItem value="call">Chamado</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<Collapse in={collpase}>
								<FormControl fullWidth margin="normal">
									<InputLabel id="demo-simple-select-helper-label">
										{
											appointmentState.type === 'project' && "Projeto"
										}
										{
											appointmentState.type === 'improvement' && "Melhorias"
										}
										{
											appointmentState.type === 'call' && "Chamados"
										}
									</InputLabel>
									<Select 
										id={appointmentState.type} 
										name={appointmentState.type} 
										value={ appointmentState[appointmentState.type]?._id || appointmentState[appointmentState.type] } 
										fullWidth 
										onChange={handleChangeAppointment}
										required
									>
										{
											selectsData[0] &&
											selectsData.map((object) => (
												<MenuItem value={object._id}>{ object?.name || object?.title }</MenuItem>
											))
										}
									</Select>
								</FormControl>
							</Collapse>
						</Grid>



						<Grid item xs={12}>
							<TextField 
								required 
								id="description" 
								name="description" 
								value={appointmentState.description} 
								onChange={handleChangeAppointment} 
								multiline 
								rows={3} 
								fullWidth 
								label="Descrição"
								required
							></TextField>
						</Grid>
						<Grid item xs={12}>
							<Grid container xs={12} justify="flex-end" spacing={1} style={{ margin: "10px" }}>
								<Grid item>
									<Button 
										type="submit" 
										variant="outlined" 
										color="primary" 
										onClick={(event) => handleSubmit(event, "Save")} 
										startIcon={<Save />}
									>
										Salvar
									</Button>
								</Grid>
								<Grid item>
									<Button 
										type="submit" 
										variant="contained" 
										color="primary" 
										onClick={(event) => handleSubmit(event, "SaveAndClose")} 
										startIcon={<Save />}
									>
										Salvar e Fechar
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>
	);
}
