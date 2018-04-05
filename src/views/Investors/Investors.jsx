import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { ItemGrid, RegularCard } from 'components';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import { Edit } from 'material-ui-icons';

import ExportPdfButton from '../../components/CustomButtons/ExportPdfButton';
// import SelectInvestor from '../../components/Selectors/SelectInvestor';
import TotalInvestorsWrapped from '../../components/Modal/InvestorModals/TotalInvestors';
import SharesInCirculationWrapped from '../../components/Modal/InvestorModals/SharesInCirculation';
import CurrentSharePriceWrapped from '../../components/Modal/InvestorModals/CurrentSharePrice';
import TotalUSDEquivWrapped from '../../components/Modal/InvestorModals/TotalUSDEquiv';

import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import InvestorDepositWrapped from '../../components/Modal/InvestorModals/InvestorDeposit';
import InvestorWithdrawWrapped from '../../components/Modal/InvestorModals/InvestorWithdraw';
import EditInvestorWrapped from '../../components/Modal/InvestorModals/EditInvestor';

import IndividualSummary from '../../components/Cards/Investors/IndividualSummary';
import CurrentInvestor from '../../components/CustomTables/CurrentInvestor';
import './Investors.css';

const styles = () => ({
  itemCardPosition: {
    margin: '0 -20px',
    marginTop: '40px',
  },
  tablePosition: {
    marginTop: '80px',
  }
});

class Investors extends Component {
  state = {
    direction: 'row',
    open: false,
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid container className="InvCardsGroup">
          <TotalInvestorsWrapped />
          <SharesInCirculationWrapped />
          <CurrentSharePriceWrapped />
          <TotalUSDEquivWrapped />
        </Grid>

        <Grid container className="InvButtonsGroup">
          <AddInvestorWrapped />
          <InvestorDepositWrapped />
          <InvestorWithdrawWrapped />
          <EditInvestorWrapped />
        </Grid>

        <div className={classes.itemCardPosition}>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="INDIVIDUAL SUMMARY"
              // button={
              //   <ExportPdfButton customClass="editPDF">
              //     <Edit style={{ color: '#FFF' }} />
              //   </ExportPdfButton>
              // }
              content={
                <div>
                  <IndividualSummary />
                  <div className={classes.tablePosition}>
                    <CurrentInvestor
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
                          'SomeINvestor',
                          'A day',
                          'Transaction Dates',
                          '1$',
                          '1$',
                          'Test',
                          'test',
                        ],
                      ]}
                    />
                  </div>
                </div>
              }
            />
          </ItemGrid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Investors);
