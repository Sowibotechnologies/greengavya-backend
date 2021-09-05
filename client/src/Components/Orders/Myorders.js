import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Preorder from './Preorder';
import HeaderSmall from '../Header/HeaderSmall';

class Myorders extends React.Component{

    state ={
        cartCount:0,
        loggedIn:false,
        orders:[],
        loading:false,
        orderids:[],
        OrderLoad:10,
        TotalOrders:0,
        LoadedOrders:0,
        showModal:false,
        available:[],
        choosedOrderid:'',
        choosedAddresid:'',
        wait:false
    }
    componentDidMount(){
        document.title = "Myorders";
        this.getCart();
        var logged = this.CheckAuth();
        if(logged){
            this.setState({
                loggedIn:true
            })
            this.getOrderLength();
            this.ShowOrderDetails(this.state.OrderLoad);
        }else{
            this.setState({
                loggedIn:false
            })
        }
    }
    componentWillReceiveProps(){
        this.getCart();
        var logged = this.CheckAuth();
        if(logged){
            this.setState({
                loggedIn:true
            })
            this.getOrderLength();
            this.ShowOrderDetails(this.state.OrderLoad);
        }else{
            this.setState({
                loggedIn:false
            })
        }
    }

    getOrderLength(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        fetch("/api/order/orderlengthbyid",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "token":token,
                "sessionid":session
            }
        })
        .then(res => {
            if(res.status === 200){
                return res.json();
            }else{
                this.setState({
                    loggedIn:false
                })
            }
        })
        .then(result => {
            this.setState({
                TotalOrders:result
            })
        })
    }

    orderReorder(orderId, addressId){
        //show wait
        this.setState({
            wait:true
        })

        fetch('/api/product/getproductsbyorderid',{
            method:'POST',
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            body:JSON.stringify({orderid:orderId})
        })
        .then(res => res.json())
        .then(result => {
            if(result.length > 0){
                
                this.setState({
                    available:result,
                    showModal:true,
                    choosedOrderid:orderId,
                    choosedAddresid:addressId,
                    wait:false
                })
            }else if(result.length <= 0){
                alert("Product Currently not available!!");
                this.setState({
                    wait:false
                })
            }
        })
    }

    ShowOrderDetails(orderperpage){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        fetch("/api/order/orderbyid",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "token":token,
                "sessionid":session
            },
            body:JSON.stringify({orderperpage:orderperpage})
        })
        .then(res => {
            if(res.status === 200){
                return res.json();
            }else{
                this.setState({
                    loggedIn:false
                })
            }
        })
        .then(result => {
            this.setState({
                orders:result,
                loading:true,
                OrderLoad:this.state.OrderLoad + 10,
                LoadedOrders:result.length
            })
            this.showChild();
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

    showChild(){
        setTimeout(() => {
            if(this.state.orders != ""){
                var _s = new Set();
                this.state.orders.map(i => {
                    
                    _s.add(i.orderid);
                })
                this.setState({
                    orderids:_s
                })
                // setTimeout(() => {
                //     console.log(this.state.orderids);
                    
                // }, 100);
                
            }else{

            }
        }, 200);
    }
    showNextOrders(nextPageLoad){
        this.ShowOrderDetails(nextPageLoad);
    }

    gotoShop(){
        this.props.history.push("/");
    }
    changeQty(){

    }

    continuePurchase(){
        //wait
        this.setState({
            wait:true
        })
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
                this.props.parentProps.props.history.push('/locked');
            }else if(res.status == 200){
                //this.ReorderByOrderId(this.state.available,this.state.choosedAddresid);
                this.props.history.push({
                    pathname: '/reorder',
                    state: { 
                        reorderProducts: this.state.available,
                        reorderAddress: this.state.choosedAddresid,
                        prePath:'myorders'
                    }
                });
            }else if(res.status == 401){
                alert("Unauthorized User!!");
                Cookies.remove('_token', { path: '' });
                Cookies.remove('sessionID', { path: '' });
                this.props.parentProps.props.history.push('/');
            }
        })
    }

    ReorderByOrderId(data, addressid){
        if(data !== ""){
            var token = Cookies.get("_token");
            var session = Cookies.get("sessionID");
            if(token !== undefined && session !== undefined){
                fetch("/api/product/reorder", {
                    method:'POST',
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                        "token":token,
                        "sessionid":session,
                        "loc":addressid
                    },
                    body:JSON.stringify({data:data})
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

    closeModal(){
        this.setState({
            showModal:false
        })
    }

    render(){
        const { loggedIn,loading,orderids, orders } = this.state;
        var parent = [];
        var orderss = Array.from(orderids).map(j => {
            var child = [];
            orders.map(i => {
                if(j == i.orderid){
                    //child.push(i);
                    child.push(i)
                }
            })
            //console.log(child);
            parent.push(child);
            
        })
        const {cartCount, TotalOrders, LoadedOrders} = this.state;
        
        return(
            <React.Fragment>
                {
                    this.state.wait ? <Popup /> : null
                }
                {
                    this.state.showModal ? <Showmodal  qtychange={this.changeQty.bind(this)} continuePurchase={this.continuePurchase.bind(this)}  data={this.state.available} closebtn={this.closeModal.bind(this)}/> : null
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
                        <p className="order-viewmore-btn" style={{marginBottom:'40px'}} onClick={this.gotoShop.bind(this)}>Continue Shopping</p>
                        <h3 className="product-head" style={{marginTop:'0px'}}>My Orders</h3>
                        {
                            loggedIn ?
                                loading ?
                                    parent !== "" ?
                                        <Preorder data={parent} LoadedOrders={LoadedOrders} TotalOrders={TotalOrders} orderLoad={this.state.OrderLoad} reorder={this.orderReorder.bind(this)} showNextOrders={this.showNextOrders.bind(this)}/>
                                    :
                                    <div>
                                        <p>You don't have any orders yet.</p>
                                    </div>
                                :
                                    <div>
                                        <p>Loading...</p>
                                    </div>
                            :
                            <div>
                                <p>You need to login to continue.</p>
                                <p>Click <Link to={'/login'}>here</Link> to login</p>
                            </div>
                        }
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

const Showmodal = (modal) => {
    var data = modal.data;
    return(
        <div id="myModal" className="modal_c">
            <div className="modal-content_c">
                <div className="modal-header_c">
                    <span className="close_c" onClick={modal.closebtn.bind(this)}>&times;</span>
                    <h3>These item(s) are only available</h3>
                </div>
                <div className="modal-body_c">
                    {
                        data.map((item,i) => {
                            return(<Itemtemplate itemdetail={item} qtychange={modal.qtychange.bind(this)} key={i}/>)
                        })
                    }
                </div>
                <div className="modal-footer_c">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 model-footer-btn">
                            <button className="btn preorder-btn" onClick={modal.continuePurchase.bind(this)}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Itemtemplate = (data) => {
    
    var itemData = data.itemdetail.product;
    var _html=[];
    for(var i=1; i<=10;i++){
        _html.push(<option value={i} key={i}>{i}</option>)
    }
    return(
        <div className="row">
            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-4" >
                <img src={itemData.img_url} alt={itemData.name} className="img-responsive"/>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-10 col-xs-8">
                <h5 style={{marginTop: '12px',marginBottom: '2px',textTransform:'capitalize'}}>{itemData.name}</h5> 
                <i style={{color:'#8e8e8e',fontSize:'12px'}}>{data.itemdetail.qty}&nbsp;&#10005;&nbsp;{itemData.quantity}</i>
                {/* <h5>Total :<span style={{fontSize:'22px'}}>{itemData.price * data.itemdetail.qty}</span>&nbsp;&#8377;</h5>
                <h5>Quantity: 
                    <select value={data.itemdetail.qty} onChange={data.qtychange.bind(this, itemData.product_id)}>
                        {
                           _html
                        }
                    </select>
                </h5> */}
            </div>
        </div>
    )
}

const Popup = (p) => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'230px',height:'100px',backgroundColor:'transparent',textAlign:'center',color:'#fff'}}>
                <h3>Please wait...</h3>
            </div>
        </div>
    )
}

export default Myorders;