// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { RegularCard } from './../../../components';
import AllInvestorTable from './../../CustomTables/Investors/AllInvestorTable';
import ExportPdfButton from './../../CustomButtons/ExportPdfButton';

const styles = () => ({
  tablePosition: {
    marginTop: '80px',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  PortfolioStore: Object,
};

@inject('InvestorStore', 'PortfolioStore')
@observer
class TradeHistory extends Component<Props> {
  render() {
    const { classes, InvestorStore, PortfolioStore } = this.props;

    const data = InvestorStore.selectedInvestor
      ? PortfolioStore.currentPortfolioTransactions
        .filter((t: Object) => t.investorId === (InvestorStore.selectedInvestor ? InvestorStore.selectedInvestor.id : 1))
      : PortfolioStore.currentPortfolioTransactions;


    const investorsTable = (
      <AllInvestorTable
        tableData={data}
        tableHead={[
          'Trade Date',
          'Entry date',
          'Source',
          'Pair',
          'Type',
          'Qty',
          'Total price BTC',
          'Commission',
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
              {investorsTable}
            </div>
          </div>
        }
      />
    );
  }
}

export default withStyles(styles)(TradeHistory);
