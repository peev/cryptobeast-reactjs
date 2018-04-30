import React, { Component } from 'react';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import SelectInvestor from '../../Selectors/SelectInvestor';

const styles = () => ({
  container: {
    width: '100%',
    marginTop: '20px',
    padding: '0 20px',
  },
  containerItems: {
    paddingTop: '20px',
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
    },
  },
  overrideGrid: {
    padding: '12px',
  },
  profitStyle: {
    color: '#60bb9b',
  },
});

@inject('InvestorStore')
@observer
class TransactionSimulator extends Component {
  state = {
    direction: 'row',
  };

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <div>
        <Grid container>
          TransactionSimulator
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TransactionSimulator);
