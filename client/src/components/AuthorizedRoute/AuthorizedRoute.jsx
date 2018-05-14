// @flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from './../../services/AuthService';

type Props = {
  component: React.ComponentType<*>,
};

export default ({
  component: ComponentToRender,
  ...rest
}: Props) => (
  <Route
    {...rest}
    render={(props: Object) => (
      AuthService.isAuthenticated()
        ? <ComponentToRender {...props} />
        : <Redirect to="/login" />
    )}
  />
);
