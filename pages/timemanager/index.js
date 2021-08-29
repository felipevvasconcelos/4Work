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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

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
						<Grid item xs={12} style={{ padding: "5px" }}>
							<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12}>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12} style={{ marginBottom: "4px" }}>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Início"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Fim"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
										<Grid item xs={10} md={8}>
											<FormControl fullWidth margin="normal">
												<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
												<Select labelId="demo-simple-select-label" id="demo-simple-select">
													<MenuItem value={10}>Projeto tal</MenuItem>
													<MenuItem value={20}>Melhoria x</MenuItem>
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={1}>
											<Tooltip title={"Exportar Relatório"}>
												<IconButton style={{ color: "grey" }}>
													<FontAwesomeIcon icon={faFileExport} />
												</IconButton>
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
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
						</Grid>
					</CardPanel>
				</Grid>
				<Grid item xs={12} lg={6}>
					<CardPanel title="" subtitle="Visualização por Usuário" color="primary">
						<Grid item xs={12} style={{ padding: "5px" }}>
							<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12}>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end" xs={12} style={{ marginBottom: "4px" }}>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Início"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												id="timeStart"
												name="timeStart"
												type="date"
												fullWidth
												label="Fim"
												InputLabelProps={{
													shrink: true,
												}}
											></TextField>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={6}>
									<Grid container spacing={1} direction="row" justify="flex-end" alignItems="flex-end" xs={12}>
										<Grid item xs={10} md={8}>
											<FormControl fullWidth margin="normal">
												<InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
												<Select labelId="demo-simple-select-label" id="demo-simple-select">
													<MenuItem value={10}>Projeto tal</MenuItem>
													<MenuItem value={20}>Melhoria x</MenuItem>
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={1}>
											<Tooltip title={"Exportar Relatório"}>
												<IconButton style={{ color: "grey" }}>
													<FontAwesomeIcon icon={faFileExport} />
												</IconButton>
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12}>
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
						</Grid>
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
