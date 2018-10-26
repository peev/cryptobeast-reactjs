import PortfolioStore from './PortfolioStore';
import AssetStore from './AssetStore';
import InvestorStore from './InvestorStore';
import MarketStore from './MarketStore';
import ApiAccountStore from './ApiAccountStore';
import UserStore from './UserStore';
import WeidexStore from './WeidexStore';
import NotificationStore from './NotificationStore';
import Analytics from './Analytics';

import TradeHistoryStore from '../features/TransactionHistory/TradeHistory/TradeHistoryStore';


const stores = {
  PortfolioStore,
  AssetStore,
  InvestorStore,
  MarketStore,
  ApiAccountStore,
  UserStore,
  NotificationStore,
  Analytics,
  TradeHistoryStore,
  WeidexStore,
};

export default stores;
