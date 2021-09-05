import React from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import './TopNavigation.css';
import {Link} from 'react-router-dom';

class TopNavigationDelivery extends React.Component{
    state = {
        toggle: true
    }
    Logout(e){
        e.preventDefault();
        Cookies.remove('_token_admin_delivery');
        Cookies.remove('sessionID_admin_delivery');
        this.props.history.push('/delivery-login');
    }
    openDrawer(){
        var {toggle} = this.state;
        this.setState({
            toggle: !toggle
        });
        this.props.toggleFlag(this.state.toggle)
    }
    render(){
        return(
            <React.Fragment>
                {/* <div  class="navbar-brand">
                    <a onClick={ this.openDrawer.bind(this)} id="menu-toggle" style={{cursor:'pointer',position:'fixed'}} class="glyphicon glyphicon-menu-hamburger btn-menu toggle"></a>
                </div> */}
                <nav class="top-nav-signout navbar" role="navigation">
                        <div style={{borderRadius:'0px'}}>
                            <a className="top-nav-button" href="" onClick={(e)=>{this.Logout(e)}}>
                                <img alt="User icon" className="top-nav-img" src="/images/logout.png"/>
                                
                                <div className="logout">LOGOUT</div>
                            </a>
                            {/* <div className="top-nav-username">{this.props.user}</div> */}
                        </div>
                </nav>
                <nav class="top-nav-home navbar" role="navigation">
                        <div style={{borderRadius:'0px'}}>
                                <Link to="/Delivery/home" className="top-nav-button"><img src="/images/home_icon.png" alt="home icon" width="25"/></Link>
                            {/* <div className="top-nav-username">{this.props.user}</div> */}
                        </div>
                </nav>
            </React.Fragment>
        );
    }
}
export default withRouter(TopNavigationDelivery);