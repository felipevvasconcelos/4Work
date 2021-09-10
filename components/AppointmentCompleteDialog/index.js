import React, { useEffect, useState } from "react";
import { FormControlLabel, Switch, Collapse, Select, Slide, TextField, MenuItem, Grid, InputLabel, Dialog, DialogTitle, DialogContent, Button, FormControl, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { ObjectId } from "mongoose";

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

export default function AppointmentCompleteDialog({ open, session, closeFunction }) {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

	const [projects, setProjects] = useState([]);
	const [improvements, setImprovements] = useState([]);
	const [calls, setCalls] = useState([]);

	const [collpase, setCollpase] = useState(false);
	const [appointmentState, setAppointmentState] = useState(appointment);

	const [selectsData, setSelectsData] = useState([]);

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
	},[appointmentState.type])

	const handleChangeAppointment = (e) => {
		setAppointmentState({ ...appointmentState, [e.target.name]: e.target.value });

		if (e.target.name === "type") {
			setCollpase(true);
		}
	};
	const handleCancel = (e) => {
		setAppointmentState(appointment);
		closeFunction();
	};

	useEffect(() =>{
		console.log(selectsData);
	},[selectsData])

	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			//VALIDAÇÕES
			switch (appointmentState.type) {
				case "project":
					if (!appointmentState.project) throw "Campo projeto é obrigatório";
					break;
				case "improvement":
					if (!appointmentState.project) throw "Campo melhoria é obrigatório";
					break;
				case "call":
					if (!appointmentState.project) throw "Campo chamado é obrigatório";
					break;

				default:
					throw "Campo tipo é obrigatório";
					break;
			}

			const res = await fetch("/api/timesheet", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(appointmentState),
			});
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
		}
	}

	const handleClearFields = () => {
		console.log(appointmentState);
		setAppointmentState({
			call: "",
			description: "",
			improvement: "",
			project: "",
			timeStart: "",
			type: "",
			user: ""
		});
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
				<form onSubmit={handleSubmit}>
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
										value={appointmentState.timeStart}
										onChange={handleChangeAppointment}
										InputLabelProps={{
											shrink: true,
										}}
									></TextField>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										id="timeEnd"
										name="timeEnd"
										type="datetime-local"
										fullWidth
										label="Fim"
										value={appointmentState.timeEnd}
										onChange={handleChangeAppointment}
										InputLabelProps={{
											shrink: true,
										}}
									></TextField>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth margin="normal">
								<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
								<Select name="type" id="type" value={appointmentState.type} onChange={handleChangeAppointment}>
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
									<Select id={appointment.type} name={appointment.type} value={appointmentState[appointment.type]} fullWidth onChange={handleChangeAppointment}>
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
							<TextField required id="description" name="description" value={appointmentState.description} onChange={handleChangeAppointment} multiline rows={3} fullWidth label="Descrição"></TextField>
						</Grid>
						<Grid item xs={12}>
							<Grid container xs={12} justify="flex-end" spacing={1} style={{ margin: "10px" }}>
								<Grid item>
									<Button type="submit" variant="outlined" color="primary" onClick={handleClearFields} startIcon={<Save />}>
										Limpar
									</Button>
								</Grid>
								<Grid item>
									<Button type="submit" variant="contained" color="primary" startIcon={<Save />}>
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
