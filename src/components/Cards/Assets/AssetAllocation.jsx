import React from 'react';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';
import RegularButton from '../../CustomButtons/Button';
import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import SelectExchange from '../../Selectors/Asset/SelectExchange';

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

class AssetAllocation extends React.Component {
  state = {
    direction: 'row',
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Asset Allocation</h4>

          <Grid container className={classes.containerItems}>
            <Grid item xs={3}>
              <SelectBaseCurrency />

              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectExchange />

              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectBaseCurrency />

              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectExchange />

              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerButton}>
            <RegularButton color="primary">RECORD</RegularButton>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(AssetAllocation);
