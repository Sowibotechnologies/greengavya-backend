import React, { Component } from 'react';
import './Dashboard.css';
import {Switch , Route } from 'react-router-dom';
import TopNavigation from '../Navigation/TopNavigation';
import Cookies from 'js-cookie';
import SideNavigation from '../Navigation/SideNavigation';
import PurchaseDetails from '../Purchase/PurchaseDetails';
import ShowProduct from '../Product/ShowProduct';
import EditProduct from '../Product/EditProduct';
import PurchaseByProduct from '../Purchase/PurchaseByProduct';
import ShowCategory from '../Category/ShowCategory';
import ShowAdmin from '../Admin/ShowAdmin';
import Account from '../Account/Account';
import Home from './Home';
import ShowUser from '../User/ShowUser';
import ShowBlacklist from '../User/ShowBlacklist';
import ShowCouriers from '../Courier/ShowCouriers';
import TabularPriceTracker from '../Price Tracker/TabularPriceTracker';
import ProductsByOrder from '../Purchase/ProductsByOrder';
import ShowFeedbacks from '../User/ShowFeedbacks';

class Dashboard extends Component {
    state = {
        userdata : "",
        toggle : false
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
        this.props.history.push('/Dashboard/home');
    }
    onToggle(e){
        this.setState({
            toggle: e
        });
    }
    getUserData(){
        var token = Cookies.get('_token_admin');
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
           setTimeout(()=>{this.render();},200);
        })
    }
  render() {
    return (
        <React.Fragment>
            <div id="wrapper" className={this.state.toggle ? "active": ""}>

                <div id="sidebar-wrapper">
                     <SideNavigation/>
                </div>
                <div id="page-content-wrapper">
                    <div class="page-content">
                        <TopNavigation toggleFlag={this.onToggle.bind(this)}  user={this.state.userdata.name}/>
                        <div class="container-fluid" style={{paddingLeft:'0px',paddingRight:'0px'}}>
                                <div class="container-fluid dash-header">
                                        <a class="visible-xs" data-toggle="offcanvas"><i class="fa fa-lg fa-reorder"></i></a>
                                        <div class="dash-counter" style={{width:'100%'}}>
                                            <Switch>
                                                <Route path="/Dashboard/home" component={Home} />
                                                <Route path="/Dashboard/editProduct/:id" component= {EditProduct} />
                                                <Route path="/Dashboard/allProducts" component= {ShowProduct} />
                                                <Route path="/Dashboard/allCategories" component= {ShowCategory} />
                                                <Route path="/Dashboard/purchaseDetail" component= {PurchaseDetails} />
                                                <Route path="/Dashboard/purchaseByProduct" component= {PurchaseByProduct} />
                                                <Route path="/Dashboard/productsByOrder" component= {ProductsByOrder} />
                                                <Route path="/Dashboard/user" component= {ShowUser} />
                                                <Route path="/Dashboard/blacklist" component= {ShowBlacklist} />
                                                <Route path="/Dashboard/allAdmin"  component= {ShowAdmin} />
                                                <Route path="/Dashboard/account" component= {Account}></Route>
                                                <Route path="/Dashboard/price" component= {TabularPriceTracker}></Route>
                                                <Route path="/Dashboard/couriers" component= {ShowCouriers}></Route>
                                                <Route path="/Dashboard/feedbacks" component= {ShowFeedbacks}></Route>
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

export default Dashboard;
