// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui';
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
          // 'ID',
          'Name',
          'Date of Entry',
          'Transaction date',
          'Amount (USD)',
          'Share price',
          'Shares',
          'Commission',
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
