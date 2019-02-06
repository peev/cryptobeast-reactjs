/* globals document */
// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Info from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';
import history from '../../services/History';

const styles = () => ({
  containerOuter: {
    position: 'absolute',
    right: '30px',
  },
  containerInner: {
    position: 'relative',
  },
  popUpTextContainer: {
    position: 'absolute',
    top: '60px',
    right: '-70px',
    width: '200px',
    zIndex: '1',
    '&:after': {
      position: 'absolute',
      content: '""',
      right: 'calc(50% - 13px)',
      width: '0',
      height: '0',
      boxSizing: 'border-box',
      border: '0.6em solid black',
      borderColor: '#fff #fff transparent transparent ',
      transformOrigin: '0 0',
      transform: 'rotate(-45deg)',
      boxShadow: '2px -2px 3px 0 rgba(0, 0, 0, 0.2)',

    },
  },
  popUpTextInner: {
    width: '200px',
    padding: '15px 30px',
    fontSize: '14px',
    lineHeight: '16px',
    boxShadow: '-1px 1px 14px 2px rgba(0, 0, 0, 0.4)',
  },
  marginNone: {
    margin: '0',
  },
  mainColor: {
    color: '#3BB3E4',
  },
  link: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

type Props = {
  classes: Object,
};

class ClickablePopup extends React.Component<Props, State> {
  state = { open: false };

  handleClick = () => {
    if (!this.state.open) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState({ open: !this.state.open });
  }

  handleOutsideClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }

    this.handleClick();
  }

  handleRedirectUser = () => {
    document.removeEventListener('click', this.handleOutsideClick, false);

    history.push('/Settings');
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.containerOuter}>
        <div
          className={classes.containerInner}
          ref={(node: HTMLDivElement) => { this.node = node; }}
        >
          <IconButton onClick={this.handleClick} className={classes.mainColor}>
            <Info />
          </IconButton>
          {this.state.open ?
            <Grid container className={classes.popUpTextContainer}>
              <Paper className={classes.popUpTextInner}>
                <p className={classes.marginNone}>
                  Allocation not allowed - assets in selected portfolio. Please add assets manually (use menu above) or via an
                </p>
                <a
                  onClick={this.handleRedirectUser}
                  className={`${classes.link} ${classes.marginNone} ${classes.mainColor}`}
                >
                  exchange API
                </a>
              </Paper>
            </Grid>
            : ''}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ClickablePopup);
