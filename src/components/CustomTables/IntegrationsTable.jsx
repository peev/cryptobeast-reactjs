import React from "react";
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "material-ui";

import PropTypes from "prop-types";

import { Edit, Close } from "material-ui-icons";
import  IconButton  from '../CustomButtons/IconButton';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from "../../variables/styles/tableStyle";

function IntegrationsTable({ ...props }) {
  const { classes, tableHead, tableData, tableHeaderColor } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key}>
                {prop.map((prop, key) => {
                  if (2 == key) {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                        <UpdatePortfolioModal />
                      </TableCell>
                    );
                  }
                  if(3 <= key) {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                        <IconButton color="primary" customClass="remove" >
                          <Close />
                        </IconButton>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

IntegrationsTable.defaultProps = {
  tableHeaderColor: "gray"
};

IntegrationsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(tableStyle)(IntegrationsTable);
