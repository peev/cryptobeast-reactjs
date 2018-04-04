import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from 'material-ui';

import PropTypes from 'prop-types';

import { inject, observer } from 'mobx-react';
import { Close } from 'material-ui-icons';
import IconButton from '../CustomButtons/IconButton';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from '../../variables/styles/tableStyle';
import RemovePortfolioWrapped from '../Modal/RemovePortfolio';

// TODO add Inject PortfolioStore and Remake function to const = () =>{}
@inject('PortfolioStore')
@observer

class PortfoliosTable extends React.Component {
  state = {
    open: false,
  };

  // handleDelete = () => {
  //   this.props.PortfolioStore.deletePortfolio();
  // };
  handleOpen = (id) => {
   
//    this.props.PortfolioStore.removePortfolio(id);
    this.props.PortfolioStore.selectPortfolio(id);
    console.log(id);

  };
  handleRemove = (id) => {
    
    this.props.PortfolioStore.removePortfolio(id);
    console.log(id);
  }


  render() {
    const {
      classes,
      tableHead,
      tableData,
      tableHeaderColor,
      PortfolioStore,
    } = this.props;
    const portfolios = PortfolioStore.portfolios;

    const tableHeader = (
      <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
        <TableRow>
          {tableHead.map((prop, key) => (
            <TableCell
              className={`${classes.tableCell} ${classes.tableHeadCell}`}
              key={key}
            >
              {prop}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );

    const itemsToArray = Object.values(portfolios);
    const filteredItems = itemsToArray.map(obj => [
      obj.name,
      obj.shares,
      null,
      null,
      null,
    ]);

    const tableInfo = filteredItems.map((prop, key) => (

      <TableRow key={key}>
        {prop.map((item, ind) => {
          console.log(portfolios[key].id);
          // if () {
          //   return;
          // }
          if (ind === 4) {
            return (
              <TableCell className={classes.tableCell} key={ind}>
                {item}
                <UpdatePortfolioModal />
                {/* <RemovePortfolioWrapped
                  onClick={() => this.handleRemove(portfolios[key].id)} /> */}
                <IconButton
                  onClick={() => this.handleRemove(portfolios[key].id)}
                  color="primary"
                  customClass="remove"
                >
                  <Close />
                </IconButton>
              </TableCell>
            );
          }
          return (
            <TableCell className={classes.tableCell} key={ind}>
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

PortfoliosTable.defaultProps = {
  tableHeaderColor: 'gray',
};

PortfoliosTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default withStyles(tableStyle)(PortfoliosTable);
