import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import summaryStyle from 'variables/styles/summaryStyle';

import { inject, observer } from 'mobx-react';
import CreatePortfolio from '../../components/Modal/CreatePortfolio';

const styles = () => ({
  warningText: {
    marginTop: '35%',
    textAlign: 'center',
  },
});

@inject('PortfolioStore')
@observer
class Summary extends React.Component {
  state = {};

  render() {
    const { classes, PortfolioStore } = this.props;
    let createPortfolio;
    let summaryContent;

    if (!PortfolioStore.portfolios.hasOwnProperty('0')) {
      createPortfolio = (
        <div >
          <p className={classes.warningText}>
            You currently have no portfolio to display. Please create a
            portfolio to start
          </p>
          <CreatePortfolio />
        </div>
      );
    } else {
      summaryContent = <p>Summary is under construction...</p>;
    }

    return (
      <div className="Summary">
        <Grid>
          {createPortfolio}
          {summaryContent}
        </Grid>
      </div>
    );
  }
}

Summary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, summaryStyle)(Summary);
