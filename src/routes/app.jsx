import SummaryPage from 'views/Summary/Summary.jsx';
import AssetMovements from 'views/AssetMovements/AssetMovements.jsx';
import Simulator from 'views/Simulator/Simulator.jsx';
import TransactionHistory from 'views/TransactionHistory/TransactionHistory.jsx';
import Ledgers from 'views/Ledgers/Ledgers.jsx';
import Investors from 'views/Investors/Investors.jsx';
import Analytics from 'views/Analytics/Analytics.jsx';

import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  BubbleChart,
  LocationOn,
  Notifications,
} from 'material-ui-icons';

const appRoutes = [
  {
    path: '/summary',
    sidebarName: 'Summary',
    navbarName: 'Summary',
    icon: Dashboard,
    component: SummaryPage,
  },
  {
    path: '/assetMovements',
    sidebarName: 'Asset Movements',
    navbarName: 'Asset Movements',
    icon: Person,
    component: AssetMovements,
  },
  {
    path: '/Simulator',
    sidebarName: 'Simulator',
    navbarName: 'Simulator',
    icon: ContentPaste,
    component: Simulator,
  },
  {
    path: '/TransactionHistory',
    sidebarName: 'Transaction History',
    navbarName: 'Transaction History',
    icon: LibraryBooks,
    component: TransactionHistory,
  },
  {
    path: '/Ledgers',
    sidebarName: 'Ledgers',
    navbarName: 'Ledgers',
    icon: BubbleChart,
    component: Ledgers,
  },
  {
    path: '/Investors',
    sidebarName: 'Investors',
    navbarName: 'Investors',
    icon: LocationOn,
    component: Investors,
  },
  {
    path: '/Analytics',
    sidebarName: 'Analytics',
    navbarName: 'Analytics',
    icon: Notifications,
    component: Analytics,
  },
  {
    redirect: true, path: '/', to: '/summary', navbarName: 'Redirect',
  },
];

export default appRoutes;
