import { Button, Checkbox, Container, Divider, FormControlLabel, Grid, IconButton, TextField, Tooltip, Typography } from "@material-ui/core";
import { csrfToken, getSession, providers, signIn } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faFacebook, faGoogle, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	form: {
		//width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	divForm: {
		//width: "100%",
		display: "flex",
		marginBottom: theme.spacing(-4),
	},
	section1: {
		margin: theme.spacing(0, 2),
		width: "100%",
	},
	section2: {
		width: "100%",
	},

	btnFacebook: {
		margin: theme.spacing(3, 0, 2),
		color: "#4267B2",
		borderColor: "#4267B2",
		"&:hover": {
			color: "white",
			background: "#4267B2",
		},
	},
	btnGoogle: {
		margin: theme.spacing(3, 0, 2),
		color: "#4285F4",
		borderColor: "#4285F4",
		"&:hover": {
			color: "white",
			background: "#4285F4",
		},
	},
	btnApple: {
		margin: theme.spacing(3, 0, 2),
		color: "black",
		borderColor: "black",
		"&:hover": {
			color: "white",
			background: "black",
		},
	},
	btnDefault: {
		margin: theme.spacing(3, 0, 2),
		color: "rgba(51,101,82,1)",
		borderColor: "rgba(51,101,82,1)",
		"&:hover": {
			color: "white",
			background: "rgba(51,101,82,1)",
		},
	},
	btnAzure: {
		margin: theme.spacing(3, 0, 2),
		color: "gray",
		borderColor: "gray",
		"&:hover": {
			color: "white",
			borderColor: "gray",
			background: "gray",
		},
	},
}));

export default function SignIn({ providers, csrfToken }) {
	const classes = useStyles();

	return (
		<Grid container component="main">
			<Container maxWidth="xs" className={classes.paper}>
				<Image alt="Logo" src="/images/logo.png" width={350} height={100} />

				<div className={classes.section1}>
					<form className={classes.form} noValidate action="/api/auth/callback/credentials" method="POST">
						<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
						<TextField variant="outlined" margin="normal" required fullWidth label="E-mail" name="username" autoComplete="email" autoFocus />
						<TextField variant="outlined" margin="normal" required fullWidth name="password" label="Senha" type="password" autoComplete="current-password" />
						<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Lembrar-me" />
						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
							Entrar
						</Button>
					</form>
				</div>

				<hr style={{ display: "flex", width: "90%" }} />

				<Grid container justify="center" className={classes.section2}>
					{Object.values(providers).map((provider) => {
						if (provider.name === "Credenciais") {
							return;
						}

						var colorButton = "";
						var icon = "";

						switch (provider.name) {
							case "Facebook":
								colorButton = classes.btnFacebook;
								icon = <FontAwesomeIcon icon={faFacebook} />;
								break;
							case "Google":
								colorButton = classes.btnGoogle;
								icon = <FontAwesomeIcon icon={faGoogle} />;
								break;
							case "Azure Microsoft":
								colorButton = classes.btnAzure;
								icon = <FontAwesomeIcon icon={faWindows} />;
								break;
							case "Apple":
								colorButton = classes.btnApple;
								icon = <FontAwesomeIcon icon={faApple} />;
								break;
							default:
								icon = <FontAwesomeIcon icon={faEnvelope} />;
								colorButton = classes.btnDefault;
								break;
						}

						return (
							<div key={provider.name} className={classes.divForm}>
								<Tooltip title={`Entrar com ${provider.name}`}>
									<IconButton onClick={() => signIn(provider.id)} type="submit" variant="outlined" className={colorButton}>
										{icon}
									</IconButton>
								</Tooltip>
							</div>
						);
					})}
				</Grid>
			</Container>
		</Grid>
	);
}

SignIn.getInitialProps = async (context) => {
	const { req, res } = context;
	const session = await getSession({ req });

	if (session && res && session.accessToken) {
		res.writeHead(302, {
			Location: "/",
		});
		res.end();
		return;
	}

	return {
		session: undefined,
		providers: await providers(context),
		csrfToken: await csrfToken(context),
	};
};
