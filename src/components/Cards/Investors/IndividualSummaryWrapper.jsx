import React, { Component } from 'react';
import { RegularCard } from 'components';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';

import IndividualSummary from './IndividualSummary';
import InvestorDetailsTable from '../../CustomTables/Investors/InvestorDetailsTable';
import AllInvestorTable from '../../CustomTables/Investors/AllInvestorTable';
import ExportPdfButton from '../../CustomButtons/ExportPdfButton';

const styles = () => ({
  tablePosition: {
    marginTop: '80px',
  },
});

@inject('InvestorStore')
@observer
class IndividualSummaryWrapper extends Component {
  state = {
    direction: 'row',
  };

  render() {
    const { classes, InvestorStore } = this.props;

    const investorDetailsTable = (<InvestorDetailsTable
      tableHead={[
        'ID',
        'Name',
        'Date of Entry',
        'Transaction date',
        'Amount (USD)',
        'Share price',
        'Shares',
      ]}
      tableData={[
        [
          '1',
          'SomeInvestor',
          'A day',
          'Transaction Dates',
          '1$',
          '1$',
          'Test',
        ],
      ]}
    />);

    const investorsTable = (<AllInvestorTable
      tableHead={[
        'ID',
        'Name',
        'Date of Entry',
        'Transaction date',
        'Amount (USD)',
        'Share price',
        'Shares',
      ]}
      tableData={[
        [
          '1',
          'Investor',
          'Today',
          'Tomorrow',
          '100$',
          '100$',
          '23',
        ],
      ]}
    />);

    return (
      <RegularCard
        cardTitle="INDIVIDUAL SUMMARY"
        button={<ExportPdfButton />}
        content={
          <div>
            <IndividualSummary />
            <div className={classes.tablePosition}>
              {InvestorStore.selectedInvestor ? investorDetailsTable : investorsTable}
            </div>
          </div>
        }
      />
    );
  }
}

export default withStyles(styles)(IndividualSummaryWrapper);
