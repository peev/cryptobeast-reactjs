// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from 'material-ui';
import uuid from 'uuid/v4';
import { inject, observer } from 'mobx-react';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from '../../variables/styles/tableStyle';
import ConfirmationModal from '../Modal/ConfirmationModal';


type Props = {
  classes: Object,
  tableHeaderColor: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  tableHead: Array<string>,
  // tableData: Array<Array<string>>,
  PortfolioStore: {
    portfolios: Array<Object>,
    removePortfolio: (id: string) => any,
    updatePortfolio: (id: string, newName: string) => any,
  },
};

// TODO add Inject PortfolioStore and Remake function to const = () =>{}
@inject('PortfolioStore')
@observer
class PortfoliosTable extends React.Component<Props> {
  handleRemove = (id: string) => {
    this.props.PortfolioStore.removePortfolio(id);
    // console.log(id);
  }

  handleUpdate = (id: string, newName: string) => {
    this.props.PortfolioStore.updatePortfolio(newName, id);
  }

  render() {
    const {
      classes,
      tableHead,
      tableHeaderColor,
      PortfolioStore,
    } = this.props;
    const { portfolios } = PortfolioStore;

    const tableHeader = (
      <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
        <TableRow>
          {tableHead.map((prop: Object) => (
            <TableCell
              className={`${classes.tableCell} ${classes.tableHeadCell}`}
              key={uuid()}
            >
              {prop}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );

    // const itemsToArray = Object.values(portfolios);
    const filteredItems = portfolios.map((obj: Object) => [
      obj.name,
      obj.shares,
      null,
      null,
      null,
      null,
    ]);

    const tableInfo = filteredItems.map((prop: Object, key: number) => (
      <TableRow key={uuid()}>
        {prop.map((item: Object, ind: number) => {
          if (ind === 4) {
            return (
              <TableCell className={classes.tableCell} key={uuid()}>
                {item}
                <UpdatePortfolioModal onUpdate={(newName: string) => this.handleUpdate(portfolios[key].id, newName)} />
              </TableCell>
            );
          }
          if (ind === 5) {
            return (
              <TableCell className={classes.tableCell} key={uuid()}>
                {item}
                <ConfirmationModal onSave={() => this.handleRemove(portfolios[key].id)} message="Are you shure you want to delete this portfolio?" />
              </TableCell>
            );
          }
          return (
            <TableCell className={classes.tableCell} key={uuid()}>
              {item}
            </TableCell>
          );
        })}
      </TableRow>
    ));
    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? tableHeader : null}
          <TableBody>{tableInfo}</TableBody>
        </Table>
      </div>
    );
  }
}


export default withStyles(tableStyle)(PortfoliosTable);
