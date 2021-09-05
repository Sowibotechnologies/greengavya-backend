import React from 'react';
import Footer from '../Footer/Footer';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';
import './cart.css';
import Cartcard from './Cartcard';
import Cookies from 'js-cookie';
import HeaderSmall from '../Header/HeaderSmall';

class Cart extends React.Component{
    state = {
        cart:[],
        cartCount:0,
        changeQuantity:false,
        cartLoading:true
    }
    componentDidMount(){
        document.title = "Cart";
        window.scrollTo(0, 0);
        this.getCart();
    }

    componentWillReceiveProps(){
        window.scrollTo(0, 0);
        this.getCart();
    }

    deleteCartItems(key,productId){
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

    removeCartItem(product_id){
        var Key = Cookies.get("_cid");
        this.deleteCartItems(Key,product_id);
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

    getCart(changeQuantityStatus){
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
                    if(changeQuantityStatus !== undefined){
                        this.setState({
                            cartCount:result.result.length,
                            cart:result.result,
                            changeQuantity:true
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
                this.setState({
                    cartLoading:false
                })
            })
        }
    }
    ClearAllItems(){
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
                this.getCart();
                //window.location.reload();
                window.scrollTo(0, 0);
            }else{
                alert("Cart is Already empty!!");
                
            }
        })
        .catch(e => {
            console.log(e);
        })
    }
    render(){
        const {cartCount} = this.state;
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
                    <div className="container product-container">
                        <div className="row">
                            <div className="col-lg-1 col-md-1">
                                
                            </div>
                            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                <h3 className="product-head">Shopping cart</h3>
                                {
                                    this.state.cartLoading ?
                                    <div style={{textAlign:'center',padding:'100px 0px'}}>
                                        <h5>Loading...</h5>
                                        <p>Please wait</p>
                                    </div>
                                    :
                                    <Cartcard changeQuantity={this.state.changeQuantity} clearcart={this.ClearAllItems.bind(this)} cartItems={this.state.cart} removeItem={this.removeCartItem.bind(this)} inc={this.INC_QTY.bind(this)} dec={this.DEC_QTY.bind(this)}/>
                                }
                                
                            </div>
                            <div className="col-lg-1 col-md-1">
                                
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default Cart;