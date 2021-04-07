import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Drawer, AppBar, CssBaseline, Toolbar, List, ListItem, ListItemIcon, ListItemText, Button, Avatar, IconButton, Hidden, Box, SwipeableDrawer, Divider, CircularProgress } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Link from 'next/link';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import LocationCityIcon from '@material-ui/icons/LocationCity';

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


export default function DrawerMenu(props){
    const { window } = props;
    const theme = useTheme();
    const classes = useStyles();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const handleDrawerToggle = () => { setOpenDrawer(!openDrawer); };
    const container = window !== undefined ? () => window().document.body : undefined;


    return(
        <SwipeableDrawer container={container} variant="temporary" anchor={theme.direction === 'rtl' ? 'right' : 'left'} open={openDrawer} onOpen={handleDrawerToggle} onClose={handleDrawerToggle} classes={{ paper: classes.drawerPaper, }} ModalProps={{ keepMounted: true, }} >
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
        </SwipeableDrawer>
      )



}