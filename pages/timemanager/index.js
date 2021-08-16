import React, { useState } from "react";
import { Button, Container, Grid, IconButton, makeStyles, Paper, Switch, TextField, Tooltip } from "@material-ui/core";
import { AddToQueue, Delete } from "@material-ui/icons";
import Head from "next/head";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import moment from "moment";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { StatusClass } from "../../classes";
import { Chart, ArgumentAxis, ValueAxis, BarSeries, LineSeries, Legend } from "@devexpress/dx-react-chart-material-ui";
import { ValueScale } from "@devexpress/dx-react-chart";
import { FormControl } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "10px",
	},
	padding: {
		padding: "20px",
		width: "100%",
	},
	paddingBtn: {
		padding: "10px",
	},
}));

const chartData = [
	{ month: "Jan", sale: 50, total: 987 },
	{ month: "Feb", sale: 100, total: 3000 },
	{ month: "March", sale: 30, total: 1100 },
	{ month: "April", sale: 107, total: 7100 },
	{ month: "May", sale: 95, total: 4300 },
	{ month: "June", sale: 150, total: 7500 },
];

export default function Timemanager({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<Grid container spacing={1} direction="row" alignItems="flex-start" xs={12}>
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Visualização por Tipo" color="primary">
						<Chart data={chartData}>
							<ValueScale name="sale" />
							<ValueScale name="total" />
							<ArgumentAxis />
							<ValueAxis scaleName="sale" showGrid={false} showLine showTicks />
							<ValueAxis scaleName="total" position="right" showGrid={false} showLine showTicks />
							<BarSeries name="Units Sold" color="black" valueField="sale" argumentField="month" scaleName="sale" />
							<LineSeries name="Total Transactions" valueField="total" argumentField="month" scaleName="total" />
							<Legend />
						</Chart>
					</CardPanel>
				</Grid>
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Visualização por Usuário" color="primary">
						<Chart data={chartData}>
							<ValueScale name="sale" />
							<ValueScale name="total" />
							<ArgumentAxis />
							<ValueAxis scaleName="sale" showGrid={false} showLine showTicks />
							<ValueAxis scaleName="total" position="right" showGrid={false} showLine showTicks />
							<BarSeries name="Units Sold" color="black" valueField="sale" argumentField="month" scaleName="sale" />
							<LineSeries name="Total Transactions" valueField="total" argumentField="month" scaleName="total" />
							<Legend />
						</Chart>
					</CardPanel>
				</Grid>
			</Grid>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const data = await new StatusClass().getAll();
	return { props: { data } };
}
