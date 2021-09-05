import React from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import './TopNavigation.css';

class TopNavigation extends React.Component{
    state = {
        toggle: true
    }
    Logout(e){
        e.preventDefault();
        Cookies.remove('_token_admin');
        Cookies.remove('sessionID_admin');
        this.props.history.push('/');
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
                <div  class="navbar-brand">
                    <a onClick={ this.openDrawer.bind(this)} id="menu-toggle" style={{cursor:'pointer',position:'fixed'}} class="glyphicon glyphicon-menu-hamburger btn-menu toggle"></a>
                </div>
                <nav class="top-nav navbar" role="navigation">
                        <div style={{borderRadius:'0px'}}>
                            <a className="top-nav-button" href="" onClick={(e)=>{this.Logout(e)}}>
                                <img alt="Logout icon" className="top-nav-img" src="/images/logout.png"/>
                                
                                <div className="logout">LOGOUT</div>
                            </a>
                            {/* <div className="top-nav-username">{this.props.user}</div> */}
                        </div>
                </nav>
            </React.Fragment>
        );
    }
}
export default withRouter(TopNavigation);