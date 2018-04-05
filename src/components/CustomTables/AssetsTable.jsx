import React from 'react';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';


const styles = () => ({
  container: {
    width: '100%',
    margin: '40px 40px 0',
    padding: '20px 25px',
  },
});

class AssetsTable extends React.Component {
  state = {
    direction: 'row',
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Paper className={classes.container}>
          All Assets
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(AssetsTable);
