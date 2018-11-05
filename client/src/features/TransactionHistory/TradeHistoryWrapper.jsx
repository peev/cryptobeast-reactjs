// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';

import { RegularCard } from '../../components';
import TradeHistory from './TradeHistory/TradeHistory';


const styles = () => ({
  tablePosition: {
    // marginTop: '80px',
  },
});

type Props = {
  classes: Object,
};


const TradeHistoryWrapper = ({ classes }: Props) => (
  <RegularCard
    cardTitle="TRADE HISTORY"
    content={
      <React.Fragment>
        <div className={classes.tablePosition}>
          <TradeHistory
            tableHead={[
              { id: 'tradeDate', numeric: false, disablePadding: false, label: 'Trade Date' },
              { id: 'pair', numeric: false, disablePadding: false, label: 'Pair' },
              { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
              { id: 'amount', numeric: false, disablePadding: false, label: 'Amount' },
              { id: 'price_eth', numeric: false, disablePadding: false, label: 'Price ETH' },
              { id: 'fee', numeric: false, disablePadding: false, label: 'Fee' },
              { id: 'total_eth', numeric: false, disablePadding: false, label: 'Total ETH' },
              { id: 'total_usd', numeric: false, disablePadding: false, label: 'Total USD' },
            ]}
          />
        </div>
      </React.Fragment>
    }
  />
);


export default withStyles(styles)(TradeHistoryWrapper);
