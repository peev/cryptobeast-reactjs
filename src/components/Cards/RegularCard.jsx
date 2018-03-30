import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  // CardActions,
} from 'material-ui';
import PropTypes from 'prop-types';
import cx from 'classnames';

import regularCardStyle from 'variables/styles/regularCardStyle';

function RegularCard({ ...props }) {
  const {
    classes,
    headerColor,
    plainCard,
    cardTitle,
    cardSubtitle,
    content,
    button,
  } = props;

  const plainCardClasses = cx({
    [' ' + classes.cardPlain]: plainCard,
  });

  const cardPlainHeaderClasses = cx({
    [' ' + classes.cardPlainHeader]: plainCard,
  });

  return (
    <Card className={classes.card + plainCardClasses}>
      <CardHeader
        classes={{
          root:
            `${classes.cardHeader
            } ${
            classes[headerColor + "CardHeader"]
            }${cardPlainHeaderClasses}`,
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

RegularCard.defaultProps = {
  headerColor: 'default',
};

RegularCard.propTypes = {
  plainCard: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  headerColor: PropTypes.oneOf(['orange', 'green', 'red', 'blue', 'purple','default']),
  cardTitle: PropTypes.node,
  cardSubtitle: PropTypes.node,
  content: PropTypes.node,
  button: PropTypes.node,

};

export default withStyles(regularCardStyle)(RegularCard);
