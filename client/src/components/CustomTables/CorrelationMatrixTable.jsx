// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import uuid from 'uuid/v4';

const styles = (theme: Object) => ({
  root: {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '700px'
  },
  center: {
    textAlign: 'center'
  },
  right: {
    textAlign: 'right'
  },
	miniCell: {
    'width': '75px',
    'padding': '4px 20px 4px 20px'
	},
});

type Props = {
  classes: Object,
  data: Array
};

class CorrelationMatrixTable extends React.Component<Props, State> {

  getCells(data, column) {
    const { classes } = this.props;
    return [
      <TableCell className={classes.miniCell} key={uuid()}>{column}</TableCell>,
      Object.keys(data).map((key) => {
        return (
          <TableCell className={classes.miniCell} key={uuid()}>{data[key].toFixed(3)}</TableCell>
        )
      })
    ]
  }

  render() {
    const { classes, data } = this.props;
    if (data.length === 0) {
      return null;
    }
    let columns = [];
    for (let col in data[0]) {
      columns.push(col);
    }

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.miniCell}></TableCell>
              {
                columns.map((el) => {
                  return (
                    <TableCell className={classes.miniCell} key={uuid()}>{el}</TableCell>
                  )
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map((key, index) => {
                return (
                  <TableRow className={classes.miniCell} key={uuid()}>
                    {
                      this.getCells(key, columns[index])
                    }
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(CorrelationMatrixTable);
