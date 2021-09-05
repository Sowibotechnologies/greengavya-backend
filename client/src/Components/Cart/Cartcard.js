import React from 'react';
import { withRouter,Link } from 'react-router-dom';
import './cart.css';

class Cartcard extends React.Component{
    state = {
        cart:[],
        loaded:false,
        changeQuantity:false
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({
                cart:this.props.cartItems,
                loaded:true
            })
        }, 500);
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            this.setState({
                cart:this.props.cartItems,
                loaded:true,
                changeQuantity:this.props.changeQuantity
            })
        }, 400);
        setTimeout(() => {
            this.setState({
                changeQuantity:false
            })
        }, 800);
    }

    handleCheckout(e){
        this.props.history.push('billing');
    }
    Continue(e){
        this.props.history.push('/');
    }

    RemoveItem(productId){
        this.props.removeItem(productId);
    }

    increment(product_id,qty){
        this.props.inc(this,product_id,qty);
    }
    decrement(product_id,qty){
        this.props.dec(this,product_id,qty);
    }

    clearCart(){
        this.props.clearcart();
    }

    render(){
        var total = 0;
        const { cart,loaded } = this.state;
        return(
            <div>
                {
                    this.state.changeQuantity ? <Popupmessage /> : null
                }
                {
                    cart.length <= 0 ?
                    null
                    :
                    <p className="cart-number-count-p">Your cart contain {cart.length} items.</p>
                }
                {
                    loaded ?
                        cart.length <= 0 ?
                        <React.Fragment>
                            <p>You have no items in your shopping cart.</p>
                            <p>Click <Link to={'/'}>here</Link> to continue shopping.</p>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <table className="table table-responsive">
                                <thead>
                                    <tr className="cart-table-head">
                                        <th style={{width:'25px'}}></th>
                                        <th>&nbsp;</th>
                                        <th>Item</th>
                                        <th className="cart-table-price-col">Price</th>
                                        <th style={{minWidth:'75px'}}>Quantity</th>
                                        <th style={{textAlign:'right'}}>Item Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    cart.map((item, i) => {
                                        total = (parseFloat(total) + parseFloat(item.total)).toFixed(2);
                                        return <Productrow Item={item} key={i} removeItem={this.RemoveItem.bind(this)} increment={this.increment.bind(this)} decrement={this.decrement.bind(this)}/>
                                    })
                                }
                                </tbody>
                            </table>
                            <button className="cart-btn" onClick={this.Continue.bind(this)}>Continue Shopping</button>
                            <button className="cart-btn" style={{float:'right'}} onClick={this.clearCart.bind(this)}>Clear Shopping Cart</button>
                            <div className="cart-total-div">
                                <table className="table table-responsive cart-total-table">
                                    <tbody>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>{total}</td>
                                        </tr>
                                        <tr>
                                            <td>Tax</td>
                                            <td>0.00</td>
                                        </tr>
                                        <tr className="cart-total-table-tr">
                                            <td>Grand Total</td>
                                            <td>&#8377; {total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className="cart-btn-inverse" onClick={this.handleCheckout.bind(this)}>Proceed to Checkout</button>
                            </div>
                        </React.Fragment>
                    :
                    <div style={{textAlign:'center',padding:'100px 0px'}}>
                        <h5>Loading...</h5>
                        <p>Please wait</p>
                    </div>
                }
            </div>
        )
    }
}

const Productrow = (Item) =>{
    const product = Item.Item;
    return(
        <tr  className="cart-table-body">
            <td><p className="cart-remove-btn" title={"remove "+ product.productData[0].name} onClick={Item.removeItem.bind(this,product.productId)}>&#10006;</p></td>
            <td className="cart-img-td"><img src={product.productData[0].img_url} style={{paddingRight:'5px'}} className="img-responsive"/></td>
            <td>{product.productData[0].name} {product.productData[0].quantity}<p  className="sm-cart-table-price-col">&#8377; {product.productData[0].price}</p></td>
            <td  className="cart-table-price-col">&#8377; {product.productData[0].price}</td>
            <td>
                <span>
                    <button className="product-inc-btn" style={{borderRadius:'4px 0px 0px 4px'}} onClick={Item.decrement.bind(this,product.productId,product.quantity)}>-</button>
                    <span className="product-qty">{product.quantity}</span>
                    <button className="product-inc-btn" style={{borderRadius:'0px 4px 4px 0px'}} onClick={Item.increment.bind(this,product.productId,product.quantity)}>+</button>
                </span>
            </td>
            <td style={{textAlign:'right'}}>&#8377; {product.total}</td>
        </tr>
    )
}

const Popupmessage = () => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'230px',height:'100px',backgroundColor:'transparent',textAlign:'center',color:'#fff'}}>
                <img src="./images/rotate_loading.svg"/>
                <h4>Updating cart</h4>
                <h5>Please wait..</h5>
            </div>
        </div>
    )
}

export default withRouter(Cartcard);