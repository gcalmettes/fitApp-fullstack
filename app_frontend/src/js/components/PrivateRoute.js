import React from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({ component: Component, authentication, ...rest }) => {
  const isAuthorized = authentication && authentication.access_token
  return (
    <Route
      {...rest}
      render={props => isAuthorized 
        ? <Component {...props} />
        : <Redirect to={{pathname: "/login", state: { from: props.location }}}/>
      }
    />
  );
}


const mapStateToProps = ({ authentication }) => ({ authentication })

const connectedPrivateRoute = connect(mapStateToProps)(PrivateRoute);
export { connectedPrivateRoute as PrivateRoute };