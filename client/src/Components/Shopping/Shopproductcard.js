import React from 'react';
import ReactDOM from 'react-dom';
import '../Products/products.css';
import Cookies from 'js-cookie';
import $ from 'jquery';
import 'jquery.easing';

class Shopproductcard extends React.Component{
    state = {
        product:[],
        productQuantity:1,
        pageLoaded:false,
        addingProduct:false,
        productAdded:false
    }
    componentDidMount(){
        //console.log(this.props);
        setTimeout(() => {
            this.setState({
                product:this.props.item,
                pageLoaded:true,
                addingProduct:false
            })
            console.log(this.props.item);
            
        }, 100);
    }
    componentWillReceiveProps(){
        //console.log("from will recive props" + this.props);
        setTimeout(() => {
            this.setState({
                product:this.props.item,
                pageLoaded:true,
                addingProduct:false
            })
        }, 100);
    }
    addToCart(productId,qty,imgElement){
        this.setState({
            addingProduct:true
        })
        var Key = Cookies.get("_cid");
        fetch('/api/cart/addCart',{
            method:'POST',
            body : JSON.stringify({product_id:productId,product_qty:qty}),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "_cid":Key
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            
            if(result.status === 200){
                this.setState({
                    productAdded:true
                });
                setTimeout(() => {
                    this.setState({
                        productAdded:false,
                        addingProduct:false,
                        productQuantity:1
                    })
                }, 1000);
                this.props.fetchCart(this.state.productAdded);
                var width = window.innerWidth;
                if(width < 766){
                    
                }else{
                    this.flycart(imgElement);
                }
            }else{
                alert(result.message);
                this.setState({
                    productAdded:false,
                    addingProduct:false,
                })
            }
            
        })
        
    }
    flycart(imgElement){
        var cart = $('.sidecart-head-img');
        var imgtodrag =  $(ReactDOM.findDOMNode(imgElement.r)).eq(0);
        setTimeout(() => {
            if (imgtodrag) {
                var imgclone = imgtodrag.clone()
                    .offset({
                    top: imgtodrag.offset().top,
                    left: imgtodrag.offset().left
                })
                    .css({
                        'opacity': '0.5',
                        'position': 'absolute',
                        'height': '150px',
                        'width': '150px',
                        'z-index': '100'
                })
                    .appendTo($('body'))
                    .animate({
                        'top': cart.offset().top + 10,
                        'left': cart.offset().left + 10,
                        'width': 75,
                        'height': 75
                    }, 800, 'easeInOutExpo');
                imgclone.animate({
                    'width': 0,
                        'height': 0
                }, function () {
                    $(this).detach()
                });
            }
        }, 200);
        
    }
    increProduct(){
        const {productQuantity} =this.state;
        if(productQuantity <= 9){
            this.setState({
                productQuantity:(productQuantity + 1)
            })
        }
    }
    decreProduct(){
        const {productQuantity} =this.state;
        if(productQuantity >= 2){
            this.setState({
                productQuantity:(productQuantity - 1)
            })
        }
    }
    
    render(){
        const {product,pageLoaded,addingProduct,productAdded,productQuantity} = this.state;
        return(
            
            <React.Fragment>
                {
                    pageLoaded ? 
                        product !== "" ?
                            !productAdded ?
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 product-card">
                                    <div className="product-card-image">
                                        <img src={product.img_url} alt={{}} ref={'r'} className="product-card-image-img"/>
                                    </div>
                                    <p className="product-name">{product.name}&nbsp;&nbsp;{product.quantity}<br/>
                                    {
                                        product.translated !== "" ?
                                        <span style={{fontSize:'12px'}}>({product.translated})</span>
                                        :
                                        null
                                    }
                                    </p>
                                    <p>{product.food_type} food</p>
                                    {/* <p>Was <del>{product.price}</del></p> */}
                                    <p className="product-price-text">Now <span className="product-price">&#8377;{product.price}</span></p>
                                    <p>Qty 
                                        <span className="product-btns">
                                            <button className="product-inc-btn" style={{borderRadius:'4px 0px 0px 4px'}} onClick={this.decreProduct.bind(this)}>-</button>
                                            <span className="product-qty">{productQuantity}</span>
                                            <button className="product-inc-btn" style={{borderRadius:'0px 4px 4px 0px'}} onClick={this.increProduct.bind(this)}>+</button>
                                        </span>
                                    </p>
                                    <button className="product-addtocart-btn" disabled={addingProduct} onClick={this.addToCart.bind(this,product.product_id,productQuantity,this.refs)}>
                                        {
                                            addingProduct ?
                                            "Adding"
                                            :
                                            "Add to Cart"
                                        }
                                    </button>
                                </div>
                                :
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 product-card">
                                    <div className="product-card-added-mask">
                                        <p><img src="./icons/add.png" width="24"/></p>
                                        <p>Product added</p>
                                    </div>
                                    <div style={{opacity:0.3}}>
                                        <div className="product-card-image">
                                            <img src={product.img_url} alt={{}} ref={'r'} className="product-card-image-img"/>
                                        </div>
                                        <p className="product-name">{product.name} {product.quantity}</p>
                                        {/* <p>Was <del>{product.price}</del></p> */}
                                        <p className="product-price-text">Now <span className="product-price">&#8377;{product.price}</span></p>
                                        <p>Qty 
                                            <span className="product-btns">
                                                <button className="product-inc-btn" style={{borderRadius:'4px 0px 0px 4px'}}>-</button>
                                                <span className="product-qty">{productQuantity}</span>
                                                <button className="product-inc-btn" style={{borderRadius:'0px 4px 4px 0px'}}>+</button>
                                            </span>
                                        </p>
                                        <button className="product-addtocart-btn" disabled>Add to cart</button>
                                    </div>
                                    
                                </div>
                        :
                        <p>Loading...</p>
                    :
                    <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 product-card">
                    <div className="wrapper">
                        <div className="card-loader">
                            <div className="image">
                            </div>
                            <div className="p_title">
                            </div>
                            <div className="p_price">

                            </div>
                            <div style={{display: 'flex'}}>
                                <div className="p_qty"></div>
                                <div className="p_qty" style={{width: '60px',marginLeft:'20px'}}></div>
                            </div>
                            <div className="p_button"></div>
                        </div>
                    </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}
/*

click = > button disable(adding to cart)
adding product
added product


*/

export default Shopproductcard;