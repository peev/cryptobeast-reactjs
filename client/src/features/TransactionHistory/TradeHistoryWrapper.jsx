// @flow
import React from 'react';
import { withStyles } from 'material-ui';

import { RegularCard } from '../../components';
import TradeHistory from './TradeHistory/TradeHistory';
// import ExportPdfButton from '../../components/CustomButtons/ExportPdfButton';


const styles = () => ({
  tablePosition: {
    marginTop: '80px',
  },
});

type Props = {
  classes: Object,
};


const TradeHistoryWrapper = ({ classes }: Props) => (
  <RegularCard
    cardTitle="TRADE HISTORY"
    // button={<ExportPdfButton />}
    content={
      <React.Fragment>
        <div className={classes.tablePosition}>
          <TradeHistory
            tableHead={[
              'Trade Date',
              'Entry date',
              'Source',
              'Pair',
              'Type',
              'Price',
              'Filled',
              'Fee',
              'Total',
              '',
              '',
            ]}
          />
        </div>
      </React.Fragment>
    }
  />
);


export default withStyles(styles)(TradeHistoryWrapper);
