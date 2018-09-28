import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import MotionSelect from '../../Selectors/MotionSelect';
import CorrelationMatrixTable from '../../CustomTables/CorrelationMatrixTable';

const styles = () => ({
  overflowNone: {
    'overflow-x': 'hidden'
  },
  marginRight: {
    marginRight: '75px',
  },
  marginTop: {
    marginTop: '40px',
  },
  topHeight: {
    height: '100%',
  },
  maxWidth: {
    width: '100%',
    'overflow-x': 'hidden'
  },
  smallTopPadding: {
    marginTop: '20px'
  },
  flex: {
    display: 'flex',
    'flex-direction': 'column',
    'text-align': 'center',
  },
  flexCenter: {
    'justify-content': 'center'
  },
  flexBottom: {
    'justify-content': 'flex-end'
  },
  padding: {
    padding: '20px'
  },
  noMargin: {
    marginTop: 0
  },
});

type Props = {
  classes: Object,
};

@inject('MarketStore')
@observer
class CorrelationMatrix extends React.Component<Props, State> {
  state = {
    selectPeriod: '90d'
  };

  constructor(props) {
    super(props);
    this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
  }

  handleSelectPeriod(data) {
    if (!data) {
      return;
    }
    this.setState({
      selectPeriod: data
    });
  }

  render() {
    const { classes, MarketStore } = this.props;
    const { selectPeriod } = this.state;

    if(MarketStore.correlationMatrix === null) {
      return null;
    }

    let matrix = MarketStore.correlationMatrix[selectPeriod];

    if(!matrix) {
      return null;
    }
    
    return (
      <Grid container className={classes.overflowNone}>
        <Grid container>
          <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
            <MotionSelect defaultValueIndex={0} selectedValue={this.handleSelectPeriod} values={['90d', '180d']} />
          </Grid>
        </Grid>

        <Grid container className={classes.smallTopPadding}>
          <Grid item className={[classes.topItem, classes.topHeight, classes.maxWidth].join(' ')}>
            <Paper className={classes.topHeight}>
              <CorrelationMatrixTable data={matrix} style={{ width: '100%' }} className={[classes.flex, classes.flexCenter].join(' ')} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles)(CorrelationMatrix);