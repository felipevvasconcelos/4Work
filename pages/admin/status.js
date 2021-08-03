import React, { useState } from "react";
import { Button, Container, Grid, IconButton, makeStyles, Paper, Switch, TextField, Tooltip } from "@material-ui/core";
import { AddToQueue, Delete } from "@material-ui/icons";
import Head from "next/head";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import moment from "moment";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { StatusClass } from "../../classes";

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

export default function Status({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);
	const [stateStatus, setStatus] = useState({ name: "", module: "" });

	const handleStatus = (e) => {
		setStatus({ ...stateStatus, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			setLoading(true);

			const res = await fetch("/api/status", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(stateStatus),
			});

			if (res.status === 200) {
				const newType = await res.json();
				setDataTable([...dataTable, newType]);
				setStatus({ name: "", module: "" });
				enqueueSnackbar("Status Cadastrado", { variant: "success" });
			} else {
				throw "Erro ao cadastrar o status.";
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
			const res = await fetch(`/api/status/${type.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

			if (res.status === 200) {
				const deletedType = await res.json();
				setDataTable(
					dataTable.filter(function (p) {
						return p._id != deletedType._id;
					})
				);
				enqueueSnackbar(`Status ${deletedType.name} deletada`, { variant: "success" });
			} else {
				throw "Erro ao deletar o status";
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	};

	const handleUpdate = async (id, active) => {
		try {
			const resStatus = await fetch(`/api/status/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });

			if (resStatus.status != 200) throw "Erro ao buscar o status";

			const status = await resStatus.json();
			status.active = active;
			const res = await fetch(`/api/status/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(status) });

			if (res.status != 200) throw "Erro ao atualizar o status";
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
			setLoading(false);
		}
	};

	const columns = [
		{ name: "name", label: "Status", options: { filter: false } },
		{ name: "module", label: "Módulo", options: { filter: false } },
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
							<IconButton size="small" style={{ color: "#be6765" }} onClick={() => handleConfirmDialogOpen("Deletar Tipo", `Deseja realmente deletar o status ${tableMeta.rowData[0]}?`, handleDelete, { id: value })}>
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
			<CardPanel title="Status" subtitle="Lista de status por módulo cadastrados" color="primary">
				<Container maxWidth="xl" spacing={3} className={classes.root}>
					<Grid container spacing={3} xs={12} direction="row">
						<Grid item xs={12} md={6} className={classes.padding}>
							<form onSubmit={handleSubmit}>
								<Grid container spacing={3} xs={12}>
									<Grid xs="12" md="6" lg="6">
										<TextField required id="name" name="name" margin="normal" value={stateStatus.name} onChange={handleStatus} fullWidth label="Status" />
									</Grid>
									<Grid xs="12" md="6" lg="6">
										<TextField required id="module" name="module" margin="normal" value={stateStatus.module} onChange={handleStatus} fullWidth label="Módulo" />
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
	const data = await new StatusClass().getAll();
	return { props: { data } };
}
