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
import IconButton from "../CustomButtons/IconButton";
import UpdatePortfolioModal from "../Modal/UpdatePortfolio";
import tableStyle from "../../variables/styles/tableStyle";

function PortfoliosTable({ ...props }) {
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
                  if (4 == key) {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                        <UpdatePortfolioModal
                          style={{ display: "inline-block" }}
                        />
                        <IconButton
                          color="primary"
                          customClass="remove"
                          style={{
                            display: "inline-block",
                            width: ".8em",
                            height: ".8em"
                          }}
                        >
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

PortfoliosTable.defaultProps = {
  tableHeaderColor: "gray"
};

PortfoliosTable.propTypes = {
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

export default withStyles(tableStyle)(PortfoliosTable);
