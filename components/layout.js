import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Drawer, AppBar, CssBaseline, Toolbar, List, ListItem, ListItemIcon, ListItemText, Button, Avatar, IconButton, Hidden, Box, SwipeableDrawer, Divider, CircularProgress } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Link from 'next/link';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import ListTask from './TaskList/taskList'
import { signIn, signOut, useSession } from 'next-auth/client'
import {useRouter} from 'next/router';

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
export const siteTittle = "4work";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    //background: 'radial-gradient(circle, rgba(228,13,104,1) 0%, rgba(247,8,69,1) 35%, rgba(18,0,2,1) 100%);' meu estilo
    background: 'linear-gradient(90deg, rgba(51,101,82,1) 0%, rgba(32,82,62,1) 35%, rgba(13,64,45,1) 100%)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: theme.spacing(6, 4),
    background: 'white',
  },
  footer: {
    padding: theme.spacing(2),
    background: 'white',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

export default function Layout(props) {
  
  const classes = useStyles();
  const theme = useTheme();
  const [ session, loading ] = useSession()
  const router = useRouter();
  
  //Funções de estado para alteração da propriedade open dos sidebars
  const { window } = props;
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openDrawerTask, setOpenDrawerTask] = React.useState(false);
  const [openDrawerTaskMobile, setOpenDrawerTaskMobile] = React.useState(false);
  const handleDrawerToggle = () => { setOpenDrawer(!openDrawer); };
  const handleDrawerTasksToggle = () => { setOpenDrawerTask(!openDrawerTask); };
  const handleDrawerTasksMobileToggle = () => { setOpenDrawerTaskMobile(!openDrawerTaskMobile); };
  const container = window !== undefined ? () => window().document.body : undefined;

  //Start Sidebar User
  const drawerTasks = (
    <div>
      <div className={classes.drawerHeader}>
        <Hidden xsDown implementation="css">
          <IconButton onClick={handleDrawerTasksToggle}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Hidden>
        <Hidden smUp implementation="css">
          <IconButton onClick={handleDrawerTasksMobileToggle}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Hidden>
      </div>
      <List>
        <ListItem button>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <Link href="/user/Felipe"><ListItemText primary="Minha Conta" /></Link>
        </ListItem>
        <ListItem button>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <Link href="/user"><ListItemText primary="Sair" /></Link>
        </ListItem>
      </List>
      <Divider variant="middle" />
      {/* Lista rapida de tarefas */}
      <ListTask></ListTask>

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
              <Avatar alt="Logo" variant="square" src="/images/logo.png"  />
              {/* <Typography variant="h6" className={styles.h6} noWrap> 4Work </Typography> */}
            </Button>
          </Link>
        </ListItem>
      </Hidden>
      <List>
          <ListItem button>
            <ListItemIcon> <AssignmentIcon /> </ListItemIcon>
            <Link href="/call"><ListItemText primary="Chamados" /></Link>
          </ListItem>
          <ListItem button>
            <ListItemIcon> <FolderSpecialIcon /> </ListItemIcon>
            <Link href="/improvement"><ListItemText primary="Melhorias" /></Link>
          </ListItem>
          <ListItem button>
            <ListItemIcon> <DynamicFeedIcon /> </ListItemIcon>
            <Link href="/task"><ListItemText primary="Tarefas" /></Link>
          </ListItem>
      </List>
      <Divider variant="middle" />
      <List>
        <ListItem button>
          <ListItemIcon> <GroupIcon /> </ListItemIcon>
          <Link href="/user"><ListItemText primary="Usuários" /></Link>
        </ListItem>
        <ListItem button>
          <ListItemIcon> <LocationCityIcon /> </ListItemIcon>
          <Link href="/company"><ListItemText primary="Empresas" /></Link>
        </ListItem>
      </List>
    </div>
  );

  //VALIDAÇÃO DE SESSÃO
  React.useEffect(() => { if (!(session || loading)) { router.push('/login') } }, [session, loading]);
  if (!session) return (<CircularProgress></CircularProgress>)

  return(
    <div className={classes.root}>
      <CssBaseline />
      
      {/* Start Header */}
      <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: openDrawerTask, })}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className={classes.menuButton} ><MenuIcon /></IconButton>
          <Hidden xsDown implementation="css">
            <Link href="/">
              <Button>
                <Avatar alt="Logo" variant="square" src="/images/logo.png"  />
                {/* <Typography variant="h6" className={styles.h6} noWrap> 4Work </Typography> */}
              </Button>
            </Link>
          </Hidden>
          <div style={{ width: '100%' }}>
            <Box display="flex" flexDirection="row-reverse">
              <Hidden xsDown implementation="css">
                <IconButton onClick={handleDrawerTasksToggle} style={{color: 'white'}} ><AccountCircle /></IconButton>
              </Hidden>
              <Hidden smUp implementation="css">
                <IconButton onClick={handleDrawerTasksMobileToggle}><AccountCircle /></IconButton>
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
          <SwipeableDrawer container={container} variant="temporary" anchor={theme.direction === 'rtl' ? 'right' : 'left'} open={openDrawer} onOpen={handleDrawerToggle} onClose={handleDrawerToggle} classes={{ paper: classes.drawerPaper, }} ModalProps={{ keepMounted: true, }} >
            {drawer}
          </SwipeableDrawer>
          <SwipeableDrawer open={openDrawerTaskMobile} onClose={handleDrawerTasksMobileToggle} onOpen={handleDrawerTasksMobileToggle} variant="temporary" anchor={'right'} classes={{ paper: classes.drawerPaper, }} ModalProps={{ keepMounted: true, }}>
            {drawerTasks}
          </SwipeableDrawer>
        </Hidden>
        {/* EndMobile */}
        {/* Sidebars para Web */}
        <Hidden xsDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper, }} variant="permanent" open >
            {drawer}
          </Drawer>
          <Drawer className={classes.drawer} classes={{ paper: classes.drawerPaper, }} variant="persistent" anchor={'right'} open={openDrawerTask} onClose={handleDrawerTasksToggle} >
            {drawerTasks}
          </Drawer>
        </Hidden>
        {/* EndWeb */}
      </nav>
      {/* End Sidebar */}

      <div className={classes.app}>
        <main className={clsx(classes.main, { [classes.contentShift]: openDrawerTask, })}>
          <div className={classes.drawerHeader} />
          {/* Start Body */}
          {props.children}
          {/* End Body */}
        </main>
        <footer className={classes.footer}>
          {/* <Copyright /> */}
        </footer>
      </div>
    </div>
  );

}