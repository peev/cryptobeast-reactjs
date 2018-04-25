import React from 'react';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import RegularButton from '../../CustomButtons/Button';
import SelectAllCurrency from '../../Selectors/Asset/SelectAllCurrency';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
import ErrorSnackbar from '../../Modal/ErrorSnackbar';

const styles = () => ({
  container: {
    width: '100%',
    margin: '40px 40px 0',
    padding: '20px 25px',
  },
  containerTitle: {
    margin: '0',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  containerItems: {
    marginTop: '1px',
  },
  containerButton: {
    paddingLeft: '8px',
  },
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  input: {
    width: '100%',
  },
});

@inject('MarketStore', 'PortfolioStore', 'ErrorStore')
@observer
class AssetInput extends React.Component {
  state = {
    direction: 'row',
  };

  handleRequest = (event) => {
    event.preventDefault();
    const inputValue = event.target.value;

    this.props.MarketStore.setBasicAssetInputValue(inputValue);
  }

  handleSave = () => {
    const portfolioId = this.props.PortfolioStore.selectedPortfolioId;

    if (portfolioId !== null) {
      this.props.MarketStore.createBasicAsset(portfolioId);
      this.props.ErrorStore.addError('Transaction recorded successfully')
    }
  }

  render() {
    const { classes, MarketStore } = this.props;

    return (
      <Grid container >
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Basic asset input</h4>

          <Grid container className={classes.containerItems}>
            <Grid item xs={4} sm={3} md={3}>
              <SelectAllCurrency />

              <Input
                type="number"
                placeholder="Quantity..."
                value={MarketStore.assetInputValue}
                onChange={e => this.handleRequest(e)}
                className={classes.input}
              />
            </Grid>

            <Grid item xs={4} sm={3} md={3}>
              <SelectExchange floatingLabelText="Frequency" />
            </Grid>
          </Grid>

          <Grid container className={classes.containerButton}>
            <RegularButton
              color="primary"
              className="btnAdd"
              onClick={this.handleSave}
            >ADD
            </RegularButton>
          </Grid>
        </Paper>
        <ErrorSnackbar />
      </Grid>
    );
  }
}

export default withStyles(styles)(AssetInput);
