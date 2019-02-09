// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { inject, observer } from 'mobx-react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import SelectInvestor from '../../Selectors/SelectInvestor';
import AddInvestorWrapped from '../../../components/Modal/InvestorModals/AddInvestor';
import EditInvestorWrapped from '../../../components/Modal/InvestorModals/EditInvestor';
import BigNumberService from '../../../services/BigNumber';

const styles = () => ({
  gridColumn: {
    padding: '30px 25px 0 25px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
    borderBottom: '1px solid black',
    '&>p': {
      textTransform: 'uppercase',
      fontSize: '14px',
      margin: '0',
    },
    '&>span': {
      fontSize: '14px',
      fontWeight: '600',
    },
  },
  positiveValue: {
    color: '#70A800',
  },
  negativeValue: {
    color: '#B94A48',
  },
  textWrapper: {
    padding: '30px 25px 0 25px',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  PortfolioStore: Object,
};

@inject('InvestorStore', 'PortfolioStore')
@observer
class IndividualSummary extends React.Component<Props> {
  componentWillUnmount() {
    this.props.InvestorStore.resetSelectedInvestor();
  }

  handleSelectInvestorForSummary = (value: *) => {
    this.props.InvestorStore.selectInvestorIndividualSummary(value.value);
  }

  resetSelectedInvestor = () => {
    this.props.InvestorStore.resetSelectedInvestor();
  }

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <ValidatorForm
        onSubmit={() => { }}
      >
        <Grid container>
          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn} style={{ marginBottom: '20px' }}>
            <SelectInvestor
              isClearable
              handleChange={this.handleSelectInvestorForSummary}
              currentPortfolioInvestors={this.props.PortfolioStore.currentPortfolioInvestors}
              style={{
                border: 'none',
                borderRadius: 0,
                borderBottom: '1px solid #757575',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={5} lg={3} />
          <Grid item xs={12} sm={9} md={5} lg={3}>
            <AddInvestorWrapped />
          </Grid>
          <Grid item xs={12} sm={9} md={5} lg={3}>
            <EditInvestorWrapped />
          </Grid>
        </Grid>


        <Grid container>
          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>Shares Held:</p>
              <span>{InvestorStore.selectedInvestorTotalSharesHeld !== null
                ? InvestorStore.selectedInvestorTotalSharesHeld
                : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>Weighted entry price:</p>
              <span>{InvestorStore.individualWeightedEntryPrice !== null
                ? `$ ${BigNumberService.floor(InvestorStore.individualWeightedEntryPrice)}`
                : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>USD Equivalent:</p>
              <span>{InvestorStore.individualUSDEquivalent !== null
                ? BigNumberService.floor(InvestorStore.individualUSDEquivalent)
                : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>BTC Equivalent:</p>
              <span>{InvestorStore.individualBTCEquivalent !== null
                ? BigNumberService.floorFour(InvestorStore.individualBTCEquivalent)
                : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>Investment Period:</p>
              <span>{InvestorStore.individualInvestmentPeriod !== null
                ? `${InvestorStore.individualInvestmentPeriod} DAYS`
                : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>Profit:</p>
              <span className={InvestorStore.individualProfit > 0
                ? classes.positiveValue
                : InvestorStore.individualProfit < 0
                  ? classes.negativeValue
                  : ''}
              >
                {InvestorStore.individualProfit !== null
                  ? `${BigNumberService.floor(InvestorStore.individualProfit)} %`
                  : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>ETH Equivalent:</p>
              <span>{InvestorStore.individualETHEquivalent !== null
                ? BigNumberService.floorFour(InvestorStore.individualETHEquivalent)
                : ''}
              </span>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={3} className={classes.gridColumn}>
            <div className={classes.item}>
              <p>Fee Potential:</p>
              <span>{InvestorStore.individualFeePotential !== null
                ? `$ ${BigNumberService.floor(InvestorStore.individualFeePotential)}`
                : ''}
              </span>
            </div>
          </Grid>
        </Grid>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(IndividualSummary);
