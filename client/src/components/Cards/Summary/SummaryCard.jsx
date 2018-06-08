// @flow
import React, { SyntheticEvent } from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Popover,
} from 'material-ui';
import { Info } from '@material-ui/icons';


import statsCardStyle from './../../../variables/styles/statsCardStyle';

const styles = () => ({
  cardContainer: {
    width: '18%',
    marginTop: '20px',
  },
  cardHeader: {
    float: 'left',
    margin: '0 10px',
    marginTop: '-10px',
    backgroundColor: '#272B3F',
    '& :first-child': {
      height: '24px',
      margin: '0 auto',
    },
  },
  icon: {
    color: 'white',
  },
  cardContent: {
    paddingTop: '10px',
    textAlign: 'right',
  },
  cardTitle: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
  },
  cardDescriptionNormal: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    paddingTop: '7px',
  },
  cardDescriptionPositive: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    paddingTop: '7px',
    color: '#70A800',
  },
  cardDescriptionNegative: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    paddingTop: '7px',
    color: '#B94A48',
  },
  input: {
    width: '100%',
  },
  info: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paper: {
    padding: '20px',
  },
  popover: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    pointerEvents: 'none',
  },
  popperClose: {
    pointerEvents: 'none',
  },
  hidden: {
    visibility: 'hidden',
  },
  color: {
    color: '#3BB3E4',
  },
});

type Props = {
  classes: Object,
  title: string,
  description: string,
  infoMessage: string,
  hasInfo: boolean,
};


class SummaryCard extends React.Component<Props> {
  /**
   * converts the given percent of profit/loss and makes it into number
   * depends if its positive or negative, return appropriate class name
   */
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = (event: SyntheticEvent) => {
    this.setState({ anchorEl: event.target });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      classes,
      title,
      description,
      hasInfo,
      infoMessage,
    // iconColor,
    } = this.props;
    const { anchorEl } = this.state;
    const open = !!anchorEl;
    const totalProfitLoss = () => {
      const result = parseFloat(description.slice(0, description.length - 1));

      if (title === 'Total profit/loss' && result > 0) {
        return classes.cardDescriptionPositive;
      } else if (title === 'Total profit/loss' && result < 0) {
        return classes.cardDescriptionNegative;
      }

      return classes.cardDescriptionNormal;
    };

    return (
    <Card className={classes.cardContainer}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<this.props.icon className={classes.icon} />}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.cardTitle}>
          {title}
        </Typography>
        <div className={classes.info}>
        <IconButton
          className={hasInfo ? classes.color : classes.hidden}
        >
            <Info
              fill="#3BB3E4"
              onMouseOver={this.handlePopoverOpen}
              onFocus={this.handlePopoverOpen}
              onMouseOut={this.handlePopoverClose}
              onBlur={this.handlePopoverClose}
            />
        </IconButton>
        <Popover
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <Typography className={classes.cardTitle}>{infoMessage}</Typography>
        </Popover>
        <Typography
          type="headline"
          component="h2"
          className={title === 'Total profit/loss' ? totalProfitLoss() : classes.cardDescriptionNormal}
        >
          {description}
        </Typography>
        </div>
      </CardContent>
    </Card>
    );
  }
}

export default withStyles(styles, statsCardStyle)(SummaryCard);
