// @flow
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
// import Paper from 'material-ui/Paper';

const styles = () => ({
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(
  day: string,
  date: string,
  portfolio: number,
  portfolioReturn: string,
  benchmark: number,
  benchmarkReturn: string,
  exessReturn: string,
) {
  id += 1;
  return {
    id,
    day,
    date,
    portfolio,
    portfolioReturn,
    benchmark,
    benchmarkReturn,
    exessReturn,
  };
}

type Props = {
  classes: Object,
};

const data = [
  createData('1', '31-12-2017', 1.0, '-', 1.0, '-', '-'),
  createData('2', '01-01-2018', 1.12, `${12.0} %`, 1.06, `${6.0}%`, `${6.0}%`),
  createData('3', '01-02-2018', 0.94, `${6.12}%`, 1.02, `${2.0}%`, `${8.12}%`),
];

function PerformanceTable(props: Props) {
  const { classes } = props;

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>DAY</TableCell>
          <TableCell numeric>DATE</TableCell>
          <TableCell numeric>PORTFOLIO</TableCell>
          <TableCell numeric>PORTFOLIO RETURN (*)</TableCell>
          <TableCell numeric>BENCHMARK</TableCell>
          <TableCell numeric>BENCHMARK RETURN(*)</TableCell>
          <TableCell numeric>EXESS RETURN</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((n: Object) => (
          <TableRow key={n.id}>
            <TableCell>{n.day}</TableCell>
            <TableCell numeric>{n.date}</TableCell>
            <TableCell numeric>{n.portfolio}</TableCell>
            <TableCell numeric>{n.portfolioReturn}</TableCell>
            <TableCell numeric>{n.benchmark}</TableCell>
            <TableCell numeric>{n.benchmarkReturn}</TableCell>
            <TableCell numeric>{n.exessReturn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default withStyles(styles)(PerformanceTable);
