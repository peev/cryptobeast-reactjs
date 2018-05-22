// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { RegularCard } from './../../../components';
import HistoryTable from './../../CustomTables/HistoryTable';
import ExportPdfButton from './../../CustomButtons/ExportPdfButton';


const styles = () => ({
  tablePosition: {
    marginTop: '80px',
  },
});

type Props = {
  classes: Object,
  PortfolioStore: Object,
};

@inject('InvestorStore', 'PortfolioStore')
@observer
class TradeHistory extends Component<Props> {
  render() {
    const { classes, PortfolioStore } = this.props;

    const data = PortfolioStore.tradeHistory;
    const historyTable = (
      <HistoryTable
        tableData={data}
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
    );

    return (
      <RegularCard
        cardTitle="TRADE HISTORY"
        button={<ExportPdfButton />}
        content={
          <div>
            <div className={classes.tablePosition}>
              {historyTable}
            </div>
          </div>
        }
      />
    );
  }
}

export default withStyles(styles)(TradeHistory);
