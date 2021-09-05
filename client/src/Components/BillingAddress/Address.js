import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './Address.css';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import HeaderSmall from '../Header/HeaderSmall';
import Addressform from './Addressform';

class Address extends React.Component{
    state = {
        cartCount:0,
        shippingaddress:[],
        loading:true
    }
    componentDidMount(){
        document.title = "Delivery address";
        window.scrollTo(0, 0);
        this.getCart();
        var logged = this.CheckAuth();
        if(!logged){
            this.props.history.push('/login/billing');
        }
        this.getUserAddress();
    }

    componentWillReceiveProps(){
        window.scrollTo(0, 0);
        this.getCart();
    }

    handleNewaddress(e){
        e.preventDefault();
        //handle address
        var data = e.target;
        //console.log(JSON.stringify({fullname:data.fullname.value,mobile:data.mobile.value,district:data.district.value,house:data.house.value,area:data.area.value,city:data.city.value,pin:data.pin.value,landmark:data.landmark.value}));
        
        fetch('/api/user/addAddress', {
            method:'POST',
            body:JSON.stringify({fullname:data.fullname.value,mobile:data.mobile.value,district:data.district.value,house:data.house.value,area:data.area.value,city:data.city.value,pin:data.pin.value,landmark:data.landmark.value}),
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            if(result.status === 200){
                Cookies.remove('_SAL', { path: '' });
                Cookies.set("_SAL", result.addressid);
                var primaryAddress = window.confirm("Do you want to set this address as your primary address ?");
                if(primaryAddress){
                    setTimeout(() => {
                        this.setPrimaryAddress();
                    }, 2000);
                    this.props.history.push('/confirmorder');
                }else{
                    this.props.history.push('/confirmorder');
                }
            }else{
                alert("Something went wrong!.try again");
                this.props.history.push('/cart');
            }
        })
    }

    setPrimaryAddress(){
        var addressid = Cookies.get('_SAL');
        var token = Cookies.get('_token');
        var session = Cookies.get('sessionID');
        fetch('/api/user/updateUserAddress',{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                "token": token,
                "sessionid":session
            },
            body:JSON.stringify({addressid: addressid})
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            
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
                        cartCount:result.result.length
                    })
                }
            })
        }
    }

    
    getUserAddress(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        var addressid = Cookies.get("_SAL");
        fetch('/api/user/getUserAddress',{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "token": token,
                "sessionid":session
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result.status === 200 && result.shipping.length != 0){
                this.setState({
                    shippingaddress:result.shipping[0]
                })
            }
            this.setState({
                loading:false
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    handleChooseAddress(e){
        if(this.state.shippingaddress.length !== 0){
            const addressId = this.state.shippingaddress.addressid;
            Cookies.set("_SAL", addressId);
            this.props.history.push('/confirmorder');
        }
    }
    getFocus(e){
        e.preventDefault();
        ReactDOM.findDOMNode(this.refs.startaddress).focus();
    }
    Removeaddress(addressid){
        //alert(addressid);
        var b = window.confirm("Are you sure?");
        if(b){
            var token = Cookies.get("_token");
            var session = Cookies.get("sessionID");
            fetch('/api/user/removeaddressbyuser',{
                method:'post',
                headers:{
                    "Content-Type": "application/json",
                    "token": token,
                    "sessionid":session
                }
            })
            .then(res => res.json())
            .then(result => {
                if(result.status == 200){
                    alert(result.message);
                    this.setState({
                        shippingaddress:[]
                    })
                }else{
                    alert("Please try again later!");
                }
            })
        }
        
    }

    onSubmitAddress(name,mobile,house,area,city,pin,district,landmark){
        fetch('/api/user/addAddress', {
            method:'POST',
            body:JSON.stringify({fullname:name,mobile:mobile,district:district,house:house,area:area,city:city,pin:pin,landmark:landmark}),
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            if(result.status === 200){
                Cookies.remove('_SAL', { path: '' });
                Cookies.set("_SAL", result.addressid);
                var primaryAddress = window.confirm("Do you want to set this address as your primary address ?");
                if(primaryAddress){
                    setTimeout(() => {
                        this.setPrimaryAddress();
                    }, 2000);
                    this.props.history.push('/confirmorder');
                }else{
                    this.props.history.push('/confirmorder');
                }
            }else{
                alert("Something went wrong!.try again");
                this.props.history.push('/cart');
            }
        })
    }

    render(){
        const { shippingaddress,loading } = this.state;
        return(
            <React.Fragment>
                <div className="container-fluid shop">
                    <div className="c_respo_nav-large">
                        <Header cartCount={this.state.cartCount}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={this.state.cartCount}/>
                    </div>
                    <Navigation />
                    <div className="container product-container">
                        <div className="row">
                            <div className="col-lg-1 col-md-2">
                                
                            </div>
                            <div className="col-lg-10 col-md-8">
                                <h3 className="product-head">Delivery Address</h3>
                                <p className="address-subtitle">Saved Address</p>
                                <div>
                                    {
                                        loading ?
                                        <p>Loading...</p>
                                        :
                                        shippingaddress.length != 0 ?
                                            <div className="row address-saved-div">
                                                <div className="col-lg-4">
                                                    <h5>Shipping Address <a style={{fontSize:'12px',cursor:'pointer'}} onClick={this.Removeaddress.bind(this,shippingaddress.addressid)}>Remove</a></h5>
                                                    <p>{shippingaddress.name}</p>
                                                    <p>{shippingaddress.house}</p>
                                                    <p>{shippingaddress.street}</p>
                                                    <p>{shippingaddress.city}</p>
                                                    <p>{shippingaddress.district + ", "+ shippingaddress.pin}</p>
                                                    <p>Phone: {shippingaddress.phone}</p>
                                                    <button className="address-use-btn" onClick={this.handleChooseAddress.bind(this)}>Use this address</button>
                                                </div>
                                                {/* <div className="col-lg-4">
                                                    <h5>Billing Address <a style={{fontSize:'12px',cursor:'pointer'}} onClick={this.showAddressPopup.bind(this)}>change</a></h5>
                                                    <p>{shippingaddress.name}</p>
                                                    <p>{shippingaddress.house}</p>
                                                    <p>{shippingaddress.street}</p>
                                                    <p>{shippingaddress.city}</p>
                                                    <p>{shippingaddress.district + ", "+ shippingaddress.pin}</p>
                                                    <p>Phone: {shippingaddress.phone}</p>
                                                </div> */}
                                                
                                            </div>
                                            :
                                            <p>No address found <a onClick={this.getFocus.bind(this)} style={{cursor:"pointer"}}>Add</a></p>
                                    }
                                </div>
                                <p className="address-subtitle">Add a new Address</p>
                                <div className="address-new">
                                    <Addressform onSubmitAddress={this.onSubmitAddress.bind(this)}/>
                                    {/* <form onSubmit={this.handleNewaddress.bind(this)}>
                                        <p>Fullname *</p>
                                        <input type="text" name="fullname" ref="startaddress" id="fullname" className="address-textfield" minLength="2" maxLength="50" required/>
                                        <p>Mobile number *</p>
                                        <input type="number" name="mobile" id="mobile" className="address-textfield" min="999999" max="99999999999" />
                                        <p>Flat, House no, Building *</p>
                                        <input type="text" name="house" id="house" className="address-textfield" minLength="3" maxLength="100" />
                                        <p>Area, Street *</p>
                                        <input type="text" name="area" id="area" className="address-textfield" minLength="3" maxLength="100" />
                                        <p>City, Town *</p>
                                        <input type="text" name="city" id="city" className="address-textfield" minLength="3" maxLength="100" />
                                        <p style={{marginTop:'10px'}}>District * &nbsp;<span style={{color:'red',float:'right'}}>* within city limits only</span></p>
                                        <select className="address-selectoption" name="district" >
                                            <option>Trivandrum</option>
                                        </select>
                                        <p>Pin *</p>
                                        <input type="number" name="pin" id="pin" className="address-textfield" min="9999" maxLength="999999" />
                                        <p>Landmark(Optional)</p>
                                        <input type="text" name="landmark" id="landmark" className="address-textfield" minLength="3" maxLength="100"/>
                                        <p style={{color:'red'}}>* Required Fields</p>
                                        <input type="submit" className="address-btn" value="Deliver to this address"/>
                                    </form> */}
                                </div>
                            </div>
                            <div className="col-lg-1 col-md-2">
                                
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Address);