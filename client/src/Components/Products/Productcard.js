import React from 'react';
import './products.css';

class Productcard extends React.Component{
    state = {
        product:[],
        loaded:false
    }
    componentDidMount(){
        console.log(this.props);
        setTimeout(() => {
            this.setState({
                product:this.props.item,
                loaded:true
            })
        }, 100);
    }
    componentWillReceiveProps(){
        console.log("from will recive props" + this.props);
        setTimeout(() => {
            this.setState({
                product:this.props.item,
                loaded:true
            })
        }, 100);
    }
    render(){
        const {product,loaded} = this.state;
        return(
            
            <React.Fragment>
                {
                    loaded ? 
                        product !== "" ?
                        <div className="col-lg-15 product-card">
                            <div className="product-card-image">
                                <img src={"http://18.222.209.138:3000"+product.img_url} alt={{}} className="product-card-image-img"/>
                            </div>
                            <p className="product-name">{product.name} {product.quantity}</p>
                            {/* <p>Was <del>{product.price}</del></p> */}
                            <p className="product-price-text">Now <span className="product-price">&#8377;{product.price}</span></p>
                            <p>Qty 
                                <span className="product-btns">
                                    <button className="product-inc-btn" style={{borderRadius:'4px 0px 0px 4px'}}>-</button>
                                    <span className="product-qty">1</span>
                                    <button className="product-inc-btn" style={{borderRadius:'0px 4px 4px 0px'}}>+</button>
                                </span>
                            </p>
                            <button className="product-addtocart-btn">Add to cart</button>
                        </div>
                        :
                        <p>Loading...</p>
                    :
                    <p>Please wait...</p>
                }
            </React.Fragment>
        )
    }
}

export default Productcard;