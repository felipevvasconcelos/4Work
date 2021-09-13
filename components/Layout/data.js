import FolderSpecialIcon from "@material-ui/icons/FolderSpecial";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import GroupIcon from "@material-ui/icons/Group";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { Divider } from "@material-ui/core";
import { Dashboard, BusinessCenter, Cast, Settings, AvTimer, AccessAlarm } from "@material-ui/icons";

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
    permissions: ['61156d728bd9c60008e0f4cc']
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
    href: "/timesheet",
    handleLoading: "/timesheet",
    primary: "TimeSheet",
    icon: <AccessAlarm />,
    permissions: ['All']
  },
  {
    type: "IconLink",
    href: "/timemanager",
    handleLoading: "/timesheet",
    primary: "Gerenciar Horas",
    icon: <AvTimer />,
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
    permissions: ['61156d728bd9c60008e0f4cc']
  },
  {
    type: "Acordian",
    primary: "Configurações",
    icon: <Settings />,
    permissions: ['60bc30dbf582fe96a40b72a2']
  }
];

