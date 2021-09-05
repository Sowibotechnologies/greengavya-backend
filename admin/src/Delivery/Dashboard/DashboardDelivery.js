import React, { Component } from 'react';
import './Dashboard.css';
import {Switch , Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import SideNavigationDelivery from '../Navigation/SideNavigationDelivery';
import TopNavigationDelivery from '../Navigation/TopNavigationDelivery';
import HomeDelivery from './HomeDelivery';
import Orders from '../Orders/Orders';
import PickedOrder from '../Orders/PickedOrder';
import AllOrders from '../Orders/AllOrders';

class DashboardDelivery extends Component {
    state = {
        userdata : "",
        toggle : false,
        curr_order: ""
    }
    authoriseToken(){
        var token = Cookies.get('_token_admin');
        fetch('/api/admin/authorisetoken',{
            headers:{
                "token" : token
            }
          })
          .then(res => {
              if(res.status === 200){
                  return res.json();
              }
          })
          .then(result => {
            if(result.status === "Success"){
              return true;
            }
            else{
              return false;
            }
          })
    }
    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
        this.setState({loggedIn:false});
    }
    componentDidMount(){
        this.getUserData();
        this.props.history.push('/Delivery/home');
    }
    onToggle(e){
        this.setState({
            toggle: e
        });
    }
    getUserData(){
        var token = Cookies.get('_token_admin_delivery');
        fetch('/api/admin/getuserbytoken',{
            headers:{
                "token" : token
            }
        })
        .then(res => {
            if(res.status === 200){
                return res.json();
            }
        })
        .then(result => {
           this.setState({
               userdata:result
           })
           this.getActiveOrder(result.user_id);
           setTimeout(()=>{this.render();},200);
        })
    }
    getActiveOrder(courierID){
        var token = Cookies.get('_token_admin_delivery');
        fetch('/api/delivery/getactiveorder',{
            method:'POST',
            body : JSON.stringify({courierid: courierID}),
            headers:{
                "Content-Type": "application/json",
                "token" : token
            }
        })
        .then(res => {
            if(res.status === 200){
                return res.json();
            }
        })
        .then(result => {
           this.setState({curr_order:result[0].current_order})
        })
    }
  render() {
    return (
        <React.Fragment>
            <div className={this.state.toggle ? "active": ""}>

                {/* <div id="sidebar-wrapper">
                     <SideNavigationDelivery/>
                </div> */}
                <div id="page-content-wrapper">
                    <div class="page-content">
                        <TopNavigationDelivery toggleFlag={this.onToggle.bind(this)}  user={this.state.userdata.name}/>
                        <div class="container-fluid" style={{paddingLeft:'0px',paddingRight:'0px'}}>
                                <div class="container-fluid dash-header">
                                        <a class="visible-xs" data-toggle="offcanvas"><i class="fa fa-lg fa-reorder"></i></a>
                                        <div class="dash-counter" style={{width:'100%',marginTop:'90px'}}>
                                            <Switch>
                                                <Route path="/Delivery/home" render={(props) => <HomeDelivery userdata={this.state.userdata.name} courier={this.state.userdata.user_id} {...props} />} />
                                                <Route path="/Delivery/pickedorder" render={(props) => <PickedOrder courier={this.state.userdata.user_id} {...props} />} />
                                                <Route path="/Delivery/orders" render={(props) => <Orders courier={this.state.userdata.user_id} pickedID={this.state.curr_order} {...props} />}/>
                                                <Route path="/Delivery/allorders" component= {AllOrders} />
                                                {/* <Route path="Dashboard/editProduct/:id" component= {EditProduct} />
                                                <Route path="/allProducts" component= {ShowProduct} />
                                                <Route path="/allCatogories" component= {ShowCategory} />
                                                <Route path="/purchaseDetail" component= {PurchaseDetails} />
                                                <Route path="/purchaseByProduct" component= {PurchaseByProduct} />
                                                <Route path="/user" component= {ShowUser} />
                                                <Route path="/blacklist" component= {ShowBlacklist} />
                                                <Route path="/allAdmin"  component= {ShowAdmin} />
                                                <Route path="/account" component= {Account}></Route>
                                                <Route path="/price" component= {SellingPrice}></Route> */}
                                            </Switch> 
                                        </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
  }
}

export default DashboardDelivery;
