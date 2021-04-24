import { Container, Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import QueueIcon from "@material-ui/icons/Queue";
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
	{ name: "_id", label: "ID" },
	{ name: "name", label: "Nome" },
	{ name: "email", label: "E-mail" },
	{ name: "createdAt", label: "Data Criação" },
	{ name: "updatedAt", label: "Última Alteração" },
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
			<CardPanel title="Usuários" subtitle="Lista de usuários cadastrados" color="primary" footer="Exibição de todos usuários">
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
	//EXEMPLO PARA API INTERNA, PORÉM NÃO É RECOMENDADO PELA DOC DO NEXT
	//DESSA FORMA É NECESSÁRIO A CRIAÇÃO DE CLASSES PARA A INCLUSÃO DA LÓGICA E
	//ASSIM EFETUAR AS CHAMADAS DAS CLASSES NOS COMPONENTE E NA API
	//const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users`, context.req);
	//const data = await res.json();

	const user = new UserClass();
	const data = await user.getUsers();

	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: { data },
	};
}
