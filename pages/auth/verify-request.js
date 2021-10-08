import Image from "next/image";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	main: {
		display: "flex",
		alignContent: "center",
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	section1: {
		margin: theme.spacing(5),
		width: "100%",
	},
	title: {
		fontFamily: "Calibri",
		color: "#6A6A6A",
	},
}));

function VerifyRequest(params) {
	const classes = useStyles();

	return (
		<Grid className={classes.main} container component="main" alignContent="center" justify="center">
			<Grid item>
				<Container maxWidth="xl" className={classes.paper}>
					<Image alt="Logo" src="/images/logo.png" width={500} height={145} />
					<Grid container justify="center" className={classes.section1}>
						<Grid item xs={12} md={9}>
							<Typography className={classes.title} align="center" variant="h3">
								Verifique seu e-mail!
							</Typography>
							<Typography className={classes.title} align="center" variant="subtitle1">
								Foi enviado um link mágico para seu e-mail, conclua o acesso ao KeyWork acessando o e-mail enviado.
							</Typography>
						</Grid>
					</Grid>
				</Container>
			</Grid>
		</Grid>
	);
}

export default VerifyRequest;
