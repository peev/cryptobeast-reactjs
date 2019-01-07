// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Tooltip,
  TableSortLabel,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';
import moment from 'moment';
import tableStyle from '../../../variables/styles/tableStyle';
import AssignInvestor from '../../../components/Modal/InvestorModals/AssignInvestor';
import combineStyles from '../../../features/CombineStyles';

const styles = () => ({
  italic: {
    fontStyle: 'italic',
  },
});

type Props = {
  classes: Object,
  tableHead: Array<Object>,
  tableData: Array<Object>,
  tableHeaderColor: string,
  PortfolioStore: Object,
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


const findInvestor = (portfolioStore: Object, transaction: Object) => {
  if (transaction.investorId !== null) {
    if (portfolioStore.currentPortfolioInvestors.length > 0) {
      return portfolioStore.currentPortfolioInvestors.find((item: Object) => item.id === transaction.investorId).name;
    }
    return 'unassigned';
  }
  return 'unassigned';
};

function getInvestorSortableObject(portfolioStore: Object) {
  return (transaction: Object) => Object.assign({}, {
    id: transaction.id,
    name: findInvestor(portfolioStore, transaction),
    transactionDate: new Date(transaction.txTimestamp).getTime(),
    type: transaction.type === 'd' ? 'DEPOSIT' : 'WITHDRAW',
    amountUSD: transaction.totalValueUSD.toFixed(2),
    sharePrice: transaction.currentSharePriceUSD.toFixed(2),
    shares: transaction.sharesCreated !== null ? transaction.sharesCreated.toFixed(2) : transaction.sharesLiquidated.toFixed(2),
    // comission: investor.amountInUSD < 0 ?
    //   Math.abs((investor.amountInUSD * portfolioStore.currentPortfolioInvestors[findInvestorID(investor)].managementFee) / 100) : 0,
    transaction,
  });
}

const TableHeader = ({
  onRequestSort,
  order,
  orderBy,
  classes,
  tableHead,
  tableHeaderColor,
}: {
  onRequestSort: Function,
  order: string,
  orderBy: string,
  classes: Object,
  tableHead: Array<Object>,
  tableHeaderColor: string,
}) => {
  const createSortHandler = (property: string) => (event: Object) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
      <TableRow>
        {tableHead.map((headerItem: Object) => (
          <TableCell
            className={`${classes.tableCell} ${classes.tableHeadCell}`}
            key={headerItem.id}
            numeric={headerItem.numeric}
            padding={headerItem.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headerItem.id ? order : false}
          >
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
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};


@inject('PortfolioStore')
@observer
class AllInvestorTable extends React.Component<Props, State> {
  state = {
    order: 'desc',
    orderBy: 'dateOfEntry',
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
    const { classes, tableHead, tableData, tableHeaderColor, PortfolioStore } = this.props;
    const { order, orderBy } = this.state;


    const header = (
      <TableHeader
        order={order}
        orderBy={orderBy}
        onRequestSort={this.handleRequestSort}
        tableHead={tableHead}
        classes={classes}
        tableHeaderColor={tableHeaderColor}
      />
    );

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? header : null}
          <TableBody>
            {tableData
              .map(getInvestorSortableObject(PortfolioStore))
              .sort(getSorting(order, orderBy))
              .map((prop: Object) => (
                <TableRow key={uuid()}>
                  {Object.keys(prop).map((el: Object, key: number) => {
                    if (key > 7) return null;
                    if (key === 1) {
                      return (
                        <TableCell
                          className={`${classes.tableCell} ${prop.type === 'DEPOSIT' ? classes.positive : classes.negative}
                        ${prop.name === 'unassigned' ? classes.italic : ''}`}
                          key={uuid()}
                        >
                          {prop[el]}
                        </TableCell>
                      );
                    } if (key === 2) {
                      return (
                        <TableCell className={`${classes.tableCell} ${prop.type === 'DEPOSIT' ? classes.positive : classes.negative}`} key={uuid()}>
                          {moment(prop[el]).format('MMMM DD, YYYY HH:mm')}
                        </TableCell>
                      );
                    } if (key === 7) {
                      return (
                        <TableCell className={`${classes.tableCell}`} key={uuid()}>
                          {
                            prop.name === 'unassigned' ?
                              <AssignInvestor transaction={prop.transaction} />
                              :
                              null
                          }
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell className={`${classes.tableCell} ${prop.type === 'DEPOSIT' ? classes.positive : classes.negative}`} key={uuid()}>
                          {prop[el]}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const combinedStyles = combineStyles(tableStyle, styles);

export default withStyles(combinedStyles)(AllInvestorTable);
