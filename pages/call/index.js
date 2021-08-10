import Head from "next/head";
import React from "react";
import { IconButton, Tooltip, Container, Grid } from "@material-ui/core";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import { CardPanel, CustomDataTable, Layout, siteTittle } from "../../components";
import QueueIcon from "@material-ui/icons/Queue";
import CallClass from '../../classes/CallClass';
import moment from "moment";
import { Edit } from "@material-ui/icons";

const columns = [
	{ name: "title", label: "Nome do Chamado" },
	{ 
		name: "userCreate", 
		label: "Solicitante",
		options: {
			customBodyRender: (value) => {
				return value.name;
			}
		}
	},
	{ 
		name: "status", 
		label: "status",
		options: {
			customBodyRender: (value) => {
				return value.name;
			}
		}
	},
	{ name: "callNumber", label: "Número do Chamado" },
	{ 
		name: "dateCreate", 
		label: "Data de Criação",
		options: {
			filter: false,
			customBodyRender: (value) => moment(new Date(value)).format("DD/MM/YYYY HH:mm"),
		},
	},
	{
		name: "_id",
		label: "Ações",
		options: {
			sort: false,
			print: false,
			filter: false,
			customBodyRender: (value, tableMeta) => {
				return (
					<div>
						<Link href={`/call/${value}`}>
							<Tooltip title={"Editar"}>
								<IconButton size="small" style={{ color: "#2E8BC0" }}>
									<Edit />
								</IconButton>
							</Tooltip>
						</Link> 
					</div>
				);
			},
		},
	},
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

export default function Call({ data }) {
	const classes = useStyles();

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<CardPanel title="Chamados" subtitle="Lista de chamados cadastrados" color="primary">
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

export async function getServerSideProps(context) {
	const callClass = new CallClass();

	var data = await callClass.getAll();

	return {props: { data }};
}