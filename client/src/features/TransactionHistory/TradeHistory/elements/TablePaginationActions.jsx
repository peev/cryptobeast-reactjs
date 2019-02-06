// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '../../../../components/CustomIcons/TablePagination/FirstPageIcon';
import LastPageIcon from '../../../../components/CustomIcons/TablePagination/LastPageIcon';
import KeyboardArrowLeft from '../../../../components/CustomIcons/TablePagination/KeyboardArrowLeft';
import KeyboardArrowRight from '../../../../components/CustomIcons/TablePagination/KeyboardArrowRight';


type Props = {
  classes: Object,
  theme: Object,
  onChangePage: Function,
  page: number,
  count: number,
  rowsPerPage: number,
};

const actionsStyles = (theme: Object) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
  divider: {
    display: 'inline-flex',
    // width: '48px', // without width will not display
    height: '48px',
    verticalAlign: 'middle',
    justifyContent: 'center',
  },
});

class TablePaginationActions extends React.Component<Props> {
  handleFirstPageButtonClick = (event: Event) => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = (event: Event) => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = (event: Event) => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = (event: Event) => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <div className={classes.divider} />
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

export default withStyles(actionsStyles, { withTheme: true })(TablePaginationActions);
