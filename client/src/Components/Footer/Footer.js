import React from 'react';
import './Footer.css';
import { Link,withRouter } from 'react-router-dom';

class Footer extends React.Component{
    gotoTerms(){
        this.props.history.push('/terms-n-conditions');
    }
    render(){
        return(
            <div className="home-footer">
                <div className="home-footer-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2 col-md-2 col-sm-2">

                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-8">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ul className="footer-menu">
                                            <li><Link to={'/'}>About us</Link></li>
                                            <li><Link to={'/contactus'}>Contact us</Link></li>
                                            <li><Link to={'/'}>Career</Link></li>
                                            <li><Link to={'/faq'}>FAQ</Link></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-8">
                                        <h4>Looking for something specific</h4>
                                        <p>Our mission is to provide the very best organic and natural wholefoods nationwide. If you can’t find the product you want please contact us, and we will do our best to see if we can source it for you. </p>
                                    </div>
                                </div>
                                <div className="footer-line"></div>
                                <div>
                                    <p className="footer-brand"><span className="footer-terms" onClick={this.gotoTerms.bind(this)}>Terms& Conditions</span> | &copy;Greengavya.com</p>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-2">

                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default withRouter(Footer);