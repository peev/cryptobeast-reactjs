// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import SelectInvestor from '../../Selectors/SelectInvestor';


const styles = () => ({
  container: {
    width: '100%',
    marginTop: '20px',
    padding: '0 20px',
  },
  containerItems: {
    paddingTop: '20px',
    marginRight: '40px',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
    '&>p': {
      textTransform: 'uppercase',
      fontSize: '14px',
      margin: '0',
      padding: '0',
    },
    '&>span': {
      fontSize: '14px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    },
  },
  overrideGrid: {
    padding: '12px',
  },
  positiveValue: {
    color: '#70A800',
  },
  negativeValue: {
    color: '#B94A48',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
};

@inject('InvestorStore')
@observer
class IndividualSummary extends React.Component<Props> {
  componentWillUnmount() {
    this.props.InvestorStore.resetSelectedInvestor();
  }

  handleSelectInvestorForSummary = (value: *) => {
    this.props.InvestorStore.selectInvestorIndividualSummary(value);
  }

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <ValidatorForm
        onSubmit={() => { }}
      >
        <Grid container>
          <Grid container className={classes.container}>
            <Grid item xs={6} sm={6} md={3}>
              <SelectInvestor
                value={InvestorStore.selectedInvestorIndividualSummaryId || ''}
                handleChange={this.handleSelectInvestorForSummary}
                style={{
                  width: '95%',
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid #757575',
                }}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.container}>
            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>Shares Held:</p>
                <span>{InvestorStore.selectedInvestorTotalSharesHeld !== null
                  ? InvestorStore.selectedInvestorTotalSharesHeld
                  : ''}
                </span>
              </div>

              <div className={classes.containerItems}>
                <p>Weighted entry price:</p>
                <span>{InvestorStore.individualWeightedEntryPrice !== null
                  ? `$ ${InvestorStore.nearZeroRounding(InvestorStore.individualWeightedEntryPrice, 2)}`
                  : ''}
                </span>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>USD Equivalent:</p>
                <span>{InvestorStore.individualUSDEquivalent !== null
                  ? InvestorStore.nearZeroRounding(InvestorStore.individualUSDEquivalent, 2)
                  : ''}
                </span>
              </div>

              <div className={classes.containerItems}>
                <p>BTC Equivalent:</p>
                <span>{InvestorStore.individualBTCEquivalent !== null
                  ? InvestorStore.nearZeroRounding(InvestorStore.individualBTCEquivalent, 2)
                  : ''}
                </span>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>Investment Period:</p>
                <span>{InvestorStore.individualInvestmentPeriod !== null
                  ? `${InvestorStore.individualInvestmentPeriod} DAYS`
                  : ''}
                </span>
              </div>

              <div className={classes.containerItems}>
                <p>Profit:</p>
                <span className={InvestorStore.individualProfit > 0
                  ? classes.positiveValue
                  : InvestorStore.individualProfit < 0
                    ? classes.negativeValue
                    : ''}
                >
                  {InvestorStore.individualProfit !== null
                    ? `${InvestorStore.nearZeroRounding(InvestorStore.individualProfit, 2)} %`
                    : ''}
                </span>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>ETH Equivalent:</p>
                <span>{InvestorStore.individualETHEquivalent !== null
                  ? InvestorStore.nearZeroRounding(InvestorStore.individualETHEquivalent, 2)
                  : ''}
                </span>
              </div>

              <div className={classes.containerItems}>
                <p>Fee Potential:</p>
                <span>{InvestorStore.individualFeePotential !== null
                  ? `$ ${InvestorStore.nearZeroRounding(InvestorStore.individualFeePotential, 2)}`
                  : ''}
                </span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(IndividualSummary);
