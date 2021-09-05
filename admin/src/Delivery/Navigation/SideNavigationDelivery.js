import React from 'react';
import {Link} from 'react-router-dom';

class SideNavigationDelivery extends React.Component{
    render(){
        return(
            <nav id="spy">
                <ul class="text-left sidebar-nav nav">
                    <div class="text-center" style={{marginTop:'8px'}}>
                        <img alt="Gavya Logo" src="/images/gavya_logo.png" width="180"/>
                    </div>
                    <li className="sidebar-nav-li">
                        <Link to="/Delivery/home"><span class="fa fa-home solo"></span>Home</Link>
                    </li>
                    <li>
                        <Link to="/Delivery/orders"><span class="fa fa-anchor solo"></span>Orders</Link>
                    </li>
                    <li>
                        <Link to="/Delivery/pickedorder"><span class="fa fa-anchor solo"></span>Picked Orders</Link>
                    </li>
                </ul>
        </nav>
        );
    }
}
export default SideNavigationDelivery;
