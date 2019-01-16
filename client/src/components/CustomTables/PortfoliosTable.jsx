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
import uuid from 'uuid/v4';
import { inject, observer } from 'mobx-react';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from '../../variables/styles/tableStyle';

type Props = {
  classes: Object,
  tableHeaderColor: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  tableHead: Array<string>,
  // tableData: Array<Array<string>>,
  PortfolioStore: {
    portfolios: Array<Object>,
    updatePortfolio: (id: string, newName: string) => any,
  },
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

function createPortfolioSortableObjectFromArray(portfolioAsArray: Array) {
  if (portfolioAsArray.length === 6) {
    return {
      name: portfolioAsArray[0],
      numShares: portfolioAsArray[1],
      sharePrice: portfolioAsArray[2],
      totalUSD: portfolioAsArray[3],
      update: portfolioAsArray[4],
      id: portfolioAsArray[5],
    };
  }
  return null;
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
        {tableHead.map((headerItem: Object, index: number) => (
          <TableCell
            className={`${classes.tableCell} ${classes.tableHeadCell}`}
            key={headerItem.id}
            numeric={headerItem.numeric}
            padding={headerItem.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headerItem.id ? order : false}
          >
            {(() => {
              if (index > 1 && index < 5) {
                return headerItem.label;
              }
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

// TODO add Inject PortfolioStore and Remake function to const = () =>{}
@inject('PortfolioStore')
@observer
class PortfoliosTable extends React.Component<Props, State> {
  state = {
    order: 'desc',
    orderBy: 'numShares',
  };

  handleUpdate = (id: string, newName: string) => {
    this.props.PortfolioStore.updatePortfolio(newName, id);
  }

  handleRequestSort = (event: Object, property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  render() {
    const {
      classes,
      tableHead,
      tableHeaderColor,
      PortfolioStore,
    } = this.props;
    const { portfolios } = PortfolioStore;
    
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

    // const itemsToArray = Object.values(portfolios);
    const filteredItems = portfolios.map((obj: Object) => [
      obj.name || obj.userAddress,
      obj.shares,
      PortfolioStore.getPortfolioData(obj.id) || 5,// share price
      null, // total USD
      null, // remove
      obj.id, // this will be hidden from table rows / cols. Find it with (arr[arr.length - 1])
    ]);

    const tableInfo = filteredItems
      .map(createPortfolioSortableObjectFromArray)
      .sort(getSorting(order, orderBy))
      .map((portfolio: Object) => (
        <TableRow key={uuid()}>
          {Object.values(portfolio).map((item: Object, ind: number, arr: Array) => {
            if (ind === 4) {
              return (
                <TableCell className={classes.tableCell} key={uuid()}>
                  {item}
                  <UpdatePortfolioModal onUpdate={(newName: string) => this.handleUpdate(arr[arr.length - 1], newName)} />
                </TableCell>
              );
            }
            if (ind < 5) {
              return (
                <TableCell className={classes.tableCell} key={uuid()}>
                  {item}
                </TableCell>
              );
            }
            return null;
          })}
        </TableRow>
      ));
    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? header : null}
          <TableBody>{tableInfo}</TableBody>
        </Table>
      </div>
    );
  }
}


export default withStyles(tableStyle)(PortfoliosTable);
