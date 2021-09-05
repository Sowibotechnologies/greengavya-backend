import React, { Component } from 'react';
import './App.css';
import {Switch , Route, Redirect, Link } from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import Forgotpassword from './Components/Login/Forgotpassword';
import Shop from './Components/Shopping/Shop';
import Cart from './Components/Cart/Cart';
import Logout from './Components/Login/Logout';
import Address from './Components/BillingAddress/Address';
import Cookies from 'js-cookie';
import Confirmorder from './Components/Orders/Confirmorder';
import Orderpurchase from './Components/Orders/Orderpurchase';
import Verifyaccount from './Components/User/Verifyaccount';
import Locked from './Components/User/Locked';
import Myorders from './Components/Orders/Myorders';
import Resetpassword from './Components/Login/Resetpassword';
import Contact from './Components/Help/Contact';
import Filenotfound from './Components/Shopping/Pagenotfound';
import Settings from './Components/Settings/Settings';
import Terms from './Components/Help/Terms';
import Reorder from './Components/Orders/Reorder';
import Faq from './Components/Help/Faq';
import Showfaq from './Components/Help/Showfaq';
import Cookiepolicy from './Components/Policy/Cookiepolicy';
import Orderinvoice from './Components/Invoice/Orderinvoice';


class App extends Component {

  constructor(props){
    super(props);
  }

  state = {
    acceptCookie : false
  }
  
  componentDidMount(){
    var cacheId = Cookies.get('_cid');
    if(cacheId == null){
      this.setCookie();
    }
    var acceptCookie = Cookies.get('acceptCookie');
    
    if(acceptCookie != null){
      if(acceptCookie === 'true'){
        this.setState({
          acceptCookie:false
        })
      }else{
        Cookies.remove('acceptCookie');
        this.setState({
          acceptCookie:true
        })
      }
    }else{
      this.setState({
        acceptCookie:true
      })
    }
  }
  setCookie(){
    var ran = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)).toUpperCase();
    Cookies.set('_cid', ran, { expires: 7 });
  }
  acceptCookie(){
    Cookies.set('acceptCookie',true, {expires : 7} )
    this.setState({
      acceptCookie:false
    })
  }
  render() {
    return (
      <React.Fragment>
      <div className="container-fluid">
        <div className="row App">
          <Switch>
            <Route path="/" exact component= {Shop} />
            <Route path="/cart" exact component= {Cart} />
            <Route path="/billing" exact component= {Address} />
            <Route path="/confirmorder" exact component= {Confirmorder} />
            <Route path="/orderpurchase" exact component= {Orderpurchase} />
            <Route path="/myorders" exact component= {Myorders} />
            <Route path="/reorder" exact component= {Reorder} />
            <Route path="/login" exact component = {Login} />
            <Route path="/login/:path" exact component = {Login} />
            <Route path="/logout" exact component = {Logout} />
            <Route path="/register" exact component = {Register} />
            <Route path="/forgotpassword" exact component = {Forgotpassword} />
            <Route path="/resetpassword/:verif_code/:email" exact component = {Resetpassword} />
            <Route path="/locked" exact component = {Locked} />
            <Route path="/verifyaccount/:verif_code" exact component = {Verifyaccount} />
            <Route path="/contactus" exact component = {Contact} />
            <Route path="/settings" exact component = {Settings} />
            <Route path="/terms-n-conditions" exact component = {Terms} />
            <Route path="/faq" exact component = {Faq} />
            <Route path="/faq" exact component = {Faq} />
            <Route path="/faq/:type" exact component = {Showfaq} />
            <Route path="/invoice/:ordernumber" exact component = {Orderinvoice} />
            <Route path="/cookie-policy" exact component = {Cookiepolicy} />
            <Route component={Filenotfound}/>
          </Switch>
        </div>
      </div>
      {
        this.state.acceptCookie ?
        <div className="cookie-policy">
          <div className="container">
            <div className="row">
                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                    <p>We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies. <Link to={'/cookie-policy'}>More</Link></p>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                  <button className="cookie-policy-btn" onClick={this.acceptCookie.bind(this)}>Got it!</button>
                </div>
            </div>
          </div>
        </div>
        :
        null
      }
      
      </React.Fragment>
    );
  }
  
  /***********************/
  //*     FUNCTIONS     *//
  /***********************/


}


export default App;
