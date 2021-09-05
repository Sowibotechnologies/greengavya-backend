import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './contact.css';
import Contactpage from './Contactpage';
import HeaderSmall from '../Header/HeaderSmall';

class Contact extends React.Component{
    state = {
        page:'contact',
        cart:[],
        cartCount:0
    }
    componentDidMount(){
        document.title = "Contact us";
        this.getCart();
    }
    componentWillReceiveProps(){
        this.getCart();
    }
    getCart(){
        var key = Cookies.get('_cid');
        if(key != null){
            fetch('/api/cart/showCart',{
                method : 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                        "_cid":key
                    }
                })
            .then(res => res.json())
            .then(result => {
                if(result.result != null){
                    this.setState({
                        cartCount:result.result.length,
                        cart:result.result
                    })
                }
            })
        }
    }
    
    render(){
        const { page,cartCount } = this.state;
        return(
            <React.Fragment>
                <div className="container-fluid">
                    <div className="c_respo_nav-large">
                        <Header cartCount={cartCount}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={cartCount}/>
                    </div>
                    <Navigation />
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">

                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                                <Contactpage />
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default Contact;