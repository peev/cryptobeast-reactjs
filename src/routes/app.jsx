import SummaryPage from "views/Summary/Summary.jsx";
import AssetMovements from "views/AssetMovements/AssetMovements.jsx";
import Simulator from "views/Simulator/Simulator.jsx";
import TransactionHistory from "views/TransactionHistory/TransactionHistory.jsx";
import Ledgers from "views/Ledgers/Ledgers.jsx";
import Investors from "views/Investors/Investors.jsx";
import Analytics from "views/Analytics/Analytics.jsx";
import Settings from "views/Settings/Settings.jsx";
import InvestorsIcon  from '../components/CustomIcons/InvestorsIcon';
import SummaryIcon from '../components/CustomIcons/SummaryIcon';
import SettingsIcon  from '../components/CustomIcons/SettingsIcon';
import SimulatorIcon from '../components/CustomIcons/SimulatorIcon';
import AnalyticsIcon  from '../components/CustomIcons/AnalyticsIcon';
import HistoryIcon from '../components/CustomIcons/HistoryIcon';
import LedgersIcon  from '../components/CustomIcons/LedgersIcon';
import MarketIcon from '../components/CustomIcons/MarketIcon';

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
    icon: MarketIcon,
    component: AssetMovements
  },
  {
    path: "/Investors",
    sidebarName: "Investors",
    navbarName: "Investors",
    icon: InvestorsIcon,
    component: Investors
  },
  {
    path: "/Analytics",
    sidebarName: "Analytics",
    navbarName: "Analytics",
    icon: AnalyticsIcon,
    component: Analytics
  },
  {
    path: "/TransactionHistory",
    sidebarName: "Transaction History",
    navbarName: "Transaction History",
    icon: HistoryIcon,
    component: TransactionHistory
  },
  {
    path: "/Ledgers",
    sidebarName: "Ledgers",
    navbarName: 'Ledgers',
    icon: LedgersIcon,
    component: Ledgers
  },
  {
    path: "/Simulator",
    sidebarName: "Simulator",
    navbarName: "Simulator",
    icon: SimulatorIcon,
    component: Simulator
  },
  {
    path: "/Settings",
    sidebarName: "Settings",
    navBarName: "Settings",
    icon: SettingsIcon,
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
