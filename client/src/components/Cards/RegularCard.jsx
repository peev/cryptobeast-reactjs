// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import cx from 'classnames';

import regularCardStyle from './../../variables/styles/regularCardStyle';


type Props = {
  plainCard: boolean,
  classes: Object,
  headerColor: 'orange' | 'green' | 'red' | 'blue' | 'purple' | 'default',
  cardTitle: string,
  cardSubtitle: React.ComponentType<any>,
  content: React.ComponentType<any>,
  button: React.ComponentType<any>,
};

function RegularCard({ ...props }: Props) {
  const {
    classes,
    headerColor = 'default',
    plainCard,
    cardTitle,
    cardSubtitle,
    content,
    button,
  } = props;

  const plainCardClasses = cx({
    [` ${classes.cardPlain}`]: plainCard,
  });

  const cardPlainHeaderClasses = cx({
    [` ${classes.cardPlainHeader}`]: plainCard,
  });

  return (
    <Card className={classes.card + plainCardClasses}>
      <CardHeader
        classes={{
          root: `${classes.cardHeader} ${classes[headerColor + "CardHeader"]}${cardPlainHeaderClasses}`, //eslint-disable-line
          title: classes.cardTitle,
          subheader: classes.cardSubtitle,
        }}
        title={cardTitle}
        subheader={cardSubtitle}
      />
      <CardContent>{button}{content}</CardContent>
    </Card>
  );
}

export default withStyles(regularCardStyle)(RegularCard);
