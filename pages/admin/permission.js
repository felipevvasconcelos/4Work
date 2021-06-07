import React, { useState } from "react";
import { Button, Grid, IconButton, InputLabel, makeStyles, MenuItem, Paper, Select, Switch, Tooltip } from "@material-ui/core";
import { AddToPhotos, Delete } from "@material-ui/icons";
import Head from "next/head";
import { PermissionClass, ProfileTypeClass, ViewClass } from "../../classes";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import { useSnackbar } from "notistack";
import { FormControlLabel } from "@material-ui/core";
import { FormControl } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "10px",
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	padding: {
		padding: "20px",
		width: "100%",
	},
}));

export default function Permission({ data, profiles, views, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	//Padrão
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);
	const [statePermission, setStatePermission] = useState({
		view: "",
		profile: "",
		allowView: false,
		allowCreate: false,
		allowEdit: false,
		allowDelete: false,
	});

	const handleChangePermission = (event) => {
		if (event.target.name.includes("allow")) {
			setStatePermission({ ...statePermission, [event.target.name]: event.target.checked });
		} else {
			setStatePermission({ ...statePermission, [event.target.name]: event.target.value });
		}
	};

	//Controladores
	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			setLoading(true);
			const res = await fetch("/api/permission", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(statePermission),
			});

			if (res.status === 200) {
				const permission = await res.json();
				setDataTable([...dataTable, permission]);
				setStatePermission({
					view: "",
					profile: "",
					allowView: false,
					allowCreate: false,
					allowEdit: false,
					allowDelete: false,
				});
				enqueueSnackbar("Permissão Adicionada", { variant: "success" });
			} else {
				throw "Erro ao cadastrar a permissão.";
			}
			setLoading(false);
		} catch (e) {
			enqueueSnackbar(e, { variant: "error" });
			setLoading(false);
		}
	}

	const handleDelete = async (permission) => {
		handleConfirmDialogClose();
		try {
			setLoading(true);
			const res = await fetch(`/api/permission/${permission.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

			if (res.status === 200) {
				const deletedPermission = await res.json();
				setDataTable(
					dataTable.filter(function (p) {
						return p._id != deletedPermission._id;
					})
				);
				enqueueSnackbar(`Permissão deletada`, { variant: "success" });
			} else {
				throw "Erro ao deletar a permissão";
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	};

	const handleUpdate = async (id, collumn, value) => {
		try {
			const resPermission = await fetch(`/api/permission/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });
			if (resPermission.status === 200) {
				var permission = await resPermission.json();
				permission = { ...permission, [collumn]: value };

				const res = await fetch(`/api/permission/${permission._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(permission) });

				if (!res.status === 200) throw "Erro ao atualizar a permissão";
			} else {
				throw "Erro ao atualizar a permissão";
			}
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
			setLoading(false);
		}
	};
	//Colunas
	const columns = [
		{ name: "profile", label: "Perfil", options: { customBodyRender: (value) => value.name } },
		{ name: "view", label: "Tela", options: { customBodyRender: (value) => value.name } },
		{
			name: "allowView",
			label: "Visualizar",
			options: {
				filter: false,
				customBodyRender: (value, tableMeta, updateValue) => {
					return (
						<FormControlLabel
							label={value ? "Sim" : "Não"}
							value={value}
							control={<Switch size="small" color="primary" checked={value} />}
							onChange={(event) => {
								updateValue(event.target.checked);
								handleUpdate(tableMeta.rowData[6], "allowView", event.target.checked);
							}}
						/>
					);
				},
			},
		},
		{
			name: "allowCreate",
			label: "Criar",
			options: {
				filter: false,
				customBodyRender: (value, tableMeta, updateValue) => {
					return (
						<FormControlLabel
							label={value ? "Sim" : "Não"}
							value={value}
							control={<Switch size="small" color="primary" checked={value} />}
							onChange={(event) => {
								updateValue(event.target.checked);
								handleUpdate(tableMeta.rowData[6], "allowCreate", event.target.checked);
							}}
						/>
					);
				},
			},
		},
		{
			name: "allowEdit",
			label: "Editar",
			options: {
				filter: false,
				customBodyRender: (value, tableMeta, updateValue) => {
					// return <span>{value ? "Sim" : "Não"}</span>;
					return (
						<FormControlLabel
							label={value ? "Sim" : "Não"}
							value={value}
							control={<Switch size="small" color="primary" checked={value} />}
							onChange={(event) => {
								updateValue(event.target.checked);
								handleUpdate(tableMeta.rowData[6], "allowEdit", event.target.checked);
							}}
						/>
					);
				},
			},
		},
		{
			name: "allowDelete",
			label: "Deletar",
			options: {
				filter: false,
				customBodyRender: (value, tableMeta, updateValue) => {
					return (
						<FormControlLabel
							label={value ? "Sim" : "Não"}
							value={value}
							control={<Switch size="small" color="primary" checked={value} />}
							onChange={(event) => {
								updateValue(event.target.checked);
								handleUpdate(tableMeta.rowData[6], "allowDelete", event.target.checked);
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
				sort: false,
				print: false,
				filter: false,
				customBodyRender: (value, tableMeta) => {
					return (
						<Tooltip title={"Deletar"}>
							<IconButton size="small" style={{ color: "#be6765" }} onClick={() => handleConfirmDialogOpen("Deletar Tela", `Deseja realmente deletar a permissão do ${tableMeta.rowData[0].name} na tela ${tableMeta.rowData[1].name}?`, handleDelete, { id: value })}>
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
			<CardPanel title="Permissões" subtitle="Lista de permissões por perfil" color="primary">
				<Grid container spacing={3} xs={12} direction="row">
					<Grid xs={12} md={6} direction="row" spacing={3} className={classes.padding}>
						<form onSubmit={handleSubmit}>
							<Grid xs="12" container>
								<FormControl fullWidth className={classes.formControl}>
									<InputLabel>Perfis</InputLabel>
									<Select
										id="profile"
										name="profile"
										value={statePermission.profile}
										fullWidth
										onChange={(e) => {
											handleChangePermission(e);
										}}
									>
										{profiles.map((profile) => (
											<MenuItem value={profile._id}>{profile.name}</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl fullWidth className={classes.formControl}>
									<InputLabel>Telas</InputLabel>
									<Select
										id="view"
										name="view"
										value={statePermission.view}
										fullWidth
										onChange={(e) => {
											handleChangePermission(e);
										}}
									>
										{views.map((view) => (
											<MenuItem value={view._id}>{view.name}</MenuItem>
										))}
									</Select>
								</FormControl>
								<Grid container direction="row" className={classes.formControl}>
									<FormControlLabel
										control={
											<Switch
												name="allowView"
												color="primary"
												onChange={(e) => {
													handleChangePermission(e);
												}}
												checked={statePermission.allowView}
												value={statePermission.allowView}
											/>
										}
										label="Visualizar"
									/>
									<FormControlLabel
										control={
											<Switch
												name="allowCreate"
												color="primary"
												onChange={(e) => {
													handleChangePermission(e);
												}}
												checked={statePermission.allowCreate}
												value={statePermission.allowCreate}
											/>
										}
										label="Criar"
									/>
									<FormControlLabel
										control={
											<Switch
												name="allowEdit"
												color="primary"
												onChange={(e) => {
													handleChangePermission(e);
												}}
												checked={statePermission.allowEdit}
												value={statePermission.allowEdit}
											/>
										}
										label="Editar"
									/>
									<FormControlLabel
										control={
											<Switch
												name="allowDelete"
												color="primary"
												onChange={(e) => {
													handleChangePermission(e);
												}}
												checked={statePermission.allowDelete}
												value={statePermission.allowDelete}
											/>
										}
										label="Deletar"
									/>
								</Grid>
							</Grid>
							<Grid xs="12" container justify="flex-end">
								<FormControl className={classes.formControl}>
									<Button color="primary" variant="outlined" type="submit" startIcon={<AddToPhotos />}>
										Adicionar
									</Button>
								</FormControl>
							</Grid>
						</form>
					</Grid>
					<Grid container xs={12} md={6}>
						<Paper elevation={1} className={classes.padding}>
							<CustomDataTable data={dataTable} columns={columns}></CustomDataTable>
						</Paper>
					</Grid>
				</Grid>
			</CardPanel>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const data = await new PermissionClass().getAll();
	const views = await new ViewClass().getAll();
	const profiles = await new ProfileTypeClass().getAll();
	return { props: { data, views, profiles } };
}
