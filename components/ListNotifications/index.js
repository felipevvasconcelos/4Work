import { Avatar, Dialog, DialogContent, DialogTitle, Grid, Grow, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Paper, Slide, Tooltip } from "@material-ui/core";
import { AssignmentIndOutlined, Close, Delete, ErrorOutline, Info, Warning } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
	dialog: {
		position: "absolute",
		right: 105,
		top: 25,
	},
	paper: {
		margin: theme.spacing(1),
	},
	iconWarning: {
		color: theme.palette.warning.main,
	},
	iconInfo: {
		color: theme.palette.info.main,
	},
	transparent: {
		color: "transparent",
		backgroundColor: "transparent",
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

export default function ListNotifications({ open, data, closeFunction, onClose }) {
	const classes = useStyles();

	return (
		<Dialog
			classes={{
				paper: classes.dialog,
			}}
			onClose={(event, reason) => {
				if (reason === "backdropClick") {
					closeFunction();
				}
			}}
			fullWidth
			open={open}
			aria-labelledby="alert-dialog-title"
			TransitionComponent={Transition}
		>
			<DialogTitle>
				<Grid container justify="space-between" alignItems="center">
					Notificações
					<IconButton
						onClick={() => {
							closeFunction();
						}}
					>
						<Close color="error" />
					</IconButton>
				</Grid>
			</DialogTitle>
			<DialogContent>
				<List dense={false}>
					{/* Tipo error */}
					<ListItem divider>
						<ListItemAvatar>
							<Avatar className={classes.transparent}>
								<ErrorOutline color="error" />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Single-line item" secondary={true ? "Secondary text" : null} />
						<ListItemSecondaryAction>
							<Tooltip title="Excluir Notificação">
								<IconButton edge="end" aria-label="delete">
									<Delete />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
					{/* Tipo warning */}
					<ListItem divider>
						<ListItemAvatar>
							<Avatar className={classes.transparent}>
								<Warning className={classes.iconWarning} />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Single-line item" secondary={true ? "Secondary text" : null} />
						<ListItemSecondaryAction>
							<Tooltip title="Excluir Notificação">
								<IconButton edge="end" aria-label="delete">
									<Delete />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
					{/* Tipo info */}
					{/* Ultimo não tem divider */}
					<ListItem>
						<ListItemAvatar>
							<Avatar className={classes.transparent}>
								<Info className={classes.iconInfo} />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Single-line item" secondary={true ? "Secondary text" : null} />
						<ListItemSecondaryAction>
							<Tooltip title="Excluir Notificação">
								<IconButton edge="end" aria-label="delete">
									<Delete />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			</DialogContent>
		</Dialog>
	);
}
