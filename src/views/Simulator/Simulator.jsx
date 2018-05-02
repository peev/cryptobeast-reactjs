import React from 'react';
import { Grid } from 'material-ui';
import { RegularCard, ItemGrid } from 'components';
import TransactionSimulator from '../../components/Cards/Simulator/TransactionSimulator';

import PortfoliosTable from '../../components/CustomTables/PortfoliosTable';
import CreatePortfolio from '../../components/Modal/CreatePortfolio';




function Simulator({ ...props }) {
  return (
    <Grid container>
      <ItemGrid xs={6} sm={6} md={6}>
        {/* <p>Simulator is under construction...</p>
        <TransactionSimulator /> */}

        <RegularCard
          cardTitle="TRANSACTION SIMULATOR"
          // button={<CreatePortfolio />}
          content={

            <TransactionSimulator
              // tableHead={[
              //   'Name',
              //   'Number of Shares',
              //   'Current share price',
              //   'Total Amount',
              //   '',
              // ]}
            // tableData={[
            //   ["Poloniex", "Inactive", "test", "test", ""],
            //   ["Poloniex", "Inactive", "test", "test", ""],
            //   ["Poloniex", "Inactive", "test", "test", ""],
            //   ["Poloniex", "Inactive", "test", "test", ""]
            // ]}
            />

          }
        />
      </ItemGrid>
    </Grid>
  );
}

export default Simulator;
