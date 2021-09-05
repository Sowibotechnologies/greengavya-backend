import React from 'react';
import ReactDOM from 'react-dom';
import Shopping from './Shopping';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Imageslider from '../Imageslider/Imageslider';
import Cookies from 'js-cookie';
import HeaderSmall from '../Header/HeaderSmall';
import Navbaroffer from '../Offers/Navbaroffer';

class Shop extends React.Component{
    state = {
        cart:[],
        cartCount:0,
        searchMode:false,
        searchWord:'',
        changeQuantityStatus:false,
        qtyMessage:'',
        loadingPopup:false
    }
    componentDidMount(){
        var cacheId = Cookies.get('_cid');
            if(cacheId == null){
            this.setCookie();
        }
        document.title = "Greengavya";
        setTimeout(() => {
            if(this.props.location.state !== undefined){
                //console.log(this.props.location.state.detail);
                this.setState({
                    searchMode:true,
                    searchWord:this.props.location.state.detail
                })
            }
        }, 100);
        
        window.scrollTo(0, 0);
        this.getCart(false);
        
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            if(this.props.location.state !== undefined){
                //console.log(this.props.location.state.detail);
                this.setState({
                    searchMode:true,
                    searchWord:this.props.location.state.detail
                })
            }else{
                this.setState({
                    searchMode:false,
                    searchWord:''
                })
            }
        }, 100);
        this.getCart(false);
        var cacheId = Cookies.get('_cid');
            if(cacheId == null){
            this.setCookie();
        }
    }

    setCookie(){
        var ran = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)).toUpperCase();
        Cookies.set('_cid', ran, { expires: 7 });
    }

    getCart(changeQuantityStatus){
        var qtyMessage = "no";
        if(changeQuantityStatus) {
            qtyMessage = "yes";
        }
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
                //console.log(result);
                
                if(result.result != null){
                    if(this.state.changeQuantityStatus != undefined){
                        this.setState({
                            cartCount:result.result.length,
                            cart:result.result,
                            changeQuantity:changeQuantityStatus,
                            qtyMessage:qtyMessage
                        })
                    }else{
                        this.setState({
                            cartCount:result.result.length,
                            cart:result.result
                        })
                    }
                }else{
                    this.setState({
                        cartCount:0,
                        cart:[]
                    })
                }
            })
        }
    }

    FetchCartByKey(status){
        var Key = Cookies.get("_cid");
        if(status){
            //console.log("cart updating");
            this.getCart();
        }else{
            //console.log("failed");
        }
    }

    deleteCartItems(productId){
        var key = Cookies.get("_cid");
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
                this.getCart(true);
            })
            .catch(e => {
                console.log(e);
            })
    }
    ClearAllItems(){
        this.setState({
            loadingPopup:true
        })
        var key = Cookies.get("_cid");
        fetch('/api/cart/_cdel',{
            method : 'DELETE',
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "_cid":key
            }
        })
        .then(res => {
            if(res.status === 200){
                this.getCart(true);
            }else{
                alert("Cart is Already empty!!");
            }
            this.setState({
                loadingPopup:false
            })
        })
        .catch(e => {
            console.log(e);
        })
    }
    INC_QTY(context,product_id, qty){
        if(qty <= 10){
            var Key = Cookies.get("_cid");
            this.changeQuantity(Key,product_id,"INC",qty);
        }
    }
    DEC_QTY(context,product_id, qty){
        if(qty >= 1){
            var Key = Cookies.get("_cid");
            this.changeQuantity(Key,product_id,"DEC",qty);
        }
    }

    changeQuantity(key,productId,operation,qty){
        this.setState({
            changeQuantity:false
        })
        fetch('/api/cart/cartQty',{
            method : 'PUT',
            body : JSON.stringify({product_id:productId,operation:operation,quantity:qty}),
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                    "_cid": key
                }
            })
            .then(res => res.json())
            .then(result => {
                if(result.status == 406){
                    alert(result.message);
                }
                // this.setState({
                //     changeQuantity:true
                // })
                this.getCart(true);
            })
            .catch(e => {
                console.log(e);
            })
    }
    render(){
        const { cart,cartCount,searchMode,searchWord, loadingPopup, totalProducts } = this.state;
        return(
            <React.Fragment>
                {
                    loadingPopup ? <Popupmessage msg="Please wait..."/> : null
                }
                <div className="container-fluid shop">
                    {/* <Navbaroffer /> */}
                    <div className="c_respo_nav-large">
                        <Header cartCount={cartCount} searchMode={searchMode} searchWord={searchWord}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={cartCount} products={totalProducts} searchMode={searchMode} searchWord={searchWord}/>
                    </div>
                    <Navigation/>
                    
                    {
                        searchMode ? 
                        null
                        :
                        <Imageslider/>
                    }
                    <Shopping qtyMessage={this.state.qtyMessage} changeQuantity={this.state.changeQuantity} searchMode={searchMode} searchWord={searchWord} clearCart={this.ClearAllItems.bind(this)} fetchCart={this.FetchCartByKey.bind(this)} INC={this.INC_QTY.bind(this)} DEC={this.DEC_QTY.bind(this)} removeItem={this.deleteCartItems.bind(this)} cartItems={cart}/>
                    <Footer/>
                </div>
            </React.Fragment>
        )
    }
}

const Popupmessage = (msg) => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'230px',height:'100px',backgroundColor:'transparent',textAlign:'center',color:'#fff'}}>
                <h3>{msg.msg}</h3>
            </div>
        </div>
    )
}

export default Shop;