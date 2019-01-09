import SummaryPage from './../views/Summary/Summary';
// import AssetMovements from './../views/AssetMovements/AssetMovements';
import Simulator from './../views/Simulator/Simulator';
import TransactionHistory from './../views/TransactionHistory/TransactionHistory';
// import Ledgers from './../views/Ledgers/Ledgers';
import Investors from './../views/Investors/Investors';
import Analytics from './../views/Analytics/Analytics';
import Settings from './../views/Settings/Settings';

import InvestorsIcon from './../components/CustomIcons/Sidebar/InvestorsIcon';
import SummaryIcon from './../components/CustomIcons/Sidebar/SummaryIcon';
import SettingsIcon from './../components/CustomIcons/Sidebar/SettingsIcon';
import SimulatorIcon from './../components/CustomIcons/Sidebar/SimulatorIcon';
import AnalyticsIcon from './../components/CustomIcons/Sidebar/AnalyticsIcon';
import TransactionHistoryIcon from './../components/CustomIcons/Sidebar/TransactionHistoryIcon';
// import LedgersIcon from './../components/CustomIcons/Sidebar/LedgersIcon';
// import AssetMovementsIcon from './../components/CustomIcons/Sidebar/AssetMovementsIcon';

const appRoutes = [
  {
    path: '/summary',
    sidebarName: 'Summary',
    navbarName: 'Summary',
    icon: SummaryIcon,
    component: SummaryPage,
  },
  // {
  //   path: '/assetMovements',
  //   sidebarName: 'Asset Movements',
  //   navbarName: 'Asset Movements',
  //   icon: AssetMovementsIcon,
  //   component: AssetMovements,
  // },
  {
    path: '/Investors',
    sidebarName: 'Investors',
    navbarName: 'Investors',
    icon: InvestorsIcon,
    component: Investors,
  },
  {
    path: '/Analytics',
    sidebarName: 'Analytics',
    navbarName: 'Analytics',
    icon: AnalyticsIcon,
    component: Analytics,
  },
  {
    path: '/TransactionHistory',
    sidebarName: 'Transaction History',
    navbarName: 'Transaction History',
    icon: TransactionHistoryIcon,
    component: TransactionHistory,
  },
  // {
  //   path: '/Ledgers',
  //   sidebarName: 'Ledgers',
  //   navbarName: 'Ledgers',
  //   icon: LedgersIcon,
  //   component: Ledgers,
  // },
  {
    path: '/Simulator',
    sidebarName: 'Simulator',
    navbarName: 'Simulator',
    icon: SimulatorIcon,
    component: Simulator,
  },
  {
    path: '/Settings',
    sidebarName: 'Settings',
    navBarName: 'Settings',
    icon: SettingsIcon,
    component: Settings,
  },
];

export default appRoutes;
