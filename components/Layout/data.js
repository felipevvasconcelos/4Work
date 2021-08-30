import FolderSpecialIcon from "@material-ui/icons/FolderSpecial";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import GroupIcon from "@material-ui/icons/Group";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { Divider } from "@material-ui/core";
import { Dashboard, BusinessCenter, Cast, Settings } from "@material-ui/icons";

export const dataDrawer = [
  {
    type: "IconLink",
    href: "/dashboard",
    handleLoading: "/dashboard",
    primary: "Dashboard",
    icon: <Dashboard />,
    disabled: true,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/project",
    handleLoading: "/project",
    primary: "Projetos",
    icon: <BusinessCenter />,
    permissions: ['Gerente Projetos']
  },
  {
    type: "IconLink",
    href: "/call",
    handleLoading: "/call",
    primary: "Chamados",
    icon: <AssignmentIcon />,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/improvement",
    handleLoading: "/improvement",
    primary: "Melhorias",
    icon: <FolderSpecialIcon />,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/task",
    handleLoading: "/task",
    primary: "Tarefas",
    icon: <DynamicFeedIcon />,
    disabled: true,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/room",
    handleLoading: "/room",
    primary: "Quadro",
    icon: <Cast />,
    disabled: true,
    permissions: ['All']
  },
  {
    type: "Divider",
    jsx: <Divider variant="middle" />,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/user",
    handleLoading: "/user",
    primary: "Usuários",
    icon: <GroupIcon />,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/company",
    handleLoading: "/company",
    primary: "Empresas",
    icon: <LocationCityIcon />,
    permissions: ['Gerente Projetos']
  },
  {
    type: "Acordian",
    primary: "Configurações",
    icon: <Settings />,
    permissions: ['Administrador']
  }
];

