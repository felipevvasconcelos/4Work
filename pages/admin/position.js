import React, { useState, useContext, useEffect } from "react";
import { Button, Container, Grid, IconButton, Paper, Switch, TextField, Tooltip } from "@material-ui/core";
import { AddToQueue, Delete } from "@material-ui/icons";
import Head from "next/head";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { PositionClass } from "../../classes";
import { makeStyles } from "@material-ui/core";
import { AtuhenticationContext } from '../../Context/AuthenticationContextAPI';
import { PermissionViewContext } from '../../Context/PermissionViewContext';
import { Authentication } from '../../middlewares/AuthenticationRoutes';
import { useRouter } from 'next/router';

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

export default function Position({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);
	const [statePosition, setStatePosition] = useState({ name: "" });

	const { filterPermissionByScreen } = useContext(PermissionViewContext);
	const { permission } = useContext(AtuhenticationContext);
	const router = useRouter();

	useEffect(() =>{
		const permissionsScren = filterPermissionByScreen("60bc30c7f582fe96a40b72a1");
		if(!Authentication(permissionsScren, permission?.name)){
			return router.push('/');
		}
	},[])

	const handleChange = (e) => {
		setStatePosition({ ...statePosition, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			setLoading(true);

			const res = await fetch("/api/position", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(statePosition),
			});

			if (res.status === 200) {
				const newType = await res.json();
				setDataTable([...dataTable, newType]);
				setStatePosition({ name: "" });
				enqueueSnackbar("Cargo Cadastrado", { variant: "success" });
			} else {
				throw "Erro ao cadastrar o cargo.";
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
			const res = await fetch(`/api/position/${type.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

			if (res.status === 200) {
				const deletedType = await res.json();
				setDataTable(
					dataTable.filter(function (p) {
						return p._id != deletedType._id;
					})
				);
				enqueueSnackbar(`Cargo ${deletedType.name} deletado`, { variant: "success" });
			} else {
				throw "Erro ao deletar o cargo";
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	};

	const handleUpdate = async (id, active) => {
		try {
			const resPosition = await fetch(`/api/position/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });

			if (resPosition.status != 200) throw "Erro ao buscar o cargo";

			const position = await resPosition.json();
			position.active = active;

			const res = await fetch(`/api/position/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(position) });

			if (res.status != 200) throw "Erro ao atualizar o cargo";
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
			setLoading(false);
		}
	};

	const columns = [
		{ name: "name", label: "Status", options: { filter: false } },
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
								handleUpdate(tableMeta.rowData[2], event.target.value === "Sim" ? false : true);
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
							<IconButton size="small" style={{ color: "#be6765" }} onClick={() => handleConfirmDialogOpen("Deletar Tipo", `Deseja realmente deletar o cargo ${tableMeta.rowData[0]}?`, handleDelete, { id: value })}>
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
			<CardPanel title="Cargos" subtitle="Lista de cargos" color="primary">
				<Container maxWidth="xl" spacing={3} className={classes.root}>
					<Grid container spacing={3} xs={12} direction="row">
						<Grid item xs={12} md={6} className={classes.padding}>
							<form onSubmit={handleSubmit}>
								<Grid container spacing={3} xs={12} justify="center">
									<Grid xs="12" md="6" lg="6">
										<TextField required id="name" name="name" margin="normal" value={statePosition.name} onChange={handleChange} fullWidth label="Cargo" />
										<Grid xs="12" container justify="flex-end" className={classes.paddingBtn}>
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
	const data = await new PositionClass().getAll();
	return { props: { data } };
}
