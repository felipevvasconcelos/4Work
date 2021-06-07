import { Container, Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Edit, Group } from "@material-ui/icons";
import QueueIcon from "@material-ui/icons/Queue";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { CompanyClass } from "../../classes";
import moment from "moment";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";

const useStyles = makeStyles((theme) => ({
	textCenter: {
		textAlign: "center",
	},
	textMuted: {
		color: "#6c757d",
	},
}));

const customToolbar = (
	<Link href="/company/new">
		<Tooltip title={"Adicionar Empresa"}>
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

export default function Company({ data }) {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);

	const columns = [
		{ name: "active", options: { print: false, filter: false, sort: false, display: false } },
		{ name: "document", label: "CNPJ", options: { filter: false } },
		{ name: "name", label: "Nome", options: { filter: false } },
		{ name: "companyName", label: "Razão Social", options: { filter: false } },
		{
			name: "creationDate",
			label: "Data Criação",
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
							<Link href={`/company/${value}`}>
								<Tooltip title={"Editar"}>
									<IconButton size="small" style={{ color: "#2E8BC0" }}>
										<Edit />
									</IconButton>
								</Tooltip>
							</Link>
							<Link href={`/user?idCompany=${value}`}>
								<Tooltip title={"Usuários"}>
									<IconButton size="small" color="primary">
										<Group />
									</IconButton>
								</Tooltip>
							</Link>
						</div>
					);
				},
			},
		},
	];

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<CardPanel title="Empresas" subtitle="Lista de empresas cadastradas" color="primary">
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
	const data = await new CompanyClass().getAll();
	return { props: { data } };
}
