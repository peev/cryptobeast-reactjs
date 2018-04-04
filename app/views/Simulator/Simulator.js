import React from 'react';
import { Grid } from 'material-ui';
import { RegularCard, Table, ItemGrid } from 'components';
import ChartCard from '../../components/Cards/ChartCard';
import ChartistGraph from 'react-chartist';
import { AccessTime } from 'material-ui-icons';
import { emailsSubscriptionChart } from '../../variables/charts'


function Simulator({ ...props }) {
  return (
    <Grid container>
      <ItemGrid xs={8} sm={8} md={8}>
        <RegularCard
          cardTitle="Transaction Simulator"
          cardSubtitle="This is purely testing layout and manipulation!!!!"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={['Name', 'Country', 'City', 'Salary', 'Testingerys']}
              tableData={[
                ['Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738', 'this is all strings'],
                ['Minerva Hooper', 'Curaçao', 'Sinaai-Waas', '$23,789'],
                ['Sage Rodriguez', 'Netherlands', 'Baileux', '$56,142'],
                ['Philip Chaney', 'Korea, South', 'Overland Park', '$38,735'],
                ['Doris Greene', 'Malawi', 'Feldkirchen in Kärnten', '$63,542'],
                ['Mason Porter', 'Chile', 'Gloucester', '$78,615']
              ]}
            />
          }
        />
      </ItemGrid>
      <ItemGrid xs={4} sm={4} md={4} >
        <ChartCard
          chart={
            <ChartistGraph
              className="ct-chart"
              data={emailsSubscriptionChart.data}
              type="Bar"
              options={emailsSubscriptionChart.options}
              responsiveOptions={emailsSubscriptionChart.responsiveOptions}
              listener={
                emailsSubscriptionChart.animation
              }
            />
          }
          chartColor="orange"
          title="Email Subscriptions"
          text="Last Campaign Performance"
          statIcon={AccessTime}
          statText="campaign sent 2 days ago"
        />
      </ItemGrid>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          plainCard
          cardTitle="Table on Plain Background"
          cardSubtitle="Here is a subtitle for this table"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={['ID', 'Name', 'Country', 'City', 'Salary']}
              tableData={[
                ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                [
                  '4',
                  'Philip Chaney',
                  '$38,735',
                  'Korea, South',
                  'Overland Park'
                ],
                [
                  '5',
                  'Doris Greene',
                  '$63,542',
                  'Malawi',
                  'Feldkirchen in Kärnten'
                ],
                ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester']
              ]}
            />
          }
        />
      </ItemGrid>
    </Grid>
  );
}

export default Simulator;
