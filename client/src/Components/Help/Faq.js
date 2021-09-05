import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import HeaderSmall from '../Header/HeaderSmall';
import './contact.css';

class Faq extends React.Component{

    componentDidMount(){
        document.title = "FAQ";
        window.scrollTo(0, 0);
    }

    ShowFaq(faqType){
        this.props.history.push(this.props.match.path + "/"+ faqType);
    }

    gotoShop(){
        this.props.history.push("/");
    }

    render(){
        return(
            <React.Fragment>
                <div className="container-fluid">
                    <div className="c_respo_nav-large">
                        <Header/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall/>
                    </div>
                    <Navigation />
                    <div className="container">
                        <div className="faq-options">
                            <p className="order-viewmore-btn" style={{marginBottom:'40px'}} onClick={this.gotoShop.bind(this)}>Continue Shopping</p>
                            <h4>FAQs</h4>
                            <h5>Browse from Categories</h5>
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="faq-option-box" onClick={this.ShowFaq.bind(this,"account")}>
                                        <img src={window.location.origin + "/icons/ic_faq_account.svg"} height="48"/>&nbsp;&nbsp;<span>Account</span>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="faq-option-box"  onClick={this.ShowFaq.bind(this,"order")}>
                                        <img src={window.location.origin + "/icons/ic_faq_order_48.png"}/>&nbsp;&nbsp;<span>My orders</span>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="faq-option-box"  onClick={this.ShowFaq.bind(this,"shipping")}>
                                        <img src={window.location.origin + "/icons/ic_faq_shipping_48.png"}/>&nbsp;&nbsp;<span>Shipping</span>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="faq-option-box"  onClick={this.ShowFaq.bind(this,"address")}>
                                        <img src={window.location.origin + "/icons/ic_faq_address.png"}/>&nbsp;&nbsp;<span>Address</span>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="faq-option-box"  onClick={this.ShowFaq.bind(this,"payment")}>
                                        <img src={window.location.origin + "/icons/ic_faq_card_48.png"}/>&nbsp;&nbsp;<span>Payment</span>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="faq-option-box"  onClick={this.ShowFaq.bind(this,"refund")}>
                                        <img src={window.location.origin + "/icons/ic_faq_refund.svg"} height="48"/>&nbsp;&nbsp;<span>Refund</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}



export default Faq;