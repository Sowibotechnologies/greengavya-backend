import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './Order.css';
import { Link,withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import HeaderSmall from '../Header/HeaderSmall';

const deliverySpeeds = {
    standard: "standard",
    fast: "fast"
}

class Confirmorder extends React.Component{

    state = {
        cart:[],
        cartCount:0,
        address:[],
        showModal:false,
        unavailable:[],
        availabilityChecked:false,
        addressloading:true,
        cartLoading:true,
        scheduledDate:'',
        quickDeliveryDate:'',
        deliverySpeed: deliverySpeeds.standard
    }

    componentDidMount(){
        document.title = "Confirm order";
        window.scroll(0,0);
        var logged = this.CheckAuth();
        const location = Cookies.get("_SAL");
        const deliverySpeed = Cookies.get("D/O");
        if(!deliverySpeed){
            Cookies.set("D/O",  deliverySpeeds.standard.charAt(0));
        }else{
            Cookies.set("D/O",  deliverySpeeds.standard.charAt(0));
        }
        if(!logged){
            alert("You need to login to visit this page!!");
            this.props.history.push('/login/confirmorder');
        }
        if(location === undefined){
            this.props.history.push('/billing');
        }
        this.getProductAvailability();
        this.getCart();
        this.getAddress();
        this.getStandardDeliveryDate();
        this.getQuickdelivery(1);
    }

    componentWillReceiveProps(){
        this.getCart();
        const location = Cookies.get("_SAL");
        if(location === undefined){
            this.props.history.push('/billing');
        }
        this.getAddress();
    }
    closeModal(){
        this.setState({
            showModal : !this.state.showModal
        })
    }
    getQuickdelivery(day){
        var scheduledDateString = "";
        var today = new Date();
        var quickDeliveryDate = new Date();
        var options = { weekday:'long',year:'numeric',month:'long',day:'numeric'};
        quickDeliveryDate.setDate(today.getDate() + day);
        scheduledDateString = quickDeliveryDate.toLocaleDateString("en-US", options);
        this.setState({
            quickDeliveryDate:scheduledDateString
        })
    }
    getStandardDeliveryDate(){
        var d = new Date();
        var sDate = new Date();
        var showDate = new Date();
        var options = { weekday:'long',year:'numeric',month:'long',day:'numeric'};
        var scheduledDate;
        var scheduledDateString = "";
        d.setDate(sDate.getDate())
        var day = d.getDay();
        if(day === 0 || day === 1 ||day === 6){
            //SecondNextMonday(d);
            var sDate = new Date();
            var prevScheduledDate = sDate.setDate(d.getDate() + (2 - 1 - d.getDay() + 7) % 7 );
            var t = new Date(prevScheduledDate);
            scheduledDate = sDate.setDate(t.getDate()  + (1 - 1 - t.getDay() + 7) % 7 + 1);
            //console.log(new Date(scheduledDate));
            showDate = new Date(scheduledDate);
            scheduledDateString = showDate.toLocaleDateString("en-US", options);
            
            
        }else{
            //nextMonday(d);
            var sDate = new Date();
            scheduledDate = sDate.setDate(d.getDate() + (2 - 1 - d.getDay() + 7) % 7 );
            //console.log(new Date(scheduledDate));
            showDate = new Date(scheduledDate);
            scheduledDateString = showDate.toLocaleDateString("en-US", options);
        }
        this.setState({
            scheduledDate:scheduledDateString
        })
    }
    getProductAvailability(){
        var Key = Cookies.get("_cid");
        fetch("/api/product/checkavailability",{
            headers:{
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "_cid": Key
            },
            method:'POST'
        })
        .then(res => res.json())
        .then(result => {
            if(result.length > 0){
                
                this.setState({
                    unavailable:result,
                    showModal:true
                })
            }else{
                setTimeout(() => {
                    var loggedin = this.CheckAuth();
                    if(loggedin) {
                        //check for blacklisted and process
                        this.checkBlacklist();
                    
                    }else{
                        this.props.history.push('/login');
                    }
                }, 100); 
            }
        })
    }
    continuePurchase(){

    }

    checkBlacklist(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        fetch("/api/user/getallblacklistbyuserid",{
            headers:{
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "token": token,
                "sessionid":session
            },
            method:'POST'
        })
        .then(res => {
            if(res.status == 423){
                this.props.history.push('/locked');
            }else if(res.status == 200){
                this.setState({
                    availabilityChecked:true
                })
                //this.props.history.push('/confirmOrder');
            }else if(res.status == 401){
                alert("Unauthorized User!!");
                Cookies.remove('_token', { path: '' });
                Cookies.remove('sessionID', { path: '' });
                Cookies.remove('_SAL', { path: '' });
                this.props.history.push('/');
            }
        })
            
    }
    continuePurchase(){
        //console.log(this.state.unavailable);
        var key = Cookies.get("_cid");
        if(this.state.unavailable !== ""&&key !== undefined){
            this.state.unavailable.map(item => {
               //console.log(item.productId);
               this.deleteCartItems(key, item.productId)
            })
            this.closeModal();
            setTimeout(() => {
                var loggedin = this.CheckAuth();
                if(loggedin) {
                    //check for blacklisted and process
                    this.checkBlacklist();
                
                }else{
                    this.props.history.push('/login/co');
                }
            }, 100);  
        }
        
        //this.deleteCartItems(key,productId);
    }

    deleteCartItems(key,productId){
        this.setState({
            ShowWait:true,
            WaitMsg:"Deleting Item"
        })
        fetch('/api/cart/cartItemRemove',{
            method : 'DELETE',
            body : JSON.stringify({product_id:productId}),
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                    "_cid": key
                }
            })
            .then(res => res.json())
            .then(result => {
                this.getCart();
            })
            .catch(e => {
                console.log(e);
            })
    }

    getAddress(){
        const location = Cookies.get("_SAL");
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        fetch('/api/user/getAddressbyId',{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "token": token,
                "sessionid":session
            },
            body:JSON.stringify({addressId:location})
        })
        .then(res => res.json())
        .then(result => {
            if(result.status === 200 && result.shipping.length != 0){
                this.setState({
                    address:result.shipping[0],
                    addressloading:false
                })
            }else{
                Cookies.remove('_SAL', { path: '' });
                this.props.history.push('/billing');
            }
        })
        .catch(err => {
            console.log(err);
        })
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
                this.setState({
                    cartLoading:false
                })
            })
        }
    }
    
    handleConfirm(e){
        if(!this.state.availabilityChecked){
            this.getProductAvailability();
        }
    }
    setDeliverySpeed(e){
        this.setState({
            deliverySpeed:e.target.value
        })
        Cookies.set("D/O", e.target.value.charAt(0));
    }

    render(){
        var total = 0;
        const { cart,cartCount,address,addressloading,cartLoading,scheduledDate,quickDeliveryDate } = this.state;
        return(
            <React.Fragment>
                <div className="container-fluid shop">
                    <div className="c_respo_nav-large">
                        <Header cartCount={cartCount}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={cartCount}/>
                    </div>
                    <Navigation />
                    {
                        this.state.showModal ? <Showmodal continuePurchase={this.continuePurchase.bind(this)} data={this.state.unavailable} closebtn={this.closeModal.bind(this)}/> : null
                    }
                    <div className="container product-container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <h3 className="product-head">Confirm Order </h3>
                                <div className="order-address-deliverydate">
                                    <div>
                                        <p><input type="radio" value={deliverySpeeds.standard} name="deliverytype" checked={this.state.deliverySpeed === deliverySpeeds.standard} onChange={this.setDeliverySpeed.bind(this)}/>&nbsp;Standard Delivery <span>
                                        {
                                            scheduledDate !== "" ? <span style={{color:"#333",fontSize:'14px'}}>(Estimated delivery date: {scheduledDate})</span>  : <span>Loading</span>
                                        }
                                        </span></p>
                                    </div>
                                </div>
                                <div className="order-address-deliverydate">
                                    <div>
                                        <p><input type="radio" value={deliverySpeeds.fast} name="deliverytype" checked={this.state.deliverySpeed === deliverySpeeds.fast} onChange={this.setDeliverySpeed.bind(this)}/>&nbsp;Fast Delivery <span>
                                        {
                                            quickDeliveryDate !== "" ? <span style={{color:"#333",fontSize:'14px'}}>(Estimated delivery date: {quickDeliveryDate})</span>  : <span>Loading</span>
                                        }
                                        </span></p>
                                    </div>
                                </div>
                                <p className="order-subtitle">Delivery Address <Link to={'/billing'} style={{fontSize:'14px',fontWeight:'100'}}>Change</Link></p>
                                <div className="order-address-div">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <h5>Shipping Address</h5>
                                            {
                                                addressloading ? 
                                                <p>Loading...</p>
                                                :
                                                <React.Fragment>
                                                    <p>{address.name}</p>
                                                    <p>{address.house}</p>
                                                    <p>{address.street}</p>
                                                    <p>{address.city}</p>
                                                    <p>{address.district + ", "+ address.pin}</p>
                                                    <p>Phone: {address.phone}</p>
                                                </React.Fragment>
                                            }
                                        </div>
                                        <div className="col-lg-4">
                                            
                                        </div>
                                        <div className="col-lg-4">
                                            <h5>Payment Method</h5>
                                            <p>Cash on Delivery &nbsp;<span title="Cash on Delivery" style={{cursor:'pointer',backgroundColor:'#9E9E9E',padding:'2px 8px',borderRadius:'50%'}}>&#10069;</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="order-subtitle">Order Details <Link to={'/cart'} style={{fontSize:'14px',fontWeight:'100'}}>Change</Link></p>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="order-cart-div">
                                                <h5>Shopping Cart</h5>
                                                {
                                                    cartLoading ?
                                                    <p>Loading...</p>
                                                    :
                                                    cart.length <= 0 ?
                                                    <React.Fragment>
                                                        <p>You have no items in your shopping cart.</p>
                                                        <p>Click <Link to={'/'}>here</Link> to continue shopping.</p>
                                                    </React.Fragment>
                                                    :
                                                    <table className="table table-responsive table-striped order-table">
                                                        <tbody>
                                                        {
                                                            cart.map((item, i) => {
                                                                total = (parseFloat(total) + parseFloat(item.total)).toFixed(2);
                                                                return <Productrow Item={item} key={i} />
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                }
                                                
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                                {
                                                    cart.length <= 0 ?
                                                    null
                                                    :
                                                    <div className="order-cart-div">
                                                        <table className="table table-responsive table-striped order-table">
                                                            <tbody>
                                                                <tr className="order-cart-table-tr">
                                                                    <td style={{textAlign:'right'}}>Subtotal</td>
                                                                    <td style={{paddingLeft:'10px',textAlign:'right'}}>{total}</td>
                                                                </tr>
                                                                <tr className="order-cart-table-tr">
                                                                    <td style={{textAlign:'right'}}>Tax</td>
                                                                    <td style={{paddingLeft:'10px',textAlign:'right'}}>0.00</td>
                                                                </tr>
                                                                <tr className="order-cart-table-tr">
                                                                    <td style={{textAlign:'right'}}>Delivery fee</td>
                                                                    <td style={{paddingLeft:'10px',textAlign:'right'}}>0.00</td>
                                                                </tr>
                                                                <tr className="order-cart-table-tr" style={{borderBottom:'0px'}}>
                                                                    <td style={{textAlign:'right',fontWeight:500}}><p>Grand Total</p></td>
                                                                    <td style={{paddingLeft:'10px',textAlign:'right'}}>&#8377;  {total}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                }
                                        </div>
                                    </div>
                                    {
                                        cart.length <= 0 ?
                                        <button className="confirm-btn" onClick={() => {this.props.history.push('/');}}>Continue Shopping</button>
                                        :
                                        // <button className="confirm-btn" onClick={this.handleConfirm.bind(this)}>Confirm Order</button>
                                            this.state.availabilityChecked ?
                                                <Link to={{pathname: '/orderpurchase', state: {prePath: "confirmorder"}}} className="confirm-btn">Confirm Order</Link>
                                            :
                                            <button className="confirm-btn" onClick={this.handleConfirm.bind(this)}>Check Availability</button>
                                    }
                                    
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

const Productrow = (Item) =>{
    const product = Item.Item;
    return(
        <tr className="order-cart-table-tr">
            <td><img src={product.productData[0].img_url} height="24" width="30"/>&nbsp;{product.productData[0].name}&nbsp;<span style={{fontSize:'12px'}}>{product.productData[0].quantity}</span></td>
            <td>{product.quantity} x</td>
            <td>&#8377; {product.productData[0].price}</td>
            <td>{product.total}</td>
        </tr>
    )
}

const Showmodal = (modal) => {
    var data = modal.data;
    return(
        <div id="myModal" className="modal_c">
            <div className="modal-content_c">
                <div className="modal-header_c">
                    <span className="close_c" onClick={modal.closebtn.bind(this)}>&times;</span>
                    <h2>These item(s) are currently not available</h2>
                </div>
                <div className="modal-body_c">
                    {
                        data.map((item,i) => {
                            return(<Itemtemplate itemdetail={item.productData} key={i}/>)
                        })
                    }
                </div>
                <div className="modal-footer_c">
                    <button className="btn confirm-modal-btn" onClick={modal.continuePurchase.bind(this)}>Continue</button>
                </div>
            </div>
        </div>
    )
}
const Itemtemplate = (data) => {
    var itemData = data.itemdetail[0];
    return(
        <div className="row confirm-modal-row">
            <div className="col-lg-2 col-md-2 col-sm-4 col-xs-4" >
                <img src={itemData.img_url} alt={itemData.name} className="img-responsive"/>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-8 col-xs-8">
                <h4 style={{marginTop: '12px',marginBottom: '2px'}}>{itemData.name}</h4>
                <i style={{color:'#8e8e8e'}}>{itemData.product_id}</i>
            </div>
        </div>
    )
}

export default withRouter(Confirmorder);