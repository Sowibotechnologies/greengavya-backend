import React from 'react';
import Header from '../Header/Header';
import HeaderSmall from '../Header/HeaderSmall';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';

const deliverySpeeds = {
    standard: "standard",
    fast: "fast"
}

class Reorder extends React.Component{
    state ={
        availableProducts:[],
        addressid:'',
        cartCount:0,
        addressloading:true,
        productsLoading:false,
        address:[],
        updateAddress:false,
        editAddress:false,
        addAddress:false,
        // address variables
        city: '',
        district: '',
        house: '',
        landmark: '',
        name: '',
        phone: '',
        pin: '',
        street: '',
        //
        scheduledDate:'',
        quickDeliveryDate:'',
        deliverySpeed: deliverySpeeds.standard
    }
    componentDidMount(){
        window.scrollTo(0, 0);
        const deliverySpeed = Cookies.get("D/O");
        if(!deliverySpeed){
            console.log('====================================');
            console.log("created");
            console.log('====================================');
            Cookies.set("D/O",  deliverySpeeds.standard.charAt(0));
        }else{
            console.log('====================================');
            console.log(deliverySpeed);
            console.log('====================================');
            Cookies.set("D/O",  deliverySpeeds.standard.charAt(0));
        }
        if(this.props.location.state !== undefined){
            const prePath = this.props.location.state.prePath;
            if(prePath === "myorders"){
                this.getCart();
                this.setState({
                    availableProducts:this.props.location.state.reorderProducts,
                    addressid:this.props.location.state.reorderAddress,

                })
                setTimeout(() => {
                    this.getAddress();
                    this.getStandardDeliveryDate();
                    this.getQuickdelivery(1);
                }, 100);
            }else{
                this.props.history.push('/myorders');
            }
        }else{
            this.props.history.push('/myorders');
        }
    }
    componentWillReceiveProps(){
        if(this.props.location.state !== undefined){
            const prePath = this.props.location.state.prePath;
        }else{
            this.props.history.push('/myorders');
        }

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
    getAddress(){
        var addressId = this.state.addressid;
        if(addressId !== ''){
            var token = Cookies.get("_token");
            var session = Cookies.get("sessionID");
            fetch('/api/user/getAddressbyId',{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "token": token,
                    "sessionid":session
                },
                body:JSON.stringify({addressId: addressId})
            })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
                
                if(result.status === 200 && result.shipping.length != 0){
                    this.setState({
                        address:result.shipping[0],
                        addressloading:false
                    })
                    
                }else{
                    alert("Something went wrong!!");
                    this.props.history.push('/myorders');
                }
            })
            .catch(err => {
                console.log(err);
            })
        }else{
            this.props.history.push('/myorders');
        }
        
    }

    closeModal(){
        this.setState({
            showModal:false,
            updateAddress:false,
            addAddress:false,
            editAddress:false
        })
    }

    ReorderByOrderId(){
        const { availableProducts, addressid } = this.state;
        if(availableProducts !== ""){
            var token = Cookies.get("_token");
            var session = Cookies.get("sessionID");
            var deliverySpeed = Cookies.get("D/O");
            if(token !== undefined && session !== undefined){
                fetch("/api/product/reorder", {
                    method:'POST',
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                        "token":token,
                        "sessionid":session,
                        "loc":addressid,
                        "deliverorder":deliverySpeed
                    },
                    body:JSON.stringify({data:availableProducts})
                })
                .then(res =>{
                    if(res.status === 200){
                        return res.json();
                    }else{
                        alert("Something went wrong!!");
                        this.props.history.push('/myorders');
                    }
                })
                .then(result => {
                    alert(result.message);
                    this.setState({
                        wait:false,
                        showModal:false
                    })
                    //this.props.refresh();
                    this.props.history.push('/myorders');
                })
            }else{
                alert("Something went wrong!!");
                this.setState({
                    wait:false,
                    showModal:false
                })
            }
            
        }
    }

    EditAddress(){
        const { address } = this.state;
        this.setState({
            updateAddress:true,
            editAddress:true,
            city: address.city,
            district: address.district,
            house: address.house,
            landmark: address.landmark,
            name: address.name,
            phone: address.phone,
            pin: address.pin,
            street: address.street
        })
    }

    ChangeAddress(){
        this.setState({
            updateAddress:true,
            addAddress:true,
            city: '',
            district: '',
            house: '',
            landmark: '',
            name: '',
            phone: '',
            pin: '',
            street: ''
        })
    }
    handleAddress(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        var data = e.target;
        fetch('/api/user/addAddress', {
            method:'POST',
            body:JSON.stringify({fullname:data.name.value,mobile:data.phone.value,district:data.district.value,house:data.house.value,area:data.street.value,city:data.city.value,pin:data.pin.value,landmark:data.landmark.value}),
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result.status === 200){
                this.setState({
                    addressid:result.addressid
                });
                setTimeout(() => {
                    this.getAddress();
                    this.closeModal();
                }, 200);
            }else{
                alert("Something went wrong!.try again");
                this.props.history.push('/reorder');
            }
        })
    }
    gotoMyorders(){
        this.props.history.push('/myorders');
    }
    setDeliverySpeed(e){
        this.setState({
            deliverySpeed:e.target.value
        })
        Cookies.set("D/O", e.target.value.charAt(0));
    }

    render(){
        var total = 0;
        const {cartCount, address, addressloading, productsLoading,availableProducts, updateAddress, editAddress, addAddress,city,district,house,landmark,name,phone,pin,street,scheduledDate,quickDeliveryDate} = this.state;
        return(
            <React.Fragment>
                {
                    updateAddress ? <Showmodal handleSubmit={this.handleSubmit.bind(this)} handleAddress={this.handleAddress.bind(this)} city={city} district={district} house={house} landmark={landmark} name={name} phone={phone} pin={pin} street={street} closebtn={this.closeModal.bind(this)} address={address} editAddress={editAddress} addAddress={addAddress}/> : null
                }
                <div className="container-fluid shop">
                    <div className="c_respo_nav-large">
                        <Header cartCount={cartCount}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={cartCount}/>
                    </div>
                    <Navigation />
                    <div className="container product-container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <h3 className="product-head">Confirm Reorder </h3>
                                <div style={{marginBottom:'20px'}}>
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
                                </div>
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
                                                    <p><button className="address-use-btn" onClick={this.EditAddress.bind(this)}>Edit</button> <button className="address-use-btn" onClick={this.ChangeAddress.bind(this)}>Add new address</button></p>
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
                                <div style={{marginTop:'20px'}}>
                                    {/* <p className="order-subtitle">Order Details <Link to={'/cart'} style={{fontSize:'14px',fontWeight:'100'}}>Change</Link></p> */}
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="order-cart-div">
                                                <h5>Shopping Cart</h5>
                                                {
                                                    productsLoading ?
                                                    <p>Loading...</p>
                                                    :
                                                    availableProducts.length <= 0 ?
                                                    null
                                                    :
                                                    <table className="table table-responsive table-striped order-table">
                                                        <tbody>
                                                        {
                                                            availableProducts.map((item, i) => {
                                                                total = (parseFloat(total) + parseFloat(item.product.price * item.qty)).toFixed(2);
                                                                return <Productrow Item={item.product} qty={item.qty} key={i} />
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                }
                                                
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                                {
                                                    availableProducts.length <= 0 ?
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
                                        availableProducts.length <= 0 ?
                                        <button className="confirm-btn" style={{float:'left'}}>Back</button>
                                        :
                                        <div>
                                            <button className="confirm-btn" style={{float:'left'}} onClick={this.gotoMyorders.bind(this)}>Back</button>
                                            <button className="confirm-btn" onClick={this.ReorderByOrderId.bind(this)}>Confirm reorder</button>
                                        </div>
                                        
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
    var total = (product.price * Item.qty).toFixed(2);
    return(
        <tr className="order-cart-table-tr">
            <td><img src={product.img_url} height="24" width="30"/>&nbsp;{product.name}&nbsp;<span style={{fontSize:'12px'}}>{product.quantity}</span></td>
            <td>{Item.qty} x</td>
            <td>&#8377; {product.price}</td>
            <td>&#8377; {total}</td>
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
                    {
                        modal.editAddress ? <h3>Edit address</h3> : null
                    }
                    {
                        modal.addAddress ? <h3>Add new address</h3> : null
                    }
                    
                </div>
                <div className="modal-body_c">
                    {
                        modal.editAddress ? 
                        <form onSubmit={modal.handleSubmit.bind(this)}>
                            <p>Fullname *</p>
                            <input type="text" name="name" value={modal.name} onChange={modal.handleAddress.bind(this)} id="name" className="address-textfield" minLength="2" maxLength="50" required/>
                            <p>Mobile number *</p>
                            <input type="number" name="phone" value={modal.phone} onChange={modal.handleAddress.bind(this)} id="phone" className="address-textfield" min="999999" max="99999999999" required/>
                            <p>Flat, House no, Building *</p>
                            <input type="text" name="house" id="house" onChange={modal.handleAddress.bind(this)} value={modal.house} className="address-textfield" minLength="3" maxLength="100" required/>
                            <p>Area, Street *</p>
                            <input type="text" name="street" id="street" onChange={modal.handleAddress.bind(this)} value={modal.street} className="address-textfield" minLength="3" maxLength="100" required/>
                            <p>City, Town *</p>
                            <input type="text" name="city" id="city" onChange={modal.handleAddress.bind(this)} value={modal.city} className="address-textfield" minLength="3" maxLength="100" required/>
                            <p style={{marginTop:'10px'}}>District * &nbsp;</p>
                            <select className="address-selectoption" onChange={modal.handleAddress.bind(this)} value={modal.district} name="district" >
                                <option>Trivandrum</option>
                                <option>Kollam</option>
                            </select>
                            <p>Pin *</p>
                            <input type="number" name="pin" id="pin" onChange={modal.handleAddress.bind(this)} value={modal.pin} className="address-textfield" min="9999" maxLength="999999" required/>
                            <p>Landmark(Optional)</p>
                            <input type="text" name="landmark" onChange={modal.handleAddress.bind(this)} id="landmark" value={modal.landmark} className="address-textfield" minLength="3" maxLength="100"/>
                            <input type="submit" className="address-btn" value="Continue"/>
                        </form>
                        :
                        null
                    }
                    {
                        modal.addAddress ?
                        <form onSubmit={modal.handleSubmit.bind(this)}>
                            <p>Fullname *</p>
                            <input type="text" name="name" value={modal.name} onChange={modal.handleAddress.bind(this)} id="name" className="address-textfield" minLength="2" maxLength="50" required/>
                            <p>Mobile number *</p>
                            <input type="number" name="phone" value={modal.phone} onChange={modal.handleAddress.bind(this)} id="phone" className="address-textfield" min="999999" max="99999999999" required/>
                            <p>Flat, House no, Building *</p>
                            <input type="text" name="house" id="house" onChange={modal.handleAddress.bind(this)} value={modal.house} className="address-textfield" minLength="3" maxLength="100" required/>
                            <p>Area, Street *</p>
                            <input type="text" name="street" id="street" onChange={modal.handleAddress.bind(this)} value={modal.street} className="address-textfield" minLength="3" maxLength="100" required/>
                            <p>City, Town *</p>
                            <input type="text" name="city" id="city" onChange={modal.handleAddress.bind(this)} value={modal.city} className="address-textfield" minLength="3" maxLength="100" required/>
                            <p style={{marginTop:'10px'}}>District * &nbsp;</p>
                            <select className="address-selectoption" onChange={modal.handleAddress.bind(this)} value={modal.district} name="district" >
                                <option>Trivandrum</option>
                                <option>Kollam</option>
                            </select>
                            <p>Pin *</p>
                            <input type="number" name="pin" id="pin" onChange={modal.handleAddress.bind(this)} value={modal.pin} className="address-textfield" min="9999" maxLength="999999" required/>
                            <p>Landmark(Optional)</p>
                            <input type="text" name="landmark" onChange={modal.handleAddress.bind(this)} id="landmark" value={modal.landmark} className="address-textfield" minLength="3" maxLength="100"/>
                            <input type="submit" className="address-btn" value="Continue"/>
                        </form>
                        :
                        null
                    }
                    
                </div>
                <div className="modal-footer_c">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 model-footer-btn">
                            {/* <button className="btn preorder-btn" onClick={modal.continuePurchase.bind(this)}>Continue</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reorder;