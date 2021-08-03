import { Container, Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Assignment, Edit, Group } from "@material-ui/icons";
import QueueIcon from "@material-ui/icons/Queue";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { ProjectClass } from "../../classes";
import { CardPanel, CustomDataTable, Layout, siteTittle } from "../../components";

const styles = {
	//cardTitle,
	textCenter: {
		textAlign: "center",
	},
	textMuted: {
		color: "#6c757d",
	},
};

const columns = [
	{ name: "projectNumber", label: "Número" },
	{ name: "name", label: "Projeto" },
	{ name: "company", label: "Cliente", options: { customBodyRender: (value) => value.name } },
	{ name: "status", label: "Status", options: { customBodyRender: (value) => value.name } },
	{
		name: "dateStart",
		label: "Data Ínicio",
		options: {
			filter: false,
			customBodyRender: (value) => moment(new Date(value)).format("DD/MM/YYYY HH:mm"),
		},
	},
	{
		name: "dateEnd",
		label: "Data Fim",
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
						<Link href={`/project/${value}`}>
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

const useStyles = makeStyles(styles);

const customToolbar = (
	<Link href="/project/new">
		<Tooltip title={"Adicionar Projeto"}>
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

export default function Project({ data }) {
	const classes = useStyles();

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<CardPanel title="Projetos" subtitle="Lista de projetos cadastrados" color="primary">
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
	const projectClass = new ProjectClass();

	const data = await projectClass.getAll();
	return { props: { data } };
}
