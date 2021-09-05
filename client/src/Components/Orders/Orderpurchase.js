import React from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';


class Orderpurchase extends React.Component{
    state = {
        readyToProcess:false,
        success:false,
        popup:false,
    }
    componentDidMount(){
        document.title = "Purchase order";
        //confirm path
        const prePath = this.props.location.state.prePath;
        if(prePath === "confirmorder"){
            var token = Cookies.get("_token");
            var session = Cookies.get("sessionID");
            var cart_key = Cookies.get("_cid");
            var _location = Cookies.get("_SAL");
            var deliverySpeed = Cookies.get("D/O");
            //check logged
            var logged = this.CheckAuth();
            if(!logged){
                alert("You need to login to visit this page!!");
                this.props.history.push('/');
            }else{
                if(token !== undefined&&session !== undefined&&cart_key!==undefined&&_location !== undefined&&deliverySpeed !== undefined){
                    //process purchase  *****************/
                    fetch('/api/cart/showCart',{
                        method : 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            // "Content-Type": "application/x-www-form-urlencoded",
                            "_cid": cart_key
                        }
                    })
                        .then(res => res.json())
                        .then(result => {
                            setTimeout(() => {
                                if(result.result == null || result.result.length <= 0){
                                    alert("Your cart is empty!");
                                    this.props.history.push('/');
                                }else{
                                    this.setState({
                                        //emptyData:false,
                                        readyToProcess:true
                                    })
                                    setTimeout(() => {
                                        this.submitOrders();
                                    }, 100);
                                }  
                            }, 100);
                            
                        })
                        .catch(e => {
                            console.log(e);
                        })
                        /***********/
                }else{
                    this.props.history.push('/');
                }
            }
        }else{
            this.props.history.push('/confirmorder');
        }
    }

    submitOrders(){
        var cartId = Cookies.get('_cid');
        var token = Cookies.get('_token');
        var session = Cookies.get('sessionID');
        var _location = Cookies.get('_SAL');
        var deliverySpeed = Cookies.get("D/O");
        if(cartId !== undefined && token !== undefined && session !== undefined && _location !== undefined){
            fetch('/api/product/orderproducts',{
            method:'POST',
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "_cid": cartId,
                "token": token,
                "sessionid":session,
                "loc":_location,
                "deliverorder":deliverySpeed 
            }
            })
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }else{
                    alert("You are not authorised to confirm orders. Please login to continue!");
                    Cookies.remove('_token', { path: '' });
                    Cookies.remove('sessionID', { path: '' });
                    this.props.history.push('/login');
                }
            })
            .then(result => {
                if(result.statuscode === 200){
                    clearInterval(this.timeOutError);
                    this.setState({
                        success:true,
                    })
                    Cookies.remove('_cid', { path: '' });
                }else{
                    this.setState({
                        popup:true
                    })
                }
            })
            .catch(e => console.log(e));
        }else{
            alert("You are not authorised to confirm orders. Please login again!!!");
            Cookies.remove('_token', { path: '' });
            Cookies.remove('sessionID', { path: '' });
            Cookies.remove('_SAL', { path: '' });
            this.props.history.push('/login');
        }
        
    }

    CheckAuth(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        if(token !== undefined&&session !== undefined){
            return true;
        }else{
            return false;
        }
    }

    cancelFailedPurchase(){
        clearInterval(this.timeOutError);
        this.setState({
            popup: !this.state.popup
        })
        this.props.history.push('/');
    }

    render(){
        return(
            <React.Fragment>
                <div className="container-fluid">
                    {/* <Header />
                    <Navigation /> */}
                    <div className="container product-container">
                        <div className="row">
                            <div className="col-lg-1 col-md-2">
                                
                            </div>
                            <div className="col-lg-10 col-md-8">
                                {
                                    this.state.readyToProcess ?
                                        !this.state.success ? <Processing /> : <ProcessSuccess/>
                                    :
                                    <div className="order-loader">
                                        <img src="./images/orderwait_loader.gif"/>
                                        <h3>Please wait...</h3>
                                    </div>
                                }
                            </div>
                            <div className="col-lg-1 col-md-2">
                                
                            </div>
                        </div>
                    </div>
                    {/* <Footer /> */}
                </div>
            </React.Fragment>
        )
    }
}
const Processing = () => {
    return(
        <div className="order-purchase-loading">
            <h1 className="text-center">Your order is Processing</h1>
            <h2 className="text-center">Please wait...</h2>
            <h4 className="text-center" style={{marginLeft: '-18px',marginTop: '24px'}}><img src="./images/purchaseLoader.gif" alt="loading_icon"/></h4>
        </div>
    )
}

const ProcessSuccess = (p) => {
    return(
        <div className="order-success-div">
            <h2 className="text-center" style={{fontWeight:'200'}}>Successfully Purchased</h2>
            <h3 className="text-center" style={{fontWeight: '200'}}>Thank you for purchase with us</h3>
            <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" fill="none" cx="26" cy="26" r="25" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <div className="text-center">
                <Link to={'/'} style={{color:'#09d4a4',textDecoration:'underline',fontSize:'18px'}}>Continue Shopping</Link>
                <div style={{paddingTop:'20px'}}>
                    <Link to={'/myorders'} style={{color:'#09d4a4',textDecoration:'underline',fontSize:'18px'}}>Your orders</Link>
                </div>
            </div>
        </div>
    )
}


export default Orderpurchase;