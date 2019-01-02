// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import IndividualSummary from './IndividualSummary';
import { RegularCard } from './../../../components';
import AllInvestorTable from './../../CustomTables/Investors/AllInvestorTable';
// import ExportPdfButton from './../../CustomButtons/ExportPdfButton';

const styles = () => ({
  tablePosition: {
    marginTop: '80px',
    '& th': {
      fontWeight: '700',
    },
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  PortfolioStore: Object,
  TransactionStore: Object,
};

@inject('InvestorStore', 'PortfolioStore', 'TransactionStore')
@observer
class IndividualSummaryWrapper extends Component<Props> {
  render() {
    const { classes, InvestorStore, PortfolioStore, TransactionStore } = this.props;

    const data = InvestorStore.selectedInvestorIndividualSummary
      ? TransactionStore.transactions
        .filter((t: Object) => t.investorId === InvestorStore.selectedInvestorIndividualSummary.id)
      : TransactionStore.transactions;

    const investorsTable = (
      <AllInvestorTable
        tableData={data}
        tableHead={[
          { id: 'id', numberic: true, disablePadding: false, label: 'ID' },
          { id: 'name', numberic: false, disablePadding: false, label: 'Name' },
          { id: 'transactionDate', numberic: true, disablePadding: false, label: 'Transaction date' },
          { id: 'amountUSD', numberic: true, disablePadding: false, label: 'Amount (USD)' },
          { id: 'sharePrice', numberic: true, disablePadding: false, label: 'Share price' },
          { id: 'shares', numberic: true, disablePadding: false, label: 'Shares' },
          { id: 'action', disablePadding: false, label: '' },
        ]}
      />
    );

    return (
      <RegularCard
        cardTitle="INDIVIDUAL SUMMARY"
        // button={<ExportPdfButton />}
        content={
          <div>
            <IndividualSummary />
            <div className={classes.tablePosition}>
              {investorsTable}
            </div>
          </div>
        }
      />
    );
  }
}

export default withStyles(styles)(IndividualSummaryWrapper);
