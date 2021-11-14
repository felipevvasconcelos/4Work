import React, { useEffect, useRef, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { FormControlLabel, Switch, Collapse, Select, Slide, TextField, MenuItem, Grid, InputLabel, Dialog, DialogTitle, DialogContent, Button, FormControl, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { TimesheetContext } from "../../Context/TImesheetContext";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

const useStyles = makeStyles({
	dialog: {
		position: "absolute",
		right: 55,
		top: 25,
	},
	btn: {
		marginTop: "10px",
		marginBottom: "10px",
	},
});

const appointment = {
	timeStart: "",
	description: "",
	type: "",
	project: null,
	improvement: null,
	call: null,
	user: "",
};

export default function AppointmentDialog({ open, session, closeFunction }) {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

	const [checkboxImediate, setCheckboxImediate] = useState(false);

	const { openTimesheet, timesheet } = useContext(TimesheetContext);

	const [appointmentState, setAppointmentState] = useState(appointment);
	const [collpase, setCollpase] = useState(false);
	const [selectsDataTypes, setSelectsDataTypes] = useState({});

	const timesheetForm = useRef(null);

	const QueryType = {
		project: async () => {
			return await fetch("/api/project/filter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filter: { "includeUsers.user": session.user._id } }),
			});
		},
		improvement: async () => {
			return await fetch("/api/improvement/filter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filter: { users: session.user._id } }),
			});
		},
		call: async () => {
			return await fetch("/api/call/filter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filter: { user: session.user._id } }),
			});
		},
	};

	const handleChangeType = async () => {
		try {
			const data = await QueryType[appointmentState.type]();

			if (!data.status === 200) throw "Erro ao carregar combos de origem, por favor, contate o administrador do sistema.";

			console.log(data);

			setSelectsDataTypes({ ...selectsDataTypes, [appointmentState.type]: await data.json() });
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
		}
	};

	useEffect(() => {
		if (QueryType[appointmentState.type]) {
			if (!selectsDataTypes[appointmentState.type]) {
				handleChangeType();
			}
		}
	}, [appointmentState.type]);

	useEffect(() =>{
		setAppointmentState({...timesheet, timeStart: null});
	},[openTimesheet])

	useEffect(() => {
		switch (appointmentState.type) {
			case "project":
				setAppointmentState({ ...appointmentState, call: null, improvement: null });
				break;
			case "improvement":
				setAppointmentState({ ...appointmentState, call: null, project: null });
				break;
			case "call":
				setAppointmentState({ ...appointmentState, improvement: null, project: null });
				break;

			default:
				setAppointmentState({ ...appointmentState, improvement: null, project: null, call: null });
				break;
		}
	}, [appointmentState.type]);

	useEffect(() => {
		setAppointmentState({ ...appointmentState, user: session?.user._id, timeStart: Date.now() });
	}, [session]);

	const handleChangeAppointment = (e) => {

		if(e.target.name === 'timeStart'){
			if(appointmentState?.timeStart){
				let hours = appointmentState.timeStart.split(':');
				const dateAppointment = dayjs().hour(hours[0]).minute(hours[1]).unix();
				
				setAppointmentState({...appointmentState,  timeStart: dateAppointment });
			}
			else{
				setAppointmentState({...appointmentState, timeStart: dayjs().unix() });
			}
		}

		setAppointmentState({ ...appointmentState, [e.target.name]: e.target.value });

		if (e.target.name === "type") {
			setCollpase(true);
		}
	};

	const handleChangeImediate = (e) => {
		setCheckboxImediate(!checkboxImediate);
	};
	const handleCancel = (e) => {
		setAppointmentState(appointment);
		closeFunction();
	};
	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			if (!timesheetForm.current.checkValidity()) {
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

			let res;
			
			if (openTimesheet) {
				let dateAppointment;
				if(appointmentState.timeStart){
					let hours = appointmentState.timeStart.split(':');
					dateAppointment = dayjs().hour(hours[0]).minute(hours[1]).unix();
				}

				const dataupdate = ({...appointmentState, timeEnd: appointmentState.timeStart ? dateAppointment : dayjs(), timeStart: timesheet.timeStart})
				res = await fetch(`api/timesheet/${appointmentState._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(dataupdate)
				})
			}
			else{
				res = await fetch("/api/timesheet", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(appointmentState),
				});
			}

			console.log(await res.json());

			if (res.status == 200) {
				enqueueSnackbar("Horas cadastradas!", { variant: "success" });
			}
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
		}
	}

	return (
		<Dialog
			classes={{
				paper: classes.dialog,
			}}
			fullWidth
			open={open}
			aria-labelledby="alert-dialog-title"
			TransitionComponent={Transition}
			onClose={(event, reason) => {
				if (reason === "backdropClick") {
					closeFunction();
				}
			}}
		>
			<DialogTitle>Lançamento de Horas</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit} ref={timesheetForm}>
					<Grid container spacing={0} direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
						<Grid item xs={12}>
							<Grid container direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
								<Grid item xs={8}>
									<Collapse in={checkboxImediate}>
										<TextField
											id="timeStart"
											name="timeStart"
											// value={appointmentState.timeStart}
											onChange={handleChangeAppointment}
											type="time"
											fullWidth
											label="Início"
											InputLabelProps={{
												shrink: true,
											}}
										></TextField>
									</Collapse>
								</Grid>
								<Grid item xs={4}>
									<Grid container direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
										<FormControlLabel label={checkboxImediate ? "Atrasado" : "Imediato"} control={<Switch size="small" color="primary" checked={checkboxImediate} value={checkboxImediate} onChange={handleChangeImediate} />} />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth margin="normal">
								<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
								<Select name="type" id="type" onChange={handleChangeAppointment} value={appointmentState.type}>
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
										{appointmentState.type === "project" && "Projeto"}
										{appointmentState.type === "improvement" && "Melhorias"}
										{appointmentState.type === "call" && "Chamados"}
									</InputLabel>
									<Select id={appointmentState.type} name={appointmentState.type} fullWidth onChange={handleChangeAppointment} value={appointmentState[appointmentState.type]}>
										{selectsDataTypes[appointmentState.type] && selectsDataTypes[appointmentState.type].map((object) => <MenuItem value={object._id}>{object?.name || object?.title}</MenuItem>)}
									</Select>
								</FormControl>
							</Collapse>
						</Grid>

						<Grid item xs={12}>
							<TextField required id="description" name="description" value={appointmentState.description} onChange={handleChangeAppointment} multiline rows={3} fullWidth label="Descrição"></TextField>
						</Grid>
						<Button onClick={handleCancel} className={classes.btn} color="secondary">
							Cancelar
						</Button>
						<Button type="submit" className={classes.btn} variant="contained" color="primary" onClick={handleSubmit}>
							Iniciar
						</Button>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>
	);
}
