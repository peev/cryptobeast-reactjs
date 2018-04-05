import SummaryPage from "views/Summary/Summary.jsx";
import AssetMovements from "views/AssetMovements/AssetMovements.jsx";
import Simulator from "views/Simulator/Simulator.jsx";
import TransactionHistory from "views/TransactionHistory/TransactionHistory.jsx";
import Ledgers from "views/Ledgers/Ledgers.jsx";
import Investors from "views/Investors/Investors.jsx";
import Analytics from "views/Analytics/Analytics.jsx";
import Settings from "views/Settings/Settings.jsx";

import AnalyticsIcon from '../assets/Icons/Analytics.svg';
import History from '../assets/Icons/History.svg';
import InvestorsIcon from '../assets/Icons/Investors.svg';
import LedgersIcon from '../assets/Icons/Ledgers.svg';
import Market from '../assets/Icons/Market.svg';
import SimulatorIcon from '../assets/Icons/Simulator.svg';
import SummaryIcon from '../assets/Icons/Summary.svg';
import SettingsIcon from '../assets/Icons/Settings.svg';



// import {
//   Dashboard,
//   Person,
//   ContentPaste,
//   LibraryBooks,
//   BubbleChart,
//   LocationOn,
//   Notifications
// } from "material-ui-icons";


const appRoutes = [
  {
    path: "/summary",
    sidebarName: "Summary",
    navbarName: "Summary",
    icon: SummaryIcon,
    component: SummaryPage
  },
  {
    path: "/assetMovements",
    sidebarName: "Asset Movements",
    navbarName: "Asset Movements",
    icon: 'market.svg',
    component: AssetMovements
  },
  {
    path: "/Simulator",
    sidebarName: "Simulator",
    navbarName: "Simulator",
    icon: 'simulatorIcon.svg',
    component: Simulator
  },
  {
    path: "/TransactionHistory",
    sidebarName: "Transaction History",
    navbarName: "Transaction History",
    icon: 'history.svg',
    component: TransactionHistory
  },
  {
    path: "/Ledgers",
    sidebarName: "Ledgers",
    navbarName: "Ledgers",
    icon: 'ledgersIcon.svg',
    component: Ledgers
  },
  {
    path: "/Investors",
    sidebarName: "Investors",
    navbarName: "Investors",
    icon: 'investorsIcon.svg',
    component: Investors
  },
  {
    path: "/Analytics",
    sidebarName: "Analytics",
    navbarName: "Analytics",
    icon: 'analyticsIcon.svg',
    component: Analytics
  },
  {
    path: "/Settings",
    sidebarName: "Settings",
    navBarName: "Settings",
    icon: 'settingsIcon.svg',
    component: Settings
  },
  {
    redirect: true,
    path: "/",
    to: "/summary",
    navbarName: "Redirect"
  }
];

export default appRoutes;
