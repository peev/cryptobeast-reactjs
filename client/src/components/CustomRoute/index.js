// @flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';


type Props = {
  component: React.ComponentType<*>,
  PortfolioStore: Object,
  UserStore: Object
};


@inject('PortfolioStore', 'UserStore')
@observer // eslint-disable-next-line
class CustomRoute extends React.Component<Props> {
  render() {
    const { PortfolioStore, UserStore, component: ComponentToRender, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props: Object) => (
          PortfolioStore.portfolios.length > 0
            ? <ComponentToRender {...props} />
            : <Redirect to="/" />)
        }
      />
    );
  }
}

export default CustomRoute;
