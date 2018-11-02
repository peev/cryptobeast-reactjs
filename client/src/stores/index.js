import PortfolioStore from './PortfolioStore';
import AssetStore from './AssetStore';
import InvestorStore from './InvestorStore';
import MarketStore from './MarketStore';
import ApiAccountStore from './ApiAccountStore';
import UserStore from './UserStore';
import WeidexStore from './WeidexStore';
import NotificationStore from './NotificationStore';
import Analytics from './Analytics';
import Allocations from './Allocations';
import Currencies from './CurrencyStore';
import FiatCurrencies from './FiatCurrenciesStore';

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
  Allocations,
  Currencies,
  FiatCurrencies,
  TradeHistoryStore,
  WeidexStore,
};

export default stores;
