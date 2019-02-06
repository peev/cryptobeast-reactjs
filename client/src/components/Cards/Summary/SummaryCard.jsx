// @flow
import React, { SyntheticEvent } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Info from '@material-ui/icons/Info';
import statsCardStyle from './../../../variables/styles/statsCardStyle';

const styles = () => ({
  cardContainer: {
    width: '18%',
    minWidth: '150px',
    height: 'auto',
    overflow: 'unset',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& path': {
      fill: '#133140',
    },
  },
  cardHeader: {
    position: 'relative',
    top: '-20px',
    left: '15px',
    height: '60px',
    width: '60px',
    backgroundColor: '#fff',
    border: '1px solid #133140',
    padding: '0',
  },
  icon: {
    color: 'white',
    fontSize: '35px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 15px 0 15px',
    textAlign: 'right',
  },
  cardTitle: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    fontSize: '13.3px',
    marginBottom: '35px',
  },
  cardDescriptionNormal: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    fontSize: '20px',
    fontWeight: '700',
  },
  cardDescriptionPositive: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    color: '#70A800',
    fontSize: '20px',
    fontWeight: '700',
  },
  cardDescriptionNegative: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    color: '#B94A48',
    fontSize: '20px',
    fontWeight: '700',
  },
  input: {
    width: '100%',
  },
  paper: {
    padding: '20px',
  },
  popover: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    pointerEvents: 'none',
    marginTop: '15px',
  },
  popperClose: {
    pointerEvents: 'none',
  },
  hidden: {
    // visibility: 'hidden',
    display: 'none',
  },
  color: {
    color: '#3BB3E4',
    position: 'relative',
    top: '-11px',
  },
  infoMessage: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    fontSize: '13.3px',
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
              <Typography className={classes.infoMessage}>{infoMessage}</Typography>
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
