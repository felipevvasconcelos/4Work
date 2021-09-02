import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Grid, IconButton, makeStyles, Paper, Switch, TextField, Tooltip } from "@material-ui/core";
import { AddToQueue, Delete } from "@material-ui/icons";
import Head from "next/head";
import ViewClass from "../../classes/ViewClass";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import moment from "moment";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { AtuhenticationContext } from "../../Context/AuthenticationContextAPI";
import { PermissionViewContext } from "../../Context/PermissionViewContext";
import { useRouter } from "next/router";
import { Authentication } from "../../middlewares/AuthenticationRoutes";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "10px",
	},
	padding: {
		padding: "20px",
		width: "100%",
	},
}));

export default function Screen({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);

	const [module, setModule] = useState({ name: "", idFixed: "" });

	const { filterPermissionByScreen } = useContext(PermissionViewContext);
	const { permission } = useContext(AtuhenticationContext);
	const router = useRouter();

	useEffect(() => {
		const permissionsScren = filterPermissionByScreen("60bc30c7f582fe96a40b72a1");
		if (!Authentication(permissionsScren, permission?.name)) {
			return router.push("/");
		}
	}, []);

	const handleModule = (e) => {
		setModule({ ...module, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			setLoading(true);
			const res = await fetch("/api/screen", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(module),
			});

			if (res.status === 200) {
				const newView = await res.json();
				setDataTable([...dataTable, newView]);
				setModule({ name: "", idFixed: "" });
				enqueueSnackbar("Módulo Cadastrado", { variant: "success" });
			} else {
				throw "Erro ao cadastrar o módulo.";
			}
			setLoading(false);
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	}

	const handleDelete = async (view) => {
		handleConfirmDialogClose();
		try {
			setLoading(true);
			const res = await fetch(`/api/screen/${view.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

			if (res.status === 200) {
				const deletedView = await res.json();
				setDataTable(
					dataTable.filter(function (p) {
						return p._id != deletedView._id;
					})
				);
				enqueueSnackbar(`Tela ${deletedView.name} deletada`, { variant: "success" });
			} else {
				throw "Erro ao deletar a tela";
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	};

	const handleUpdate = async (id, active) => {
		try {
			const resView = await fetch(`/api/screen/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });
			if (resView.status === 200) {
				const view = await resView.json();
				view.active = active;
				const res = await fetch(`/api/screen/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(view) });
				if (!res.status === 200) throw "Erro ao atualizar a tela";
			} else {
				throw "Erro ao atualizar a tela";
			}
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
			setLoading(false);
		}
	};

	const columns = [
		{ name: "name", label: "Módulo", options: { filter: false } },
		{ name: "idFixed", label: "Nome Lógico", options: { filter: false } },
		{
			name: "creationDate",
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
				customBodyRender: (value, tableMeta, updateValue) => {
					// return <span>{value ? "Sim" : "Não"}</span>;
					return (
						<FormControlLabel
							label={value ? "Sim" : "Não"}
							value={value ? "Sim" : "Não"}
							control={<Switch size="small" color="primary" checked={value} value={value ? "Sim" : "Não"} />}
							onChange={(event) => {
								updateValue(event.target.value === "Sim" ? false : true);
								handleUpdate(tableMeta.rowData[3], event.target.value === "Sim" ? false : true);
							}}
						/>
					);
				},
			},
		},
		{
			name: "_id",
			label: "Deletar",
			options: {
				print: false,
				filter: false,
				customBodyRender: (value, tableMeta) => {
					return (
						<Tooltip title={"Deletar"}>
							<IconButton size="small" style={{ color: "#be6765" }} onClick={() => handleConfirmDialogOpen("Deletar Tela", `Deseja realmente deletar a tela ${tableMeta.rowData[0]}?`, handleDelete, { id: value })}>
								<Delete />
							</IconButton>
						</Tooltip>
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
			<CardPanel title="Módulos" subtitle="Lista de módulos do sistema" color="primary">
				<Container maxWidth="xl" spacing={3} className={classes.root}>
					<Grid container spacing={3} xs={12} direction="row">
						<Grid xs={12} md={6} direction="row" spacing={0} className={classes.padding}>
							<form onSubmit={handleSubmit}>
								<Grid container spacing={3} xs={12}>
									<Grid item xs={12} sm={6}>
										<TextField id="name" name="name" margin="normal" value={module.name} onChange={handleModule} fullWidth label="Nome do Módulo" />
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField id="idFixed" name="idFixed" margin="normal" value={module.idFixed} onChange={handleModule} fullWidth label="Nome lógico (utilizado nas permissões)" />
									</Grid>
									<Grid item xs={12}>
										<Grid xs={12} container justify="flex-end" alignContent="flex-start">
											<Button color="primary" variant="outlined" type="submit" startIcon={<AddToQueue />}>
												Adicionar
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</form>
						</Grid>
						<Grid container xs={12} md={6}>
							<Paper elevation={1} className={classes.padding}>
								<CustomDataTable data={dataTable} columns={columns}></CustomDataTable>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</CardPanel>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const view = new ViewClass();
	const data = await view.getAll();
	return { props: { data } };
}
