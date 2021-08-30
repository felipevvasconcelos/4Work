import React, { useContext } from "react";
import clsx from "clsx";
import Link from "next/link";

import { Loading, AppointmentDialog, ListNotifications } from "../../components";
import { makeStyles, useTheme, Drawer, AppBar, CssBaseline, Toolbar, List, ListItem, ListItemIcon, ListItemText, Button, Avatar, IconButton, Hidden, Box, SwipeableDrawer, Divider, CircularProgress, Typography, Grid, Tooltip, Collapse, Badge } from "@material-ui/core";

import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FolderSpecialIcon from "@material-ui/icons/FolderSpecial";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import ListTask from "../TaskList/taskList";
import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { AccessAlarm, AddAlarm, AvTimer, Build, BusinessCenter, CallSplit, Cast, Copyright, Dashboard, DeviceHub, ExpandLess, ExpandMore, LockOpen, Notifications, Settings, Style, SupervisedUserCircle, Timeline, WebAsset } from "@material-ui/icons";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";

import { dataDrawer } from './data';
import { AtuhenticationContext } from '../../Context/AuthenticationContextAPI';
import { PermissionViewContext } from '../../Context/PermissionViewContext';
import { Authentication } from '../../middlewares/AuthenticationRoutes';

import { ControllerNotifyContext } from '../../Context/ControllerNotifyContext';

// //ISSO AQUI SERVE PARA GERAR AS PAGINAS ESTATICAS
// //FAZENDO ASSIM UMA REQUISIÇÃO INSTATANEA
// export async function getStaticPaths(){
//   return{
//       //TODO: Verificar se tem como criar um robo para buildar o sistema toda noite, gerando assim as novas paginas estaticas se existirem
//       paths: [], //PARAMETRO QUE DEVE SER PASSADOS A LISTA DE IDS, A PARTIR DO BANCO (GERADO NO MOMENTO DO BUILD)
//       fallback: 'blocking'
//   }
// }

// //GERA PAGINA ESTATICA DO LADO DO SERVER (IGUAL O BACKEND)
// //FAZER REQUISIÇÕES E UTILIZAR DADOS SENSIVEIS SOMENTE AQUI
// export async function getStaticProps(context) {
//   return {
//     props: {}, //PARAMETRO QUE É ENVIADO PARA O FRONT
//   }
// }

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(1),
	},
	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		//background: 'radial-gradient(circle, rgba(228,13,104,1) 0%, rgba(247,8,69,1) 35%, rgba(18,0,2,1) 100%);' meu estilo
		background: "linear-gradient(90deg, rgba(230, 136, 76,1) 0%, rgba(204, 104, 40,1) 35%, rgba(212, 92, 15,1) 100%)",
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: drawerWidth,
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	drawerContainer: {
		overflow: "auto",
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: "flex-start",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginRight: -drawerWidth,
	},
	app: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	main: {
		flex: 1,
		padding: theme.spacing(6, 4),
		background: "white",
	},
	footer: {
		padding: theme.spacing(2),
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: 0,
	},
	pFooter: {
		display: "flex",
		alignItems: "start",
		justifyContent: "flex-end",
	},
	avatar: {
		marginLeft: "-19px",
		width: "150px",
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	customBadge: {
		backgroundColor: "black",
		color: "white",
	},
}));

export default function Layout(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [session, loading] = useSession();
	const router = useRouter();

	//Funções de estado para alteração da propriedade open dos sidebars
	const { window } = props;
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [openDrawerTask, setOpenDrawerTask] = React.useState(false);
	const [openDrawerTaskMobile, setOpenDrawerTaskMobile] = React.useState(false);
	const [openCollapseListConfig, setOpenCollapseLisConfig] = React.useState(false);
	const [loadingComponent, setLoadingComponent] = React.useState(false);
	const [appoitmentDialog, setAppoitmentDialog] = React.useState(false);
	const [notifications, setNotifications] = React.useState(false);

	const handleLoading = (e) => {
		e != router.pathname && setLoadingComponent(!loadingComponent);
	};
	const handleDrawerToggle = () => {
		setOpenDrawer(!openDrawer);
	};
	const handleAppoitment = () => {
		setAppoitmentDialog(!appoitmentDialog);
	};
	const handleNotifications = () => {
		setNotifications(!notifications);
	};
	const handleDrawerTasksToggle = () => {
		setOpenDrawerTask(!openDrawerTask);
	};
	const handleDrawerTasksMobileToggle = () => {
		setOpenDrawerTaskMobile(!openDrawerTaskMobile);
	};
	const handleClickCollapseLisConfig = () => {
		setOpenCollapseLisConfig(!openCollapseListConfig);
	};

	const container = window !== undefined ? () => window().document.body : undefined;
	const { handleSetUserData, handleSetPermission, permission } = useContext(AtuhenticationContext);
	const { setPermissionsView } = useContext(PermissionViewContext);
	const { SenderNotify } = useContext(ControllerNotifyContext);
	//Validação de Sessão
	React.useEffect(() => {
		if (!(session || loading)) {
			router.push("/auth/signin");
		}
		handleSetUserData(session?.user);
		handleSetPermission(session?.user?.profile);
		setPermissionsView(session?.user?.screenPermission);
	}, [session, loading]);
	if (!session) return <Loading></Loading>;

	//Start Sidebar User
	const drawerTasks = (
		<div>
			<div className={classes.drawerHeader}>
				<Hidden xsDown implementation="css">
					<IconButton onClick={handleDrawerTasksToggle}>{theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
				</Hidden>
				<Hidden smUp implementation="css">
					<IconButton onClick={handleDrawerTasksMobileToggle}>{theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
				</Hidden>
			</div>
			<List>
				<ListItem button>
					<ListItemIcon>
						<PersonIcon />
					</ListItemIcon>
					{session && (
						<Link href={`/user/${session.user._id}`}>
							<ListItemText primary={session.user.name != null ? session.user.name : "Minha Conta"} />
						</Link>
					)}
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<a type="button" onClick={() => signOut()}>
						<ListItemText primary="Sair" />
					</a>
				</ListItem>
			</List>
			<Divider variant="middle" />
		</div>
	);
	//End Sidebar User
	const drawer = (
		<div>
			<Hidden xsDown implementation="css">
				<div className={classes.toolbar} />
			</Hidden>
			<Hidden smUp implementation="css">
				<ListItem>
					<Link href="/">
						<Button>
							<Avatar className={classes.avatar} alt="Logo" variant="square" src="/images/logo.png" />
							{/* <Typography variant="h6" className={styles.h6} noWrap> 4Work </Typography> */}
						</Button>
					</Link>
				</ListItem>
			</Hidden>
			{/* <List> */}
				{/* <Link href="/dashboard">
					<ListItem disabled button onClick={() => handleLoading("/dashboard")}>
						<ListItemIcon>
							<Dashboard />
						</ListItemIcon>
						<ListItemText primary="Dashboard" />
					</ListItem>
				</Link> */}
				{/* <Link href="/task">
					<ListItem disabled button onClick={() => handleLoading("/task")}>
						<ListItemIcon>
							<DynamicFeedIcon />
						</ListItemIcon>
						<ListItemText primary="Tarefas" />
					</ListItem>
				</Link>
				<Link href="/room">
					<ListItem disabled button onClick={() => handleLoading("/room")}>
						<ListItemIcon>
							<Cast />
						</ListItemIcon>
						<ListItemText primary="Quadro" />
					</ListItem>
				</Link> */}
			{/* </List> */}
			<List>
				{
					dataDrawer.map((element) => {
						if(Authentication(element.permissions, permission?.name)){
							if(element.type === 'Divider'){
								return (element.jsx);
							}
							
							if(element.type === 'Acordian'){
								return (
									<ListItem button onClick={handleClickCollapseLisConfig}>
										<ListItemIcon>
											{element.icon}
										</ListItemIcon>
										<ListItemText primary={element.primary} />
										{openCollapseListConfig ? <ExpandLess /> : <ExpandMore />}
									</ListItem>
								);
							}
							
							if(element.type === 'IconLink'){
								return (
									<Link href={element.href}>
										<ListItem disabled={element.disabled ? element.disabled : false} button onClick={() => handleLoading(element.handleLoading)}>
											<ListItemIcon>
												{element.icon}
											</ListItemIcon>
											<ListItemText primary={element.primary} />
										</ListItem>
									</Link>
								);
							}
						}
					})
				}
				<Collapse in={openCollapseListConfig}>
					<List component="div" disablePadding>
						<Link href="/admin/profile">
							<ListItem button className={classes.nested} onClick={() => handleLoading("/admin/profile")}>
								<ListItemIcon>
									<SupervisedUserCircle />
								</ListItemIcon>
								<ListItemText primary="Perfis" />
							</ListItem>
						</Link>
						<Link href="/admin/position">
							<ListItem button className={classes.nested} onClick={() => handleLoading("/admin/position")}>
								<ListItemIcon>
									<DeviceHubIcon />
								</ListItemIcon>
								<ListItemText primary="Cargos" />
							</ListItem>
						</Link>
						<Link href="/admin/screen">
							<ListItem button className={classes.nested} onClick={() => handleLoading("/admin/screen")}>
								<ListItemIcon>
									<WebAsset />
								</ListItemIcon>
								<ListItemText primary="Telas" />
							</ListItem>
						</Link>
						<Link href="/admin/permission">
							<ListItem button className={classes.nested} onClick={() => handleLoading("/admin/permission")}>
								<ListItemIcon>
									<LockOpen />
								</ListItemIcon>
								<ListItemText primary="Permissões" />
							</ListItem>
						</Link>
						<Link href="/admin/typeCall">
							<ListItem button className={classes.nested} onClick={() => handleLoading("/admin/typeCall")}>
								<ListItemIcon>
									<CallSplit />
								</ListItemIcon>
								<ListItemText primary="Tipos de Chamado" />
							</ListItem>
						</Link>
						<Link href="/admin/status">
							<ListItem button className={classes.nested} onClick={() => handleLoading("/admin/status")}>
								<ListItemIcon>
									<Style />
								</ListItemIcon>
								<ListItemText primary="Status" />
							</ListItem>
						</Link>
					</List>
				</Collapse>
			</List>
		</div>
	);

	return (
		<div className={classes.root}>
			{loadingComponent && <Loading></Loading>}
			<CssBaseline />

			{/* Start Header */}
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: openDrawerTask,
				})}
			>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className={classes.menuButton}>
						<MenuIcon />
					</IconButton>
					<Hidden xsDown implementation="css">
						<Link href="/">
							<Button>
								<Avatar className={classes.avatar} alt="Logo" variant="square" src="/images/logoWhite.png" />
								{/* <Typography variant="h6" className={styles.h6} noWrap> 4Work </Typography> */}
							</Button>
						</Link>
					</Hidden>
					<div style={{ width: "100%" }}>
						<Box display="flex" flexDirection="row-reverse">
							<Hidden xsDown implementation="css">
								<Tooltip title={"Notificações"}>
									<IconButton onClick={handleNotifications} style={{ color: "white" }}>
										<Badge badgeContent={4} classes={{ badge: classes.customBadge }} overlap="circle">
											<Notifications />
										</Badge>
									</IconButton>
								</Tooltip>
								<Tooltip title={"Iniciar Apontamento"}>
									<IconButton onClick={handleAppoitment} style={{ color: "white" }}>
										<AddAlarm />
									</IconButton>
								</Tooltip>
								<IconButton onClick={handleDrawerTasksToggle} style={{ color: "white" }}>
									<AccountCircle />
								</IconButton>
							</Hidden>
							<Hidden smUp implementation="css">
								<Tooltip title={"Notificações"}>
									<IconButton onClick={handleNotifications} style={{ color: "white" }}>
										<Badge badgeContent={4} color="error">
											<Notifications />
										</Badge>
									</IconButton>
								</Tooltip>
								<Tooltip title={"Iniciar Apontamento"}>
									<IconButton onClick={handleAppoitment} style={{ color: "white" }}>
										<AddAlarm />
									</IconButton>
								</Tooltip>
								<IconButton onClick={handleDrawerTasksMobileToggle} style={{ color: "white" }}>
									<AccountCircle />
								</IconButton>
							</Hidden>
							{/* <AccountCircle onChangeActive=""  ></AccountCircle> */}
						</Box>
					</div>
				</Toolbar>
			</AppBar>
			{/* End Header */}
			{/* Star Sidebar */}
			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* Sidebars para mobile */}
				<Hidden smUp implementation="css">
					<SwipeableDrawer container={container} variant="temporary" anchor={theme.direction === "rtl" ? "right" : "left"} open={openDrawer} onOpen={handleDrawerToggle} onClose={handleDrawerToggle} classes={{ paper: classes.drawerPaper }} ModalProps={{ keepMounted: true }}>
						{drawer}
					</SwipeableDrawer>
					<SwipeableDrawer open={openDrawerTaskMobile} onClose={handleDrawerTasksMobileToggle} onOpen={handleDrawerTasksMobileToggle} variant="temporary" anchor={"right"} classes={{ paper: classes.drawerPaper }} ModalProps={{ keepMounted: true }}>
						{drawerTasks}
					</SwipeableDrawer>
				</Hidden>
				{/* EndMobile */}
				{/* Sidebars para Web */}
				<Hidden xsDown implementation="css">
					<Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
						{drawer}
					</Drawer>
					<Drawer className={classes.drawer} classes={{ paper: classes.drawerPaper }} variant="persistent" anchor={"right"} open={openDrawerTask} onClose={handleDrawerTasksToggle}>
						{drawerTasks}
					</Drawer>
				</Hidden>
				{/* EndWeb */}
			</nav>
			{/* End Sidebar */}

			<AppointmentDialog open={appoitmentDialog} session={session} closeFunction={handleAppoitment}></AppointmentDialog>
			<ListNotifications open={notifications} closeFunction={handleNotifications} />

			<div className={classes.app}>
				<main
					className={clsx(classes.main, {
						[classes.contentShift]: openDrawerTask,
					})}
				>
					<div className={classes.drawerHeader} />
					{/* Start Body */}
					{props.children}
					{/* End Body */}
				</main>
				<footer className={classes.footer}>
					<Grid alignItems="center" alignContent="center">
						<Typography className={classes.pFooter}>
							<Copyright style={{ marginRight: "2px" }} />
							<Typography style={{ marginRight: "2px" }}>Desenvolvido pela </Typography>
							<Link href="https://www.linkedin.com/company/koodetech/about/"> Koode</Link>
						</Typography>
					</Grid>
				</footer>
			</div>
		</div>
	);
}
