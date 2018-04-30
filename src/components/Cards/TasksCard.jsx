import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
} from 'material-ui';
import tasksCardStyle from 'variables/styles/tasksCardStyle';
import Trending from '../Tabs/SummaryItems/Trending';
import Portfolio from '../Tabs/SummaryItems/Portfolio';

const styles = () => ({
  container: {
    marginTop: '20px',
  },
  navigation: {
    backgroundColor: '#33435d',
    color: '#FFF',
  },
  content: {
    height: '350px',
  },
});

class TasksCard extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    return (
      <Card className="summaryTrendingPortfolio">
        <CardHeader
          classes={{
            root: classes.cardHeader,
            // title: classes.cardTitle,
            content: classes.cardHeaderContent,
          }}
          // title="Tasks:"
          action={
            <Tabs
              classes={{
                flexContainer: classes.tabsContainer,
                containerHeader: classes.containerHeader,
              }}
              value={this.state.value}
              onChange={this.handleChange}
              indicatorClassName={classes.displayNone}
              textColor="inherit"
            >
              <Tab
                classes={{
                  wrapper: classes.tabWrapper,
                  // rootLabelIcon: classes.labelIcon,
                  label: classes.label,
                  rootInheritSelected: classes.rootInheritSelected,
                }}
                // icon={<BugReport className={classes.tabIcon} />}
                label="Portfolio"
              />

              <Tab
                classes={{
                  wrapper: classes.tabWrapper,
                  // rootLabelIcon: classes.labelIcon,
                  label: classes.label,
                  rootInheritSelected: classes.rootInheritSelected,
                }}
                // icon={<Code className={classes.tabIcon} />}
                label="Trending"
              />
            </Tabs>
          }
        />

        <CardContent>
          {this.state.value === 0 && (
            <Typography component="div">
              <Portfolio tableHead={[
                'Name',
                'Status',
              ]}
              />
            </Typography>
          )}

          {this.state.value === 1 && (
            <Typography component="div">
              <Trending tableHead={[
                'Ticker',
                '24H Change',
                '7D Change',
              ]}
              />
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }
}

TasksCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(tasksCardStyle, styles)(TasksCard);
