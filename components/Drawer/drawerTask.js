import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Drawer, AppBar, CssBaseline, Toolbar, List, ListItem, ListItemIcon, ListItemText, Button, Avatar, IconButton, Hidden, Box, SwipeableDrawer, Divider, CircularProgress } from '@material-ui/core';
import Link from 'next/link';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListTask from '../TaskList/taskList'

const drawerWidth = 240;
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

export default function DrawerTask(){
    const theme = useTheme();
    const classes = useStyles();
    const [openDrawerTask, setOpenDrawerTask] = React.useState(false);
    const [openDrawerTaskMobile, setOpenDrawerTaskMobile] = React.useState(false);
    const handleDrawerTasksToggle = () => { setOpenDrawerTask(!openDrawerTask); };
    const handleDrawerTasksMobileToggle = () => { setOpenDrawerTaskMobile(!openDrawerTaskMobile); };


    return(
        <SwipeableDrawer open={openDrawerTaskMobile} onClose={handleDrawerTasksMobileToggle} onOpen={handleDrawerTasksMobileToggle} variant="temporary" anchor={'right'} classes={{ paper: classes.drawerPaper, }} ModalProps={{ keepMounted: true, }}>
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
        </SwipeableDrawer>
    )
}