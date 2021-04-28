import Head from "next/head";
import React from "react";
import { CardPanel, Layout, siteTittle } from "../../components";
import { useRouter } from "next/router";
import { Typography, TextField, Avatar, Grid, makeStyles } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { ButtonBase } from "@material-ui/core";
import Image from "next/image";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	container: {},
	containerAvatar: {
		marginTop: "15px",
		marginBottom: "5px",
		width: "100px",
		height: "100px",
	},
	avatar: {
		maxWidth: "100%",
		maxHeight: "100%",
	},
}));

export default function UserById() {
	const route = useRouter();
	const classes = useStyles();

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{/* <h1>This is a User {route.query.id} </h1> */}
			<div className={classes.root}>
				<CardPanel title={route.query.id != "new" ? "Edição de Usuário" : "Cadastro de Usuário"} subtitle="" color="primary">
					<Container maxWidth="xl" className={classes.container}>
						<Grid container spacing={3}>
							<Grid container xs={12}>
								<Grid container alignItems="center" justify="center" direction="column" xs={12} md={6}>
									<TextField id="userName" margin="normal" fullWidth label="Nome do Usuário" />
									<TextField id="email" margin="normal" fullWidth label="E-mail" />
								</Grid>
								<Grid container alignItems="center" justify="center" direction="column" xs={12} md={6}>
									<ButtonBase className={classes.containerAvatar}>
										<Image className={classes.avatar} src="/images/logo.png" width={100} height={100}></Image>
									</ButtonBase>
									<Typography id="lblUserName" variant="h5">
										Nome do usuário
									</Typography>
								</Grid>
							</Grid>
							<Grid container xs={12}></Grid>
						</Grid>
					</Container>
				</CardPanel>
			</div>
		</Layout>
	);
}
