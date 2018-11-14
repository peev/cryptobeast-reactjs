// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Tooltip,
  TableSortLabel,
} from '@material-ui/core';
import uuid from 'uuid/v4';
import { inject, observer } from 'mobx-react';
import tableStyle from '../../variables/styles/tableStyle';
import UpArrowIcon from '../CustomIcons/Summary/UpArrowIcon';
import DownArrowIcon from '../CustomIcons/Summary/DownArrowIcon';
import BigNumberService from '../../services/BigNumber';


const styles = () => ({
  paper: {
    // margin: '40px 30px 0',
    padding: '20px 25px',
  },
  tableHead: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    borderBottom: '1px solid black',
    '& th': {
      // textTransform: 'uppercase',
      fontSize: '14px',
      fontWeight: '700',
      color: '#212121',
    },
  },
  tableCell: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    paddingRight: '24px',
    borderBottom: 'none',
  },
  progressBar: {
    width: '100px',
    height: '25px',
    backgroundColor: '#757575',
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
    backgroundColor: '#3ec39d',
    display: 'inline-block',
    height: '100%',
  },
  upArrow: {
    // paddingTop: '7px',
    fill: '#0eff00',
    position: 'relative',
    top: '3px',
    left: '-1px',
  },
  downArrow: {
    // paddingTop: '7px',
    fill: '#ca3f58',
    position: 'relative',
    top: '3px',
    left: '-1px',
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

type Props = {
  classes: Object,
  tableHead: Array<string>,
  PortfolioStore: Object,
  MarketStore: Object,
};

type State = {
  order: string,
  orderBy: string,
};

function getSorting(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Object, b: Object) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a: Object, b: Object) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

function getChange24H(allCurrencies: Array, assetAsArray: Array) {
  return Number(allCurrencies.find((currency: object) => currency.tokenName === assetAsArray.tokenName).change24H).toFixed(2) || 0;
}

function getChange7D(allCurrencies: Array, assetAsArray: Array) {
  return Number(allCurrencies.find((currency: object) => currency.tokenName === assetAsArray.tokenName).change7D).toFixed(2) || 0;
}

function createAssetObjectFromArray(assetAsArray: Array, allCurrencies: Array) {
  // eslint-disable-next-line prefer-destructuring
  const { decimals } = allCurrencies.find((currency: object) => currency.tokenName === assetAsArray.tokenName);
  return {
    ticker: assetAsArray.tokenName,
    balance: BigNumberService.toNumber(BigNumberService.tokenToEth(assetAsArray.balance, decimals)),
    priceETH: BigNumberService.toNumber(assetAsArray.lastPriceETH),
    priceUSD: BigNumberService.toNumber(assetAsArray.lastPriceUSD),
    totalUSD: BigNumberService.toNumber(BigNumberService.tokenToEth(assetAsArray.totalUSD, decimals)),
    assetWeight: BigNumberService.toNumber(assetAsArray.weight),
    '24Change': getChange24H(allCurrencies, assetAsArray),
    '7Change': getChange7D(allCurrencies, assetAsArray),
  };
}

const TableHeader = ({
  onRequestSort,
  order,
  orderBy,
  classes,
  tableHead,
}: {
  onRequestSort: Function,
  order: string,
  orderBy: string,
  classes: Object,
  tableHead: Array<Object>,
}) => {
  const createSortHandler = (property: string) => (event: Object) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {tableHead.map((headerItem: Object) => (
          <TableCell
            className={`${classes.tableCell} ${classes.tableHeadCell}`}
            key={headerItem.id}
            numeric={headerItem.numeric}
            padding={headerItem.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headerItem.id ? order : false}
          >
            {(() => {
              // if (index === 7) {
              //   return headerItem.label;
              // }
              return (
                <Tooltip
                  title="Sort"
                  placement={headerItem.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === headerItem.id}
                    direction={order}
                    onClick={createSortHandler(headerItem.id)}
                  >
                    {headerItem.label}
                  </TableSortLabel>
                </Tooltip>
              );
            })()}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
@inject('PortfolioStore', 'MarketStore')
@observer
class PortfolioSummaryTable extends React.Component<Props, State> {
  state = {
    order: 'desc',
    orderBy: 'totalUSD',
  };

  handleRequestSort = (event: Object, property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes, tableHead, PortfolioStore, MarketStore } = this.props;
    const { order, orderBy } = this.state;

    const header = (
      <TableHeader
        order={order}
        orderBy={orderBy}
        onRequestSort={this.handleRequestSort}
        tableHead={tableHead}
        classes={classes}
      />
    );

    const tableBodyContent = PortfolioStore.currentPortfolioAssets
      .map((assetsArray: Array) => createAssetObjectFromArray(assetsArray, MarketStore.allCurrencies))
      .sort(getSorting(order, orderBy))
      .map((ROW: Object) => (
        <TableRow key={uuid()}>
          {Object.values(ROW).map((COL: Object, i: number) => {
            if (i === 1 || i === 2) {
              return (
                <TableCell className={classes.tableCell} key={uuid()}>
                  {BigNumberService.toFixed(COL)}
                </TableCell>
              );
            }
            if (i === 3 || i === 4) {
              return (
                <TableCell className={classes.tableCell} key={uuid()}>
                  {BigNumberService.toFixedParam(COL, 2)}
                </TableCell>
              );
            }
            if (i === 5) {
              return (
                <TableCell className={classes.tableCell} key={uuid()}>
                  <div className={classes.progressBar} data-label={`${BigNumberService.toFixedParam(COL, 2)}%`}>
                    <span className={classes.value} style={{ width: `${COL}px` }} />
                  </div>
                </TableCell>
              );
            }
            if ((i === 6 || i === 7) && parseFloat(COL) !== 0 && COL !== undefined) {
              if (COL === 'n/a') {
                return (
                  <TableCell className={classes.tableCell} key={uuid()} >
                    <p className={classes.changeNoIcon}>{COL}</p>
                  </TableCell>
                );
              }

              return (
                <TableCell className={classes.tableCell} key={uuid()} >
                  {/* sets the arrow based on the passed value */}
                  {parseFloat(COL) > 0 ?
                    <UpArrowIcon className={classes.upArrow} /> :
                    <DownArrowIcon className={classes.downArrow} />}
                  <p className={classes.change}>{COL}%</p>
                </TableCell>
              );
            }

            return (
              <TableCell className={classes.tableCell} key={uuid()}>
                {COL}
              </TableCell>
            );
          })}
        </TableRow>
      ));

    return (
      <Paper className={classes.paper}>
        <Table className={classes.table} style={{ tableLayout: 'auto' }} >
          {tableHead !== undefined ? header : null}
          <TableBody>
            {tableBodyContent}
          </TableBody>
        </Table>
      </Paper >
    );
  }
}

export default withStyles(styles, tableStyle)(PortfolioSummaryTable);
