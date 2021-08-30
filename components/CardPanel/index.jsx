import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "./Card";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import PropTypes from "prop-types";
import { Button, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	titleHeader: {
		color: "white",
		fontFamily: theme.typography.h5.fontFamily,
		fontWeight: "bold",
		display: "flex",
		alignItems: "flex-end",
	},
	subtitleHeader: {
		color: "#E9EAEC",
		fontFamily: theme.typography.h6.fontFamily,
		fontStyle: "italic",
		display: "flex",
		alignItems: "flex-end",
	},
}));

export default function CardPanel(props) {
	const classes = useStyles();
	const { title, children, color, subtitle, chart } = props;

	return (
		<Card className={classes.textCenter}>
			<CardHeader color={color}>
				<Grid container justify="space-between" alignContent="flex-end">
					{chart}
					<Typography variant="h5" className={classes.titleHeader}>
						{title}
					</Typography>
					<Typography align="right" variant="subtitle1" className={classes.subtitleHeader}>
						{subtitle}
					</Typography>
				</Grid>
			</CardHeader>
			<CardBody>{children}</CardBody>
			<CardFooter className={classes.textMuted}></CardFooter>
		</Card>
	);
}

CardPanel.propTypes = {
	title: PropTypes.string,
	color: PropTypes.string,
	children: PropTypes.node,
};
