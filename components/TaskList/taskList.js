import React from "react";
import { makeStyles, useTheme, Chip, Avatar, Container, Grid, TextField, Button, FormControl, InputLabel, Select, Input, MenuItem } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DoneIcon from "@material-ui/icons/Done";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 180,
		maxWidth: 300,
	},
	root: {
		display: "flex",
		justifyContent: "center",
		flexWrap: "wrap",
		"& > *": {
			margin: theme.spacing(0.5),
		},
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(1),
	},
	pchip: {
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		maxWidth: "20rem",
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
	button: {
		margin: theme.spacing(2),
		minWidth: 180,
	},
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const names = ["Oliver Hansen", "Van Henry", "April Tucker", "Ralph Hubbard", "Omar Alexander", "Carlos Abbott", "Miriam Wagner", "Bradley Wilkerson", "Virginia Andrews", "Kelly Snyder"];

function getStyles(name, personName, theme) {
	return {
		fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
	};
}

export default function TaskList() {
	const classes = useStyles();
	const theme = useTheme();
	const [personName, setPersonName] = React.useState([]);

	const handleChange = (event) => {
		setPersonName(event.target.value);
	};

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		setPersonName(value);
	};

	const handleDelete = () => {
		console.info("You clicked the delete icon.");
	};

	const handleClick = () => {
		console.info("You clicked the Chip.");
	};

	return (
		<>
			<Container className={classes.root}>
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="primary" variant="outlined" deleteIcon={<DoneIcon />} avatar={<Avatar>F</Avatar>} label="Atualizar Planilha de chamados" onDelete={handleClick} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
				<Chip className={classes.pchip} color="secondary" variant="outlined" avatar={<Avatar>F</Avatar>} label="Item Lista" onDelete={handleDelete} />
			</Container>
			<Grid alignItems="flex-end">
				<form className={classes.root} noValidate autoComplete="off">
					<FormControl className={classes.formControl}>
						<TextField id="standard-basic" multiline rowsMax={4} label="Nova Tarefa" />
					</FormControl>

					<FormControl className={classes.formControl}>
						<InputLabel id="demo-mutiple-chip-label">Para</InputLabel>
						<Select
							labelId="demo-mutiple-chip-label"
							id="demo-mutiple-chip"
							multiple
							value={personName}
							onChange={handleChange}
							input={<Input id="select-multiple-chip" />}
							renderValue={(selected) => (
								<div className={classes.chips}>
									{selected.map((value) => (
										<Chip key={value} label={value} className={classes.chip} />
									))}
								</div>
							)}
							MenuProps={MenuProps}
						>
							{names.map((name) => (
								<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
									{name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button variant="contained" color="primary" size="medium" className={classes.button} startIcon={<AddCircleIcon />} style={{ background: green[500] }}>
						Add
					</Button>
				</form>
			</Grid>
		</>
	);
}
