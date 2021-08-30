import React, { useEffect, useState } from "react";
import { FormControlLabel, Switch, Collapse, Select, Slide, TextField, MenuItem, Grid, InputLabel, Dialog, DialogTitle, DialogContent, Button, FormControl, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { useSnackbar } from "notistack";

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

	const [collpaseImprovement, setCollpaseImprovement] = useState(false);
	const [collpaseProject, setCollpaseProject] = useState(false);
	const [collpaseCall, setCollpaseCall] = useState(false);
	const [appointmentState, setAppointmentState] = useState(appointment);

	useEffect(async () => {
		return async () => {
			try {
				const resProject = await fetch("/api/project/filter", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ "includeUsers.user": session.user._id }),
				});
				const resImprovement = await fetch("/api/call/filter", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ "users.user": session.user._id }),
				});
				const resCall = await fetch("/api/call/filter", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ "user.user": session.user._id }),
				});

				if (!(resProject.status === 200 && resImprovement.status === 200 && resCall.status === 200)) throw "Erro ao carregar combos de origem, por favor, contate o administrador do sistema.";

				setProjects(await resProject.json());
				setImprovements(await resImprovement.json());
				setCalls(await resCall.json());
				setAppointmentState(...appointmentState, { user: session.user._id });
			} catch (e) {
				enqueueSnackbar(e.message, { variant: "error" });
			}
		};
	});

	const handleChangeAppointment = (e) => {
		setAppointmentState({ ...appointmentState, [e.target.name]: e.target.value });

		if (e.target.name === "type") {
			switch (e.target.value) {
				case "project":
					setCollpaseProject(true);
					setCollpaseCall(false);
					setCollpaseImprovement(false);
					break;
				case "improvement":
					setCollpaseProject(false);
					setCollpaseCall(false);
					setCollpaseImprovement(true);
					break;
				case "call":
					setCollpaseProject(false);
					setCollpaseCall(true);
					setCollpaseImprovement(false);
					break;

				default:
					break;
			}
		}
	};
	const handleCancel = (e) => {
		setAppointmentState(appointment);
		closeFunction();
	};

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
										InputLabelProps={{
											shrink: true,
										}}
									></TextField>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										id="timeStart"
										name="timeStart"
										type="datetime-local"
										fullWidth
										label="Fim"
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
								<Select name="type" id="type" onChange={handleChangeAppointment}>
									<MenuItem value="project">Projeto</MenuItem>
									<MenuItem value="improvement">Melhoria</MenuItem>
									<MenuItem value="call">Chamado</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<Collapse in={collpaseImprovement}>
								<FormControl fullWidth margin="normal">
									<InputLabel id="demo-simple-select-helper-label">Melhorias</InputLabel>
									<Select id="improvement" name="improvement" fullWidth onChange={handleChangeAppointment}>
										{improvements.map((object) => (
											<MenuItem value={object._id}>{object.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Collapse>
						</Grid>

						<Grid item xs={12}>
							<Collapse in={collpaseCall}>
								<FormControl fullWidth margin="normal">
									<InputLabel id="demo-simple-select-helper-label">Chamados</InputLabel>
									<Select id="call" name="call" fullWidth onChange={handleChangeAppointment}>
										{calls.map((object) => (
											<MenuItem value={object._id}>{object.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Collapse>
						</Grid>

						<Grid item xs={12}>
							<Collapse in={collpaseProject}>
								<FormControl fullWidth margin="normal">
									<InputLabel id="demo-simple-select-helper-label">Projetos</InputLabel>
									<Select id="project" name="project" fullWidth onChange={handleChangeAppointment}>
										{projects.map((object) => (
											<MenuItem value={object._id}>{object.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Collapse>
						</Grid>

						<Grid item xs={12}>
							<TextField required id="description" name="description" onChange={handleChangeAppointment} multiline rows={3} fullWidth label="Descrição"></TextField>
						</Grid>
						<Grid item xs={12}>
							<Grid container xs={12} justify="flex-end" spacing={1} style={{ margin: "10px" }}>
								<Grid item>
									<Button type="submit" variant="outlined" color="primary" startIcon={<Save />}>
										Salvar
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
