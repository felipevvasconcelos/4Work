import Head from "next/head";
import React from "react";
import { IconButton, Tooltip, Container, Grid } from "@material-ui/core";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import { CardPanel, CustomDataTable, Layout, siteTittle } from "../../components";
import QueueIcon from "@material-ui/icons/Queue";

const columns = ["Título", "Operador", "Solicitante", "Data Criação", "Sla"];

const data = [
	["Titulo chamado teste", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste2", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste3", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste4", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste5", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste55", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste6", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste66", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste7", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste8", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste9", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste999", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste65553", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste45347", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
	["Titulo chamado teste63636", "Felipe", "Felipinho", "07/03/2021", "07/03/2021"],
];

const customToolbar = (
	<Link href="/call/new">
		<Tooltip title={"Novo Chamado"}>
			<IconButton
				aria-label="add"
				style={{
					order: -1,
					color: "#66d393",
					marginLeft: "25px",
					marginRight: "-40px",
				}}
			>
				<QueueIcon />
			</IconButton>
		</Tooltip>
	</Link>
);

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			width: "100%",
			height: "100%",
		},
	},
	formRoot: {
		display: "flex",
		flexWrap: "wrap",
		padding: "20px",
	},
	btnAdd: {
		marginRight: "-10px",
		color: theme.palette.success.main,
	},
}));

export default function Call() {
	const classes = useStyles();

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<CardPanel title="Chamados" subtitle="Lista de chamados cadastrados" color="primary" footer="Exibição de todos os chamados">
				<div>
					<Container maxWidth="xl">
						<div className={classes.root}>
							<Grid container spacing={3} justify="flex-end" style={{ marginBottom: "3px" }}></Grid>
						</div>
						<div className={classes.root}>
							<CustomDataTable data={data} columns={columns}>
								{customToolbar}
							</CustomDataTable>
						</div>
					</Container>
				</div>
			</CardPanel>
		</Layout>
	);
}
