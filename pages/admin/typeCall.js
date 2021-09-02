import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Grid, IconButton, makeStyles, Paper, Switch, TextField, Tooltip } from "@material-ui/core";
import { AddToQueue, Delete } from "@material-ui/icons";
import Head from "next/head";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import moment from "moment";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { TypeCallClass } from "../../classes";

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
	paddingBtn: {
		padding: "10px",
	},
}));

export default function TypeCall({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);
	const [stateTypeCall, setTypeCall] = useState({ name: "", slaDefault: "" });

	const { filterPermissionByScreen } = useContext(PermissionViewContext);
	const { permission } = useContext(AtuhenticationContext);
	const router = useRouter();

	useEffect(() => {
		const permissionsScren = filterPermissionByScreen("60bc30c7f582fe96a40b72a1");
		if (!Authentication(permissionsScren, permission?.name)) {
			return router.push("/");
		}
	}, []);

	const handleTypeCall = (e) => {
		setTypeCall({ ...stateTypeCall, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			setLoading(true);

			const res = await fetch("/api/typeCall", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(stateTypeCall),
			});

			if (res.status === 200) {
				const newType = await res.json();
				setDataTable([...dataTable, newType]);
				setTypeCall({ name: "", slaDefault: "" });
				enqueueSnackbar("Tipo de Chamado Cadastrado", { variant: "success" });
			} else {
				throw "Erro ao cadastrar o tipo de chamado.";
			}
			setLoading(false);
		} catch (e) {
			enqueueSnackbar(e, { variant: "error" });
			setLoading(false);
		}
	}

	const handleDelete = async (type) => {
		handleConfirmDialogClose();
		try {
			setLoading(true);
			const res = await fetch(`/api/typeCall/${type.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

			if (res.status === 200) {
				const deletedType = await res.json();
				setDataTable(
					dataTable.filter(function (p) {
						return p._id != deletedType._id;
					})
				);
				enqueueSnackbar(`Tipo de Chamado ${deletedType.name} deletada`, { variant: "success" });
			} else {
				throw "Erro ao deletar o tipo de chamado";
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	};

	const handleUpdate = async (id, active) => {
		try {
			const resType = await fetch(`/api/typeCall/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });

			if (resType.status != 200) throw "Erro ao atualizar o tipo de chamado";

			const type = await resType.json();
			type.active = active;
			const res = await fetch(`/api/typeCall/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(type) });

			if (res.status != 200) throw "Erro ao atualizar o tipo de chamado";
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
			setLoading(false);
		}
	};

	const columns = [
		{ name: "name", label: "Tipo de Chamado", options: { filter: false } },
		{ name: "slaDefault", label: "SLA Padrão", options: { filter: false } },
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
								handleUpdate(tableMeta.rowData[4], event.target.value === "Sim" ? false : true);
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
							<IconButton size="small" style={{ color: "#be6765" }} onClick={() => handleConfirmDialogOpen("Deletar Tipo", `Deseja realmente deletar o tipo de chamado ${tableMeta.rowData[0]}?`, handleDelete, { id: value })}>
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
			<CardPanel title="Telas" subtitle="Lista de telas do sistema" color="primary">
				<Container maxWidth="xl" spacing={3} className={classes.root}>
					<Grid container spacing={3} xs={12} direction="row">
						<Grid xs={12} md={6} direction="row" spacing={3} className={classes.padding}>
							<form onSubmit={handleSubmit}>
								<Grid container spacing={3} xs={12}>
									<Grid xs="8" md="9" lg="10">
										<TextField required id="name" name="name" margin="normal" value={stateTypeCall.name} onChange={handleTypeCall} fullWidth label="Tipo de Chamado" />
									</Grid>
									<Grid xs="4" md="3" lg="2">
										<TextField required id="slaDefault" name="slaDefault" type="number" margin="normal" value={stateTypeCall.slaDefault} onChange={handleTypeCall} fullWidth label="SLA Padrão" />
									</Grid>
								</Grid>

								<Grid xs="12" container justify="flex-end" className={classes.paddingBtn}>
									<Button color="primary" variant="outlined" type="submit" startIcon={<AddToQueue />}>
										Adicionar
									</Button>
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
	const data = await new TypeCallClass().getAll();
	return { props: { data } };
}
