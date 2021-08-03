import { Container, Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Assignment, Edit, Group } from "@material-ui/icons";
import QueueIcon from "@material-ui/icons/Queue";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { UserClass } from "../../classes";
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
	{ name: "name", label: "Nome" },
	{ name: "email", label: "E-mail" },
	{ name: "position", label: "Cargo", options: { customBodyRender: (value) => value?.name } },
	{ name: "profile", label: "Perfil", options: { customBodyRender: (value) => value?.name } },
	{ name: "company", label: "Empresa", options: { customBodyRender: (value) => value?.name } },
	{
		name: "createdAt",
		label: "Data Criação",
		options: {
			filter: false,
			customBodyRender: (value) => moment(new Date(value)).format("DD/MM/YYYY HH:mm"),
		},
	},
	{
		name: "active",
		label: "Ativo",
		options: {
			filter: false,
			customBodyRender: (value) => (value ? "Sim" : "Não"),
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
						<Link href={`/user/${value}`}>
							<Tooltip title={"Editar"}>
								<IconButton size="small" style={{ color: "#2E8BC0" }}>
									<Edit />
								</IconButton>
							</Tooltip>
						</Link>
						<Link href={`/call?idUser=${value}`}>
							<Tooltip title={"Chamados"}>
								<IconButton size="small" color="primary">
									<Assignment />
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
	<Link href="/user/new">
		<Tooltip title={"Adicionar Usuário"}>
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

const useStyles = makeStyles(styles);

export default function User({ data }) {
	const classes = useStyles();

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<CardPanel title="Usuários" subtitle="Lista de usuários cadastrados" color="primary">
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
	const userClass = new UserClass();

	if (context.query.idCompany) {
		const data = await userClass.getByFilter({ company: context.query.idCompany });
		return { props: { data } };
	} else {
		const data = await userClass.getAll();
		return { props: { data } };
	}
}
