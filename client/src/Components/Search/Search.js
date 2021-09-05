import React from 'react';
import ReactDOM from 'react-dom';
import Shopproductcard from '../Shopping/Shopproductcard';
import '../Shopping/shopping.css';
import Cookies from 'js-cookie';
import { Link,withRouter } from 'react-router-dom';

class Search extends React.Component{
    state = {
        totalProducts:[],
        isFetched : false,
        products:[],
        currentPage: 1,
        itemsPerPage: 16,
        category:[],
        selectedCategory:"All Products",
        cart:[],
        cartUpdate:false
    }
    componentDidMount(){
        
        
    }
    componentWillReceiveProps(){
        console.log("Shopping recive props");
        
        
        setTimeout(() => {
           if(this.props.searchWord !== ""){
                console.log("search word found");
                this.handleSearchMain();
                //console.log(this.props.changeQuantity);
                if(this.props.changeQuantity){
                    this.setState({
                        cartUpdate:!this.props.changeQuantity
                    })
                }
                this.setState({
                    cart:this.props.cartItems
                })
            }
            // else{
            //     //console.log("else");
            //     console.log("search word not found");
            //     //console.log(this.props);
            //     if(this.props.qtyMessage == "yes" && this.props.changeQuantity){
            //         //this.fetchProducts();   // need more checking
            //         this.setState({
            //             cart:this.props.cartItems,
            //             cartUpdate:!this.props.changeQuantity
            //         })
            //     }
            //     this.fetchProducts();  // need more checking
            //     this.setState({
            //         cart:this.props.cartItems
            //     })
            //     // if(!this.props.searchMode){
            //     //     this.fetchProducts();
            //     // }
            //     const cartNode = ReactDOM.findDOMNode(this.refs.sidecart);
            //     cartNode.scrollTop = cartNode.scrollHeight;
            // }
        }, 200);
    }
    fetchProducts(){
        var set = new Set();
        fetch("/api/product/products")
        .then(res => res.json())
        .then(result => {
            Object.keys(result).map((item) => {
                if(result[item].category_name !== 'NONE'){
                    set.add(result[item].category_name);
                }
            })
            var arr = Array.from(set);
            this.setState({
                isFetched:true,
                products: result,
                totalProducts: result,
                category:arr,
                selectedCategory:"All Products",
                pageNumbers:1
            });
        }).catch((err) => console.log(err));
    }
    handleSearchMain(){
        var txt = this.props.searchWord;
        var set = new Set();
        if(txt !== ""){
            this.setState({
                isFetching :false,
                searching:true,
                currentPage: 1
            })
            fetch('/api/product/search_p/'+txt)
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }else{
                    //alert("no result found!!");
                    throw res;
                }
            })
            .then(result => {
                if(result.length == 0){
                    this.setState({
                        productnotfound:true,
                        products:[],
                        isFetching :true,
                        totalProducts: []
                    })
                }else{
                    Object.keys(result).map((item) => {
                        if(result[item].category_name !== 'NONE'){
                            set.add(result[item].category_name);
                        }
                    })
                    var arr = Array.from(set);
                   this.setState({
                        productnotfound:false,
                        products: result,
                        totalProducts: result,
                        isFetching :true,
                        selectedCategory:"All Products",
                        category:arr,
                    }) 
                }
            })
            .catch(err => {
                console.log(err);
                
            })
        }else{
            setTimeout(() => {
                this.fetchData(0)
            }, 100);
        }
    }
    
    onPageChange(event){
        //console.log("on page change");
        this.setState({
            currentPage: Number(event.target.id)
        });
        const productlistPos = ReactDOM.findDOMNode(this.refs.productList);
        window.scrollTo(0, productlistPos.offsetTop);           //scroll to position
    }
    getProductByCategory(category){
        const {totalProducts} = this.state;
        if(category !== "allproducts"){
            var arr = [];
            Object.keys(totalProducts).map((item) =>{
                if(totalProducts[item].category_name === category){
                    arr.push(totalProducts[item]);
                }
            })
            this.setState({
                products:arr,
                selectedCategory:category,
                currentPage:1
            })
        }else{
            this.setState({
                products:totalProducts,
                selectedCategory:"All Products",
                currentPage:1
            })
        }
    }
    sortProducts(e){
        //console.log("sorting product");
        
        const {totalProducts} = this.state;
        const sortType = e.target.value;
        //console.log(sortType);
        const productlistPos = ReactDOM.findDOMNode(this.refs.productList);
        window.scrollTo(0, productlistPos.offsetTop);
        switch(sortType){
            case 'lowtohigh':
                var products = this.state.products.sort(function(a,b){
                    return parseInt(a.price) - parseInt(b.price);
                })
                setTimeout(() => {
                    this.setState({
                        products:products,
                        currentPage:1
                    })
                }, 200);
                break;
            case 'hightolow':
                var products = this.state.products.sort(function(a,b){
                    return parseInt(b.price) - parseInt(a.price);
                })
                setTimeout(() => {
                    this.setState({
                        products:products,
                        currentPage:1
                    })
                }, 200);
                break;
            case 'AtoZ':
                var products = this.state.products.sort(function(a,b){
                    var nameA = a.name.toUpperCase().trim();
                    var nameB = b.name.toUpperCase().trim();
                    if(nameA < nameB){
                        return -1;
                    }
                    if(nameA > nameB){
                        return 1;
                    }
                    //equal name
                    return 0;
                })
                setTimeout(() => {
                    this.setState({
                        products:products,
                        currentPage:1
                    })
                }, 200);
                break;
            case 'ZtoA':
                var products = this.state.products.sort(function(a,b){
                    var nameA = a.name.toUpperCase().trim();
                    var nameB = b.name.toUpperCase().trim();
                    if(nameA < nameB){
                        return 1;
                    }
                    if(nameA > nameB){
                        return -1;
                    }
                    //equal name
                    return 0;
                })
                setTimeout(() => {
                    this.setState({
                        products:products,
                        currentPage:1
                    })
                }, 200);
                break;
            default:
                if(this.props.searchWord !== ""){
                    this.setState({
                        products:totalProducts,
                        selectedCategory:"All Products",
                        currentPage:1
                    })
                }else{
                    this.fetchProducts();
                }
        }
        
        
    }
    removeFromCart(prodId){
        this.setState({
            cartUpdate:true
        })
        this.props.removeItem(prodId);
    }
    incrementQty(productId,operation,qty){
        this.setState({
            cartUpdate:true
        })
        this.props.INC(this,productId,qty);
    }
    decrementQty(productId,operation,qty){
        this.setState({
            cartUpdate:true
        })
        this.props.DEC(this,productId,qty);
    }
    clearAllCartItems(){
        this.props.clearCart();
    }
    Checkout(){
        this.props.history.push('/cart');
    }
    gotoMain(){
        window.location.href = "/"
    }
    render(){
        const {products,currentPage,itemsPerPage,filteredView,category,selectedCategory,isFetched,isFetching} = this.state;
        var total = 0;
        const pageNumbers = [];
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Object.entries(products).slice(firstIndex,lastIndex);
        for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li key={number} className={(this.state.currentPage === number ? 'active ' : '') + 'controls'}><a 
                id={number}
                onClick={this.onPageChange.bind(this)}
              >
                {number}
              </a>
              </li>
            );
          });
          const startingIndex = firstIndex;
        return(
            <React.Fragment>
                {
                    this.state.cartUpdate ? <Popupmessage /> : null
                }
                <div className="container product-container" ref="productList">
                    <div className="row">
                        <div className="col-lg-2 col-md-2 col-sm-2">
                        {
                                products.length < 1 ?
                                null
                                :
                                <ul className="product-category-list">
                                    <li className={selectedCategory === "All Products" ? 'product-category-list-li-active' : 'product-category-list-li'} onClick={this.getProductByCategory.bind(this,"allproducts")}>All&nbsp;Products</li>
                                    {
                                        category.map(item => {
                                            return <li key={item} className={selectedCategory === item ? 'product-category-list-li-active' : 'product-category-list-li'} onClick={this.getProductByCategory.bind(this,item)}>{item}</li>
                                        })
                                    }
                                </ul>
                        }
                            
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8">
                            {
                                !isFetching ?
                                <h4 style={{textAlign:'center',marginTop:'100px'}}>Please wait...</h4>
                                :
                                products.length < 1 ?
                                <React.Fragment>
                                    <p className="shop-notfound-img"><img src="./icons/ic_404_1.png" style={{height:'50px'}}/></p>
                                    <h3 style={{textAlign:'center'}}>Product not found.</h3>
                                </React.Fragment>
                                
                                :
                                <React.Fragment>
                                {
                                    this.props.searchWord !== "" ? <h5 className="product-backtoshopping" onClick={()=>{window.location="/";}}>&#8810;Back to Shopping</h5> : null
                                }
                                    
                                {
                                    this.props.searchWord !== "" ? <h3 className="product-searchresult-head">Search results for "{this.props.searchWord}"</h3> : <h3 className="product-head">{selectedCategory}</h3>
                                }
                                
                                <div className="shop-filter" style={{borderBottom: '1px solid #ddd'}}>
                                <p>Items {startingIndex + 1} to {((startingIndex + 1) + currentItemList.length)-1} of {products.length} total</p>
                                <ul className="page-numbers pagination">
                                    {renderPageNumbers}
                                </ul>
                                    <span className="shop-filter-list">
                                        Sort by&nbsp;
                                        <select onChange={this.sortProducts.bind(this)}>
                                            <option value="relevance">Relevance</option>
                                            <option value="lowtohigh">Price - Low to High</option>
                                            <option value="hightolow">Price - high to Low</option>
                                            <option value="AtoZ">Name - A to Z</option>
                                            <option value="ZtoA">Name - Z to A</option>
                                        </select>
                                    </span>
                                </div>
                                <div className="row">
                                {
                                    Object.keys(currentItemList).map((item,id) => {
                                        return(
                                            <Shopproductcard key={id} item={currentItemList[item][1]} keys={id} fetchCart={this.props.fetchCart}/>
                                        )
                                    })
                                }
                                
                                </div>
                                <div className="shop-filter" style={{borderTop: '1px solid #ddd',marginTop:'22px',paddingTop:'20px'}}>
                                    <p>Items {startingIndex + 1} to {((startingIndex + 1) + currentItemList.length)-1} of {products.length} total</p>
                                    <ul className="page-numbers pagination">
                                        {renderPageNumbers}
                                    </ul>
                                    <span className="shop-filter-list">
                                        {/* Sort by&nbsp;
                                        <select onChange={this.sortProducts.bind(this)}>
                                            <option value="relevance">Relevance</option>
                                            <option value="lowtohigh">Price - Low to High</option>
                                            <option value="hightolow">Price - high to Low</option>
                                            <option value="AtoZ">Name - A to Z</option>
                                            <option value="ZtoA">Name - Z to A</option>
                                        </select> */}
                                    </span>
                                </div>
                                
                                </React.Fragment>
                            }
                            
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2" style={{paddingRight:'0px',paddingLeft:'0px',position:'sticky',top:'0'}}>
                            <div className="sidecart-div" style={{width:'100%',marginTop:'62px',borderRadius:'5px'}}>
                                <h4 className="sidecart-head">Shopping cart <img src="./images/ic_cart.png" className="sidecart-head-img"/></h4>
                                <div className="sidecart-item-list-div" ref="sidecart" id="sidecart-div">
                                    {
                                        isFetching ?
                                            this.state.cart.length > 0 ?
                                                this.state.cart.map(i => {
                                                    total = (parseFloat(total) + parseFloat(i.total)).toFixed(2);
                                                    return(
                                                            <div key={i.productId} className="row sidecart-item-row" style={{borderBottom:'1px dashed #ddd'}}>
                                                                <div className="col-lg-4 sidecart-item-row-imgdiv">
                                                                    <img src={i.productData[0].img_url} className="sidecart-item-row-img"/>
                                                                </div>
                                                                <div className="col-lg-8">
                                                                    <span className="sidecart-itemremove-btn" onClick={this.removeFromCart.bind(this,i.productId)}>&#10006;</span>
                                                                    <p style={{margin:'2px 0px',fontWeight:'400'}}>{i.productData[0].name}</p>
                                                                    <p style={{margin:'2px 0px'}}>&#8377;{i.productData[0].price}</p>
                                                                    <div>
                                                                    <button className="sidecart-qty-btn" onClick={this.decrementQty.bind(this,i.productId,"DEC",i.quantity)}>-</button>
                                                                    <span className="sidecart-qty-span" style={{marginLeft:'2px'}}>{i.quantity}</span>
                                                                    <button className="sidecart-qty-btn" style={{marginLeft:'2px'}} onClick={this.incrementQty.bind(this,i.productId,"INC",i.quantity)}>+</button>
                                                                    </div>
                                                                    <p style={{margin:'4px 0px'}}>Total: &#8377;{i.total}</p>
                                                                </div>
                                                            </div>
                                                    )
                                                })
                                            :
                                            <div className="sidecart-empty-div">
                                                <img src="./images/empty_cart.png"/>
                                                <p>Your cart is empty!</p>
                                            </div>
                                        :
                                        <div className="sidecart-empty-div">
                                            <img src="./images/spin.svg"/>
                                            <p>Loading!</p>
                                        </div>
                                    }
                                </div>
                                <div className="row sidecart-item-row sidecart-total" style={{borderRight:'1px solid #ddd',borderLeft:'1px solid #ddd'}}>
                                    <p>Total: &#8377;<span>{total}</span></p>
                                </div>
                                <div className="row sidecart-item-row">
                                    <div>
                                        <button className="sidecart-checkout-btn" onClick={this.Checkout.bind(this)}>CHECKOUT</button>
                                    </div>
                                    <div className="sidecart-clear-btn" >
                                        <span onClick={this.clearAllCartItems.bind(this)}>CLEAR CART</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.searchWord !== "" ?
                    <div className="search-continue-div">
                        <p style={{fontSize:'18px',paddingBottom:'20px'}}>Or</p>
                        <Link to={'/'} onClick={this.gotoMain.bind(this)} className="search-continue-btn">Continue Shopping</Link>
                    </div>
                    
                    :
                    null
                }
            </React.Fragment>
        )
    }
}
const Popupmessage = () => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'230px',height:'100px',backgroundColor:'transparent',textAlign:'center',color:'#fff'}}>
                <img src={window.location.origin +"/images/rotate_loading.svg"}/>
                <h4>Updating cart</h4>
                <h5>Please wait..</h5>
            </div>
        </div>
    )
}

export default withRouter(Search);