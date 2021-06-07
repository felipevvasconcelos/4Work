import { Avatar, Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	wrapper: {
		margin: theme.spacing(1),
		position: "relative",
	},
	fabProgress: {
		position: "absolute",
		top: -6,
		left: -5,
	},
	avatar: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}));

export default function Loading() {
	const classes = useStyles();
	return (
		<Backdrop className={classes.backdrop} open={true}>
			<div className={classes.root}>
				<div className={classes.wrapper}>
					<Avatar size={68} alt="Logo" className={classes.avatar} variant="circular" src="/images/logoOnly.png"></Avatar>
					<CircularProgress size={68} className={classes.fabProgress} />
				</div>
			</div>
		</Backdrop>
	);
}
