import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Switch , Route, Redirect } from 'react-router-dom';
import Login from './Admin/Login/Login';
import Cookies from 'js-cookie';
import Dashboard from './Admin/Dashboard/Dashboard';
import AdminSignup from './Admin/Admin/AdminSignup';
import Error404 from './Admin/Error/Error404';
import DeliveryLogin from './Delivery/Login/DeliveryLogin';
import DashboardDelivery from './Delivery/Dashboard/DashboardDelivery';
import CourierSignup from './Delivery/Signup/CourierSignup';


class App extends Component {
  render() {
    return ( 
      <div className="container-fluid">
        <div className="row App">
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component= {Login} />
              <Route path="/delivery-login" exact component= {DeliveryLogin} />
              <Route path="/404" exact component= {Error404} />
              <Route path="/signup/:verif_code?/:email" exact component= {AdminSignup} />
              <Route path="/courier-signup/:verif_code?/:email" exact component= {CourierSignup} />
              <PrivateRoute path="/Dashboard" component= {Dashboard} />
              <PrivateDeliveryRoute path="/delivery" component= {DashboardDelivery} />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
function CheckAuth(){
  console.log("Test");
  var token = Cookies.get("_token_admin");
  var session = Cookies.get("sessionID_admin");
  if(token !== undefined&&session !== undefined){
      return true;
  }else{
      return false;
  }
}
function CheckDeliveryAuth(){
  var token = Cookies.get("_token_admin_delivery");
  var session = Cookies.get("sessionID_admin_delivery");
  if(token !== undefined&&session !== undefined){
      return true;
  }else{
      return false; 
  }
}
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (CheckAuth()? <Component {...props} /> : <Redirect to='/' />)} />
)
const PrivateDeliveryRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (CheckDeliveryAuth()? <Component {...props} /> : <Redirect to='/delivery-login' />)} />
)

export default App;
