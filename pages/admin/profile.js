import { IconButton, Container, Grid, Button, Paper, makeStyles, Tooltip, FormControlLabel, Switch, TextField } from "@material-ui/core";
import { Delete, PersonAdd } from "@material-ui/icons";
import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { ProfileTypeClass } from "../../classes";
import { CardPanel, CustomDataTable, Layout, Loading, siteTittle } from "../../components";
import moment from "moment";
import { useSnackbar } from "notistack";
import { Authentication } from '../../middlewares/AuthenticationRoutes';
import { AtuhenticationContext } from '../../Context/AuthenticationContextAPI';
import { PermissionViewContext } from '../../Context/PermissionViewContext';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "10px",
	},
	padding: {
		padding: "20px",
		width: "100%",
	},
}));

export default function Profile({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);
	const [nameProfile, setNameProfile] = useState("");

	const { filterPermissionByScreen } = useContext(PermissionViewContext);
	const { permission } = useContext(AtuhenticationContext);
	const router = useRouter();

	useEffect(() =>{
		const permissionsScren = filterPermissionByScreen("60bc30c7f582fe96a40b72a1");
		if(!Authentication(permissionsScren, permission?.name)){
			return router.push('/');
		}
	},[])

	const handleNameProfile = (e) => {
		setNameProfile(e.target.value);
	};

	async function handleSubmit(e) {
		e.preventDefault(e);

		try {
			setLoading(true);
			const body = { name: e.currentTarget.nameProfile.value };
			const res = await fetch("/api/profileType", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (res.status === 200) {
				const newProfile = await res.json();
				setDataTable([...dataTable, newProfile]);
				setNameProfile("");
				enqueueSnackbar("Perfil Cadastrado", { variant: "success" });
			} else {
				throw "Erro ao cadastrar o perfil.";
			}
			setLoading(false);
		} catch (e) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	}

	const handleDelete = async (profile) => {
		handleConfirmDialogClose();
		try {
			setLoading(true);
			const res = await fetch(`/api/profileType/${profile.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

			if (res.status === 200) {
				const deletedProfile = await res.json();
				setDataTable(
					dataTable.filter(function (p) {
						return p._id != deletedProfile._id;
					})
				);
				enqueueSnackbar(`Perfil ${deletedProfile.name} deletado`, { variant: "success" });
			} else {
				throw "Erro ao deletar o perfil";
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar(e.message, { variant: "error" });
			setLoading(false);
		}
	};

	const handleUpdate = async (id, active) => {
		try {
			const resProfile = await fetch(`/api/profileType/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });
			if (resProfile.status === 200) {
				const profile = await resProfile.json();
				profile.active = active;
				console.log(profile.active);
				const res = await fetch(`/api/profileType/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
				if (!res.status === 200) throw "Erro ao atualizar o perfil";
			} else {
				throw "Erro ao atualizar o perfil";
			}
		} catch (error) {
			enqueueSnackbar(error, { variant: "error" });
			setLoading(false);
		}
	};

	const columns = [
		{ name: "name", label: "Perfil", options: { filter: false } },
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
							<IconButton size="small" style={{ color: "#be6765" }} onClick={() => handleConfirmDialogOpen("Deletar Perfil", `Deseja realmente deletar o perfil ${tableMeta.rowData[0]}?`, handleDelete, { id: value })}>
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
			<CardPanel title="Tipos de Perfil" subtitle="Lista de perfis cadastrados" color="primary">
				<Container maxWidth="xl" spacing={3} className={classes.root}>
					<Grid container spacing={3} xs={12} direction="row">
						<Grid xs={12} md={6} direction="row" spacing={3} className={classes.padding}>
							<form onSubmit={handleSubmit}>
								<Grid xs="12">
									<TextField id="nameProfile" margin="normal" value={nameProfile} onChange={handleNameProfile} fullWidth label="Nome do Perfil" />
								</Grid>
								<Grid xs="12" container justify="flex-end">
									<Button color="primary" variant="outlined" type="submit" startIcon={<PersonAdd />}>
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
	const profileType = new ProfileTypeClass();
	const data = await profileType.getAll();
	return { props: { data } };
}
