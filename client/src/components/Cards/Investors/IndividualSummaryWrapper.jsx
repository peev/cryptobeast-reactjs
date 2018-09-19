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
};

@inject('InvestorStore', 'PortfolioStore')
@observer
class IndividualSummaryWrapper extends Component<Props> {
  render() {
    const { classes, InvestorStore, PortfolioStore } = this.props;

    const data = InvestorStore.selectedInvestorIndividualSummary
      ? PortfolioStore.currentPortfolioTransactions
        .filter((t: Object) => t.investorId === InvestorStore.selectedInvestorIndividualSummary.id)
      : PortfolioStore.currentPortfolioTransactions;

    const investorsTable = (
      <AllInvestorTable
        tableData={data}
        tableHead={[
          { id: 'name', numberic: false, disablePadding: false, label: 'Name' },
          { id: 'dateOfEntry', numberic: true, disablePadding: false, label: 'Date of Entry' },
          // { id: 'transactionDate', numberic: true, disablePadding: false, label: 'Transaction date' },
          { id: 'amountUSD', numberic: true, disablePadding: false, label: 'Amount (USD)' },
          { id: 'sharePrice', numberic: true, disablePadding: false, label: 'Share price' },
          { id: 'shares', numberic: true, disablePadding: false, label: 'Shares' },
          { id: 'comission', numberic: true, disablePadding: false, label: 'Commission' },
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
