import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import { Provider } from "next-auth/client";
import { Slide } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { ConfirmDialog } from "../components";

//import '../styles/global.css';

export default function MyApp(props) {
	const { Component, pageProps } = props;
	const [confirmDialog, setConfirmDialog] = useState({
		openDialog: false,
		dialogTitle: "",
		dialogMessage: "",
		fncDialog: function () {},
		paramsFncDialog: {}, //OBJECT PARA RECEBER MAIS DE UM PARAMETRO SE NECESSÁRIO
	});

	const handleConfirmDialogOpen = (title, message, fncConfirm, paramsFnc) => {
		setConfirmDialog({ openDialog: true, dialogTitle: title, dialogMessage: message, fncDialog: fncConfirm, paramsFncDialog: paramsFnc });
	};

	const handleConfirmDialogClose = () => {
		setConfirmDialog({ openDialog: false, dialogTitle: "", dialogMessage: "", fncDialog: function () {}, paramsFncDialog: {} });
	};

	useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>KeyWork</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />

				{/* Provedor de sessão */}
				<Provider session={pageProps.session}>
					<SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "right", vertical: "top", autoHideDuration: 2500 }} TransitionComponent={Slide}>
						<Component {...pageProps} handleConfirmDialogOpen={handleConfirmDialogOpen} handleConfirmDialogClose={handleConfirmDialogClose} />
					</SnackbarProvider>
					{/* Diálogo de confirmação padrão, disponibilizado em todas telas */}
					<ConfirmDialog confirmDialog={confirmDialog} handleConfirmDialogClose={handleConfirmDialogClose}></ConfirmDialog>
				</Provider>
			</ThemeProvider>
		</React.Fragment>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
