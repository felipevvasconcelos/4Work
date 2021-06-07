import { Collapse, Card, FormControl, CardActionArea, CardMedia, Typography, Container, CardActions, Grid, CardContent, makeStyles, TextField, Button } from "@material-ui/core";
import { CardPanel, Layout, Loading, siteTittle, TextFieldMask } from "../../components";
import { Business, Save, ViewList } from "@material-ui/icons";
import fetchJsonp from "fetch-jsonp";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { CompanyClass } from "../../classes";
import React from "react";
import { FormControlLabel } from "@material-ui/core";
import { Switch } from "@material-ui/core";
import { Avatar } from "@material-ui/core";

const validacnpj = /^[0-9]{14}$/;

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "30px",
	},
	padding: {
		padding: "0px",
		width: "100%",
	},
	marginBtn: {
		padding: "5px",
	},
	card: {
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

export default function CompanyById({ data }) {
	const { enqueueSnackbar } = useSnackbar();
	const route = useRouter();
	const classes = useStyles();
	const [stateCompany, setStateCompany] = useState(data);
	const [loading, setLoading] = useState(true);
	const [openCollapseImage, setOpenCollapseImage] = useState(false);
	const [imgSrc, setImgSrc] = useState(data.logo.image);

	const CustomBusinessIcon = function name() {
		return (
			<Grid container xs={12} justify="center">
				<Business style={{ fontSize: "300px" }}></Business>
			</Grid>
		);
	};
	const handleClickCollapseImage = () => {
		setOpenCollapseImage(!openCollapseImage);
	};
	const handleChangeCompany = (e) => {
		if (e.target.name.includes("active")) {
			setStateCompany({ ...stateCompany, [e.target.name]: e.target.checked });
		} else {
			setStateCompany({ ...stateCompany, [e.target.name]: e.target.value });
		}
	};
	const handleChangeCompanyAddress = (e) => {
		setStateCompany({ ...stateCompany, address: { ...stateCompany.address, [e.target.name]: e.target.value } });
	};
	const handleChangeCompanyLogo = (e) => {
		var reader = new FileReader();
		reader.onload = function (event) {
			setStateCompany({ ...stateCompany, logo: { ...stateCompany.logo, image: event.target.result, name: e.target.files[0].name } });
			setImgSrc(event.target.result);
		};
		reader.readAsDataURL(e.target.files[0]);
	};
	const buscaDadosEmpresa = (e) => {
		try {
			const cnpj = e.target.value.replace(/\D/g, "");

			if (validacnpj.test(cnpj)) {
				fetchJsonp(`https://receitaws.com.br/v1/cnpj/${cnpj}`).then((response) =>
					response.json().then((data) => {
						const dadosEmpresa = data;
						setStateCompany({
							...stateCompany,
							name: dadosEmpresa.fantasia,
							companyName: dadosEmpresa.nome,
							address: {
								address: dadosEmpresa.logradouro,
								number: dadosEmpresa.numero,
								postalCode: dadosEmpresa.cep,
								complement: dadosEmpresa.complemento,
								district: dadosEmpresa.bairro,
								city: dadosEmpresa.municipio,
								state: dadosEmpresa.uf,
							},
						});
					})
				);
			}
		} catch (error) {
			setLoading(false);
			enqueueSnackbar(e.message, { variant: "error" });
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault(e);
		try {
			setLoading(true);
			var res;

			if (route.query.id === "new") {
				res = await fetch("/api/company", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(stateCompany),
				});
			} else {
				res = await fetch(`/api/company/${route.query.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(stateCompany),
				});
			}

			if (res.status === 200) {
				enqueueSnackbar("Empresa Salva", { variant: "success" });
				route.push("/company");
			} else {
				var body = await res.json();

				if (body.error.hasOwnProperty("code")) {
					if (body.error.code == 11000) {
						enqueueSnackbar("Já existe uma empresa com o mesmo CNPJ", { variant: "error" });
					} else {
						enqueueSnackbar("Erro ao criar Empresa, contate um administrador do sistema", { variant: "error" });
					}
				} else {
					enqueueSnackbar("Erro ao criar Empresa, contate um administrador do sistema", { variant: "error" });
				}

				setLoading(false);
			}
		} catch (e) {
			enqueueSnackbar(e, { variant: "error" });
			setLoading(false);
		}
	};

	//carrega previamente a listagem
	useEffect(() => {
		setLoading(false);
		route.prefetch("/company");
	}, []);

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			{loading && <Loading></Loading>}
			<CardPanel title={route.query.id == "new" ? "Cadastro de Empresa" : "Edição de Empresa"} subtitle="" color="primary">
				<Container maxWidth="xl">
					<Grid container spacing={0} xs={12} direction="row">
						<Grid item xs={12} md={6} className={classes.root}>
							<Grid container justify="center" xs={12} spacing={1}>
								<Card className={classes.card}>
									<CardActionArea>
										<CardMedia className={classes.cardImage} title={stateCompany.name}>
											{route.query.id == "new" && imgSrc == "" ? (
												<CustomBusinessIcon></CustomBusinessIcon>
											) : imgSrc != "" ? (
												<Grid container justify="center" direction="row" xs={12}>
													<Avatar className={classes.avatar} src={imgSrc} alt="Picture of the author" width={500} height={300} />
												</Grid>
											) : (
												<CustomBusinessIcon></CustomBusinessIcon>
											)}
										</CardMedia>
										<CardContent>
											<Typography gutterBottom variant="h5" component="h2">
												{stateCompany.name}
											</Typography>
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Grid container justify="flex-start" direction="row" xs={12}>
											<Grid container justify="flex-start" xs={6}>
												<Button size="small" color="primary" disabled={route.query.id == "new"} onClick={() => route.push(`/user?idCompany=${route.query.id}`)}>
													Usuários
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
																<input type="file" hidden onChange={handleChangeCompanyLogo} />
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
									<Grid container xs={12} direction="row" alignItems="flex-end" spacing={1}>
										<Grid item xs={10} direction="row">
											<TextFieldMask required id="document" name="document" margin="normal" value={stateCompany.document} onChange={handleChangeCompany} onBlur={buscaDadosEmpresa} fullWidth label="CNPJ" format="##.###.###/####-##" disabled={route.query.id != "new"} />
										</Grid>
										<Grid item xs={2} direction="row">
											<FormControlLabel
												control={
													<Switch
														name="active"
														color="primary"
														onChange={(e) => {
															handleChangeCompany(e);
														}}
														checked={stateCompany.active}
														value={stateCompany.active}
													/>
												}
												label="Ativo"
											/>
										</Grid>
									</Grid>
									<TextField required id="name" name="name" margin="normal" value={stateCompany.name} onChange={handleChangeCompany} fullWidth label="Nome Fantasia" />
									<TextField required id="companyName" name="companyName" margin="normal" value={stateCompany.companyName} onChange={handleChangeCompany} fullWidth label="Razão Social" />
									<Grid item xs={12}>
										<h3 style={{ marginBottom: "-10px" }}>Endereço</h3>
									</Grid>
									<Grid container xs={12} sm={8} md={6} direction="row">
										<TextFieldMask required id="postalCode" name="postalCode" margin="normal" value={stateCompany.address.postalCode} onChange={handleChangeCompanyAddress} fullWidth label="CEP" format="#####-###" />
									</Grid>
									<Grid container xs={12} direction="row" spacing={1}>
										<Grid item xs={10} direction="row">
											<TextField required id="address" name="address" margin="normal" value={stateCompany.address.address} onChange={handleChangeCompanyAddress} fullWidth label="Logradouro" />
										</Grid>
										<Grid item xs={2} direction="row">
											<TextField id="number" name="number" margin="normal" value={stateCompany.address.number} onChange={handleChangeCompanyAddress} fullWidth label="Nº" />
										</Grid>
									</Grid>
									<Grid container xs={12} direction="row" spacing={1}>
										<Grid item xs={6} md={4}>
											<TextField id="complement" name="complement" margin="normal" value={stateCompany.address.complement} onChange={handleChangeCompanyAddress} fullWidth label="Complemento" />
										</Grid>
										<Grid item xs={6} md={4}>
											<TextField id="district" name="district" margin="normal" value={stateCompany.address.district} onChange={handleChangeCompanyAddress} fullWidth label="Bairro" />
										</Grid>
									</Grid>
									<Grid container xs={12} direction="row" spacing={1}>
										<Grid item xs={10} md={4} direction="row">
											<TextField id="city" name="city" margin="normal" value={stateCompany.address.city} onChange={handleChangeCompanyAddress} fullWidth label="Cidade" />
										</Grid>
										<Grid item xs={2} md={2} direction="row">
											<TextField id="state" name="state" margin="normal" value={stateCompany.address.state} onChange={handleChangeCompanyAddress} fullWidth label="UF" />
										</Grid>
									</Grid>
								</Grid>
								{/* BOTÕES */}
								<Grid container xs="12" justify="flex-end" className={classes.marginBtn}>
									<Button color="secondary" margin="normal" startIcon={<ViewList />} onClick={(e) => route.push("/company")}>
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
		</Layout>
	);
}

export async function getServerSideProps(context) {
	try {
		if (context.query.id == "new") {
			return {
				props: {
					data: {
						name: "",
						companyName: "",
						document: "",
						logo: {
							name: "",
							image: "",
						},
						slas: [],
						address: {
							address: "",
							number: "",
							postalCode: "",
							district: "",
							complement: "",
							city: "",
							state: "",
						},
						active: true,
					},
				},
			};
		} else {
			const data = await new CompanyClass().get(context.query.id);
			return { props: { data } };
		}
	} catch (error) {
		return { notFound: true };
	}
}
