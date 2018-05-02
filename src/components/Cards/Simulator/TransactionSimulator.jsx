import React, { Component } from 'react';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import RegularButton from '../../CustomButtons/Button';

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
  btnAdd: {
    float: 'right',
    margin: '100px',
  },
});

@inject('MarketStore')
@observer
class TransactionSimulator extends Component {
  state = {
    direction: 'row',
  };

  render() {
    const { classes, MarketStore } = this.props;

    return (
      <div>
        <Grid container>
          TransactionSimulator

          <Grid container className={classes.containerButton}>
            <RegularButton
              color="primary"
              className="btnAdd"
              onClick={this.handleSave}
            >Add more lines
            </RegularButton>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TransactionSimulator);
