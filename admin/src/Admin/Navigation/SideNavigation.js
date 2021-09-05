import React from 'react';
import {Link} from 'react-router-dom';

class SideNavigation extends React.Component{
    render(){
        return(
            <nav id="spy">
                <ul class="text-left sidebar-nav nav">
                    <div class="text-center" style={{marginTop:'8px'}}>
                        <img alt="Gavya Logo" src="/images/gavya_logo.png" width="180"/>
                    </div>
                    <li className="sidebar-nav-li">
                        <Link to="/Dashboard/Home"><span class="fa fa-home solo"></span>Home</Link>
                    </li>
                    <li>
                        <Link to="/Dashboard/allProducts"><span class="fa fa-anchor solo"></span>Products</Link>
                    </li>
                    <li>
                        <Link to="/Dashboard/allCategories"><span class="fa fa-anchor solo"></span>Categories</Link>
                    </li>
                    <li>
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse3"><span class="fa fa-anchor solo"></span>Orders</a>
                    </li>
                    <div id="collapse3" className="panel-collapse collapse">
                            <ul className="side-main-menu-sub">
                                <li><Link to="/Dashboard/purchaseDetail">View All</Link></li>
                                <li><Link to="/Dashboard/purchaseByProduct">By Product</Link></li>
                                <li><Link to="/Dashboard/productsByOrder">By Order</Link></li>
                            </ul>
                    </div>
                    <li>
                        <Link to="/Dashboard/price"><span class="fa fa-anchor solo"></span>Price Tracker</Link>
                    </li>

                    <li>
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse5"><span class="fa fa-anchor solo"></span>Shopper</a>
                    </li>
                    <div id="collapse5" className="panel-collapse collapse">
                            <ul className="side-main-menu-sub">
                                <li><Link to="/Dashboard/user">View All</Link></li>
                                <li><Link to="/Dashboard/feedbacks">Feedbacks</Link></li>
                                <li><Link to="/Dashboard/blacklist">Blacklist</Link></li>
                            </ul>
                    </div>
                    <li>
                        <Link to="/Dashboard/allAdmin"><span class="fa fa-anchor solo"></span>Admin</Link>
                    </li>
                    <li>
                        <Link to="/Dashboard/couriers"><span class="fa fa-anchor solo"></span>Couriers</Link>
                    </li>
                    <li>
                        <Link to="/Dashboard/account"><span class="fa fa-anchor solo"></span>Account</Link>
                    </li>
                </ul>
        </nav>
        );
    }
}
export default SideNavigation;
