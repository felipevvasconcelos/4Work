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

export default function Timemanager({ data, handleConfirmDialogOpen, handleConfirmDialogClose }) {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState(data);

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<CardPanel title="Gerenciamento de Horas" subtitle="Gerenciamento de horas lançadas por projetos e parceiros" color="primary"></CardPanel>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const data = await new StatusClass().getAll();
	return { props: { data } };
}
