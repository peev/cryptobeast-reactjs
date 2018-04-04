import SummaryPage from 'views/Summary/Summary';
import AssetMovements from 'views/AssetMovements/AssetMovements';
import Simulator from 'views/Simulator/Simulator';
import TransactionHistory from 'views/TransactionHistory/TransactionHistory';
import Ledgers from 'views/Ledgers/Ledgers';
import Investors from 'views/Investors/Investors';
import Analytics from 'views/Analytics/Analytics';
import Settings from 'views/Settings/Settings';

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
    path: '/Settings',
    sidebarName: 'Settings',
    navBarName: 'Settings',
    icon: Notifications,
    component: Settings,
  },
  {
    redirect: true, path: '/', to: '/summary', navbarName: 'Redirect',
  },
];

export default appRoutes;
