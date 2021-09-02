import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { CardPanel, Layout, Loading, siteTittle, TextFieldMask } from "../../components";
import { useRouter } from "next/router";
import { Switch, Card, Collapse, Button, CardActions, CardContent, CardMedia, CardActionArea, Typography, TextField, Avatar, Grid, makeStyles, InputLabel, FormControl, MenuItem, Select, Container } from "@material-ui/core";
import { CompanyClass, ProfileTypeClass, UserClass, PositionClass } from "../../classes";
import { FormControlLabel } from "@material-ui/core";
import { Person, Save, ViewList } from "@material-ui/icons";
import { useSnackbar } from "notistack";

import { AtuhenticationContext } from "../../Context/AuthenticationContextAPI";
import { PermissionViewContext } from "../../Context/PermissionViewContext";
import { Authentication } from "../../middlewares/AuthenticationRoutes";

const validatePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
const CustomPersonIcon = function name() {
	return (
		<Grid container xs={12} justify="center">
			<Person style={{ fontSize: "300px" }}></Person>
		</Grid>
	);
};

function currencyFormatterBr(value) {
	if (!Number(value)) return "";

	const amount = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value / 100);

	return `${amount}`;
}

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "30px",
		flexGrow: 1,
	},
	formControl: {
		// margin: theme.spacing(1),
		minWidth: 120,
	},
	padding: {
		padding: "0px",
		width: "100%",
	},
	marginBtn: {
		padding: "5px",
	},
	card: {
		marginTop: "-10px",
		minWidth: 300,
		maxWidth: 500,
	},
	cardImage: {
		width: "100%",
		height: 300,
	},
	avatar: {
		marginTop: "30px",
		width: "250px",
		height: "250px",
	},
}));

export default function UserById({ data, profiles, companies, positions }) {
	const route = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const [imgSrc, setImgSrc] = useState(data.logo.image);
	const [loading, setLoading] = useState(false);
	const [stateUser, setStateUser] = useState(data);
	const oldPass = stateUser.password;
	const [confirmPass, setConfirmPass] = useState(route.query.id == "new" ? "" : stateUser.password);
	const [confirmPassError, setConfirmPassError] = useState(false);
	const [confirmPassErrorText, setConfirmPassErrorText] = useState("");
	const [openCollapseImage, setOpenCollapseImage] = useState(false);

	const { filterPermissionByScreen } = useContext(PermissionViewContext);
	const { permission } = useContext(AtuhenticationContext);

	useEffect(() => {
		const permissionsScren = filterPermissionByScreen("60bc30b6f582fe96a40b729f");
		if (!Authentication(permissionsScren, permission?.name)) {
			return route.push("/");
		}
	}, []);

	const handleClickCollapseImage = () => {
		setOpenCollapseImage(!openCollapseImage);
	};
	const handleChangeUser = (e) => {
		if (e.target.name == "password") {
			setConfirmPassError(true);
			setConfirmPassErrorText("Senhas não coincidem");
		}

		if (e.target.name.includes("active")) {
			setStateUser({ ...stateUser, [e.target.name]: e.target.checked });
		} else {
			setStateUser({ ...stateUser, [e.target.name]: e.target.value });
		}
	};
	const handleChangeUserLogo = (e) => {
		var reader = new FileReader();
		reader.onload = function (event) {
			setStateUser({ ...stateUser, logo: { ...stateUser.logo, image: event.target.result, name: e.target.files[0].name } });
			setImgSrc(event.target.result);
		};
		reader.readAsDataURL(e.target.files[0]);
	};
	const handleConfirmPass = (e) => {
		if (stateUser.password != e.target.value) {
			setConfirmPassError(true);
			setConfirmPassErrorText("Senhas não coincidem");
		} else {
			setConfirmPassError(false);
			setConfirmPassErrorText("");
		}
		setConfirmPass(e.target.value);
	};
	const handleSubmit = async (e) => {
		e.preventDefault(e);
		try {
			if (!(oldPass != "" && oldPass == stateUser.password && oldPass == confirmPass)) {
				if (confirmPassError || !validatePass.test(stateUser.password)) {
					enqueueSnackbar("Senha inválida", { variant: "error" });
					return;
				}
			}

			setLoading(true);
			var res;

			if (route.query.id === "new") {
				res = await fetch("/api/user", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(stateUser),
				});
			} else {
				res = await fetch(`/api/user/${route.query.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(stateUser),
				});
			}

			if (res.status === 200) {
				enqueueSnackbar("Usuário Salvo", { variant: "success" });
				route.push("/user");
			} else {
				var body = await res.json();

				if (body.error.hasOwnProperty("code")) {
					if (body.error.code == 11000) {
						enqueueSnackbar("Já existe um usuário com este e-mail", { variant: "error" });
					} else {
						enqueueSnackbar("Erro ao salvar Usuário, contate um administrador do sistema", { variant: "error" });
					}
				} else {
					enqueueSnackbar("Erro salvar Usuário, contate um administrador do sistema", { variant: "error" });
				}

				setLoading(false);
			}
		} catch (e) {
			enqueueSnackbar(e, { variant: "error" });
			setLoading(false);
		}
	};

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<div className={classes.root}>
				<CardPanel title={route.query.id != "new" ? "Edição de Usuário" : "Cadastro de Usuário"} subtitle="" color="primary">
					<Container maxWidth="xl">
						<Grid container spacing={0} xs={12} direction="row">
							<Grid item xs={12} md={6} className={classes.root}>
								<Grid container justify="center" xs={12} spacing={1}>
									<Card className={classes.card}>
										<CardActionArea>
											<CardMedia className={classes.cardImage} title={stateUser.name}>
												{route.query.id == "new" && imgSrc == "" ? (
													<CustomPersonIcon></CustomPersonIcon>
												) : imgSrc != "" ? (
													<Grid container justify="center" direction="row" xs={12}>
														<Avatar className={classes.avatar} src={imgSrc} alt="Picture of the author" width={500} height={300} />
													</Grid>
												) : (
													<CustomPersonIcon></CustomPersonIcon>
												)}
											</CardMedia>
											<CardContent>
												<Typography gutterBottom variant="h5" component="h2">
													{stateUser.name}
												</Typography>
											</CardContent>
										</CardActionArea>
										<CardActions>
											<Grid container justify="flex-start" direction="row" xs={12}>
												<Grid container justify="flex-start" xs={6}>
													<Button size="small" color="primary" disabled={route.query.id == "new"} onClick={() => route.push(`/user?idCompany=${route.query.id}`)}>
														Chamados
													</Button>
												</Grid>
												<Grid container justify="flex-end" xs={6}>
													<Button size="small" color="secondary" onClick={handleClickCollapseImage}>
														Trocar Imagem
													</Button>
												</Grid>
												<Grid container justify="flex-end" direction="row" xs={12}>
													<Collapse in={openCollapseImage}>
														<Grid item xs={12} container alignContent="flex-end">
															<FormControl fullWidth margin="normal">
																<Button color="secondary" size="small" component="label">
																	Selecionar Arquivo
																	<input type="file" hidden onChange={handleChangeUserLogo} />
																</Button>
															</FormControl>
														</Grid>
													</Collapse>
												</Grid>
											</Grid>
										</CardActions>
									</Card>
								</Grid>
							</Grid>
							<Grid xs={12} md={6} direction="row" className={classes.padding}>
								<form onSubmit={handleSubmit}>
									<Grid xs="12" container direction="column">
										<Grid container direction="row" alignItems="flex-end" xs={12}>
											<Grid item xs={10} direction="row">
												<TextField required id="name" name="name" margin="normal" value={stateUser.name} fullWidth label="Nome do Usuário" onChange={handleChangeUser} />
											</Grid>
											<Grid item xs={2} direction="row">
												<FormControlLabel
													control={
														<Switch
															name="active"
															color="primary"
															onChange={(e) => {
																handleChangeUser(e);
															}}
															checked={stateUser.active}
															value={stateUser.active}
														/>
													}
													label="Ativo"
												/>
											</Grid>
											<Grid item xs={12} direction="row" style={{ marginBottom: "10px" }}>
												<TextField required id="email" name="email" margin="normal" type="email" value={stateUser.email} fullWidth label="E-mail" onChange={handleChangeUser} />
											</Grid>
										</Grid>
										<Grid container xs={12} direction="row" spacing={1}>
											<Grid item xs={12} sm={6} direction="row">
												<FormControl required fullWidth className={classes.formControl}>
													<InputLabel>Empresa</InputLabel>
													<Select id="company" name="company" value={stateUser.company} fullWidth onChange={handleChangeUser}>
														{companies.map((c) => (
															<MenuItem value={c._id}>{c.name}</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12} sm={6} direction="row">
												<FormControl required fullWidth className={classes.formControl}>
													<InputLabel>Perfil</InputLabel>
													<Select id="profile" name="profile" value={stateUser.profile} fullWidth onChange={handleChangeUser}>
														{profiles.map((c) => (
															<MenuItem value={c._id}>{c.name}</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>
										</Grid>
										<Grid container xs={12} direction="row" spacing={1} alignItems="flex-end">
											<Grid item xs={12} sm={6}>
												<FormControl required fullWidth className={classes.formControl}>
													<InputLabel>Cargo</InputLabel>
													<Select id="position" name="position" value={stateUser.position} fullWidth onChange={handleChangeUser}>
														{positions.map((c) => (
															<MenuItem value={c._id}>{c.name}</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12} sm={6} style={{ marginBottom: "-8px" }}>
												<TextFieldMask id="priceHour" name="priceHour" margin="normal" isNumericString={true} onChange={handleChangeUser} value={stateUser.priceHour} fullWidth label="Preço da Hora" format={currencyFormatterBr} />
											</Grid>
										</Grid>
										<Grid container xs={12} direction="row" spacing={1}>
											<Grid item xs={12} sm={6} direction="row">
												<TextField required id="password" name="password" type="password" margin="normal" value={stateUser.password} fullWidth label="Senha" onChange={handleChangeUser} helperText="Senha deve conter mínimo de oito caracteres, pelo menos uma letra maiúscula, uma letra minúscula e um número" />
											</Grid>
											<Grid item xs={12} sm={6} direction="row">
												<TextField required error={confirmPassError} helperText={confirmPassErrorText} id="confirmPassword" name="confirmPassword" type="password" margin="normal" fullWidth label="Confirme a Senha" value={confirmPass} onChange={handleConfirmPass} />
											</Grid>
										</Grid>
									</Grid>
									{/* BOTÕES */}
									<Grid container xs="12" justify="flex-end" className={classes.marginBtn}>
										<Button color="secondary" margin="normal" startIcon={<ViewList />} onClick={(e) => route.push("/user")}>
											Voltar para Lista
										</Button>
										<Button color="primary" variant="outlined" type="submit" startIcon={<Save />}>
											Salvar
										</Button>
									</Grid>
								</form>
							</Grid>
						</Grid>
					</Container>
				</CardPanel>
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	try {
		const profiles = await new ProfileTypeClass().getAll();
		const companies = await new CompanyClass().getAll();
		const positions = await new PositionClass().getAll();

		if (context.query.id == "new") {
			return {
				props: {
					data: {
						name: "",
						email: "",
						active: true,
						logo: {
							name: "",
							image: "",
						},
						password: "",
						company: "",
						profile: "",
						position: "",
						priceHour: "",
					},
					profiles,
					companies,
					positions,
				},
			};
		} else {
			const data = await new UserClass().get(context.query.id);
			return { props: { data, profiles, companies, positions } };
		}
	} catch (error) {
		return { notFound: true };
	}
}
