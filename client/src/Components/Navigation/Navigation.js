import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom'

class Navigation extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-container g-navigation">
                <div className="container">
                    <ul className="nav navbar-nav home-nav">
                        <li><Link to={'/'}>Shopping</Link></li>
                        <li><Link to={'/myorders'}>My Orders</Link></li>
                        <li><Link to={'/faq'} style={{letterSpacing:'2px'}}>FAQ</Link></li>
                        {/* <li><a href="#">Diet Preference</a></li>
                        <li><a href="#">Deliver</a></li>
                        <li><a href="#">Recipes & Blog</a></li>
                        <li><a href="#">Info Center</a></li>
                        <li><a href="#">Loyalty Card</a></li> */}
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navigation;