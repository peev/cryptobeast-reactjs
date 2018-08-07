// @flow
import React from 'react';
import { withStyles } from 'material-ui';

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
              { id: 'source', numeric: false, disablePadding: false, label: 'Source' },
              { id: 'pair', numeric: false, disablePadding: false, label: 'Pair' },
              { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
              { id: 'price', numeric: false, disablePadding: false, label: 'Price' },
              { id: 'filled', numeric: false, disablePadding: false, label: 'Filled' },
              { id: 'fee', numeric: false, disablePadding: false, label: 'Fee' },
              { id: 'total', numeric: false, disablePadding: false, label: 'Total' },
              { id: 'edit', numeric: false, disablePadding: false, label: '' },
              { id: 'remove', numeric: false, disablePadding: false, label: '' },
            ]}
          />
        </div>
      </React.Fragment>
    }
  />
);


export default withStyles(styles)(TradeHistoryWrapper);
