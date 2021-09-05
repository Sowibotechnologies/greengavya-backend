import React from 'react';
import Header from '../Header/Header';
import HeaderSmall from '../Header/HeaderSmall';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';

class Terms extends React.Component{
    state ={
        cartCount:0
    }
    componentDidMount(){
        document.title = "Terms & conditions";
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
                        cartCount:result.result.length
                    })
                }
            })
        }
    }
    render(){
        const { cartCount } = this.state;
        return(
            <React.Fragment>
                <div className="container-fluid shop">
                    <div className="c_respo_nav-large">
                        <Header cartCount={cartCount}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={cartCount}/>
                    </div>
                    <Navigation/>
                    <div className="container">
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12">

                        </div>
                        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-12">
                            <h3>Terms and Conditions</h3>
                            <p></p>
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12">

                        </div>
                        
                    </div>
                    <Footer/>
                </div>
            </React.Fragment>
        )
    }
}

export default Terms;