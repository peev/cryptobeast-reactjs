import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from 'material-ui';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import tableStyle from '../../variables/styles/tableStyle';
import UpArrowIcon from '../CustomIcons/UpArrowIcon';
import DownArrowIcon from '../CustomIcons/DownArrowIcon';

const styles = () => ({
  paper: {
    padding: '15px',
  },
  tableHead: {
    borderBottom: '1px solid black',
  },
  tableCell: {
    paddingRight: '24px',
    borderBottom: 'none',
  },
  progressBar: {
    width: '100px',
    height: '25px',
    backgroundColor: '#092749',
    position: 'relative',
    '&:before': {
      top: '2px',
      left: '0',
      right: '0',
      content: 'attr(data-label)',
      color: 'white',
      position: 'absolute',
      textAlign: 'center',
    },
  },
  value: {
    backgroundColor: '#0eff00',
    display: 'inline-block',
    height: '100%',
  },
  upArrow: {
    paddingTop: '7px',
    fill: '#0eff00',
  },
  downArrow: {
    paddingTop: '7px',
    fill: '#ca3f58',
  },
  change: {
    margin: '0',
    display: 'inline-block',
    verticalAlign: 'text-bottom',
  },
  changeNoIcon: {
    margin: '0',
    display: 'inline-block',
    verticalAlign: 'text-bottom',
    paddingLeft: '25px',
  },
});

const PortfolioSummaryTable = inject('PortfolioStore')(observer(({ ...props }) => {
  const { classes, tableHead, PortfolioStore } = props;

  const tableHeadContent = (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {tableHead.map((prop, key) => {
          return (
            <TableCell
              className={`${classes.tableCell} ${classes.tableHeadCell}`}
              key={key}
            >
              {prop}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
  const currentDisplayAssets = (PortfolioStore.selectedPortfolio &&
    PortfolioStore.summaryPortfolioAssets !== 0) ?
    PortfolioStore.summaryPortfolioAssets :
    [[' ', 0, 0, 0, 0, 0, 0, 0]];

  const tableBodyContent = currentDisplayAssets.map((el, key) => {
    return (
      <TableRow key={key}>
        {el.map((prop, i) => {
          if (i === 5) {
            return (
              <TableCell className={classes.tableCell} key={i}>
                <div className={classes.progressBar} data-label={`${prop}%`}>
                  <span className={classes.value} style={{ width: `${prop}px` }} />
                </div>
              </TableCell>
            );
          }
          if ((i === 6 || i === 7) && parseFloat(prop) !== 0 && prop !== undefined) {
            if (prop === 'n/a') {
              return (
                <TableCell className={classes.tableCell} key={i} >
                  <p className={classes.changeNoIcon}>{prop}</p>
                </TableCell>
              );
            }

            return (
              <TableCell className={classes.tableCell} key={i} >
                {/* sets the arrow based on the passed value */}
                {parseFloat(prop) > 0 ?
                  <UpArrowIcon className={classes.upArrow} /> :
                  <DownArrowIcon className={classes.downArrow} />}
                <p className={classes.change}>{prop}</p>
              </TableCell>
            );
          }

          return (
            <TableCell className={classes.tableCell} key={i}>
              {prop}
            </TableCell>
          );
        })}
      </TableRow >
    );
  });

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} style={{ tableLayout: 'auto' }} >
        {tableHead !== undefined ? tableHeadContent : null}
        <TableBody>
          {tableBodyContent}
        </TableBody>
      </Table>
    </Paper >
  );
}))

PortfolioSummaryTable.defaultProps = {
  tableHeaderColor: 'gray'
};

PortfolioSummaryTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray'
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(styles, tableStyle)(PortfolioSummaryTable);
