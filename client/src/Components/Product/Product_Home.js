import React from 'react';

class Product_Home extends React.Component{
    state={
        products: [],
        filteredView:'',
        isFetching: true,
        currentPage: 1,
        itemsPerPage: 12
    }
    componentDidMount(){
        this.fetchProducts();
    }

    fetchProducts(){
        fetch("http://18.222.209.138:4000/api/product/getall")
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                products: result
            });
            if(this.state.filteredView !== ''){
                this.setState({
                    filteredView: result.filter(item => item.category_name === this.refs.category_filter.value)
                });
            }
            console.log('====================================');
            console.log(result);
            console.log('====================================');
        }).catch((err) => console.log(err));
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    render(){
        const {products,currentPage,itemsPerPage,filteredView} = this.state;
        const pageNumbers = [];
        if(filteredView === '')
        {
            const lastIndex = currentPage*itemsPerPage;
            const firstIndex = lastIndex - itemsPerPage;
            var currentItemList = Object.entries(products).slice(firstIndex,lastIndex);
            for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
              pageNumbers.push(i);
            }
        }
        else{
            const lastIndex = currentPage*itemsPerPage;
            const firstIndex = lastIndex - itemsPerPage;
            var currentItemList = Object.entries(filteredView).slice(firstIndex,lastIndex);
            for (let i = 1; i <= Math.ceil(filteredView.length / itemsPerPage); i++) {
              pageNumbers.push(i);
            }
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className={(this.state.currentPage === number ? 'active ' : '') + 'controls'}><a
                key={number}
                id={number}
                onClick={this.onPageChange.bind(this)}
              >
                {number}
              </a>
              </li>
            );
          });
          
        return(
            <React.Fragment>
                    <div id="myCarousel" class="carousel slide" data-ride="carousel">
                        <ol class="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                        <li data-target="#myCarousel" data-slide-to="1"></li>
                        </ol>
                        <div class="carousel-inner">
                            <div class="item active">
                                <img src="/images/banner1.jpg" alt="Banner" style={{width:'100%'}}/>
                            </div>
                            <div class="item">
                                <img src="/images/banner2.jpeg" alt="Banner" style={{width:'100%'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="container product-div">
                        <h2>Monthly specials</h2>
                        <a className="product-div-more">Read more</a>
                    </div>
                    <div className="container" style={{padding:'0px 86px'}}>
                        
                        <div class="row">
                        {
                            Object.keys(currentItemList).map((item) => {
                                return(
                                    <ProductCard data={currentItemList[item][1]} context={this} key={currentItemList[item][1].product_id}/>
                                )
                            })
                        }
                            {/* <div class="col-xs-2" id="p1">
                                <div class="product-card text-left">
                                    <img src="/images/test_image1.png" alt="Avatar" style={{width:'100%'}}/>
                                    <p className="product-name">Coriander 200gm</p> 
                                    <p style={{fontSize:'13px'}}>Was <span style={{textDecoration:'line-through'}}>&#8377;28.8</span></p>
                                    <p>Now <b style={{color:'696969',fontSize:'20px'}}>&#8377;18.5</b></p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                            <p>Qty</p> 
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                            <div class="input-group home_search_bar_div" style={{float:'right',width:'100%'}}>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-minus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" aria-label="search" autocomplete="off" class="form-control home_search_bar_input"  name="search"/>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <btn className="btn-add" >Add to cart  </btn>
                                </div>
                            </div>
                            <div class="col-xs-2 col-half-offset" id="p2">
                            <div class="product-card text-left">
                                    <img src="/images/test_image1.png" alt="Avatar" style={{width:'100%'}}/>
                                    <p className="product-name">Coriander 200gm</p> 
                                    <p style={{fontSize:'13px'}}>Was <span style={{textDecoration:'line-through'}}>&#8377;28.8</span></p>
                                    <p>Now <b style={{color:'696969',fontSize:'20px'}}>&#8377;18.5</b></p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                            <p>Qty</p> 
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                            <div class="input-group home_search_bar_div" style={{float:'right',width:'100%'}}>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-minus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" aria-label="search" autocomplete="off" class="form-control home_search_bar_input"  name="search"/>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <btn className="btn-add" >Add to cart  </btn>
                                </div>
                            </div>
                            <div class="col-xs-2 col-half-offset" id="p3">
                            <div class="product-card text-left">
                                    <img src="/images/test_image1.png" alt="Avatar" style={{width:'100%'}}/>
                                    <p className="product-name">Coriander 200gm</p> 
                                    <p style={{fontSize:'13px'}}>Was <span style={{textDecoration:'line-through'}}>&#8377;28.8</span></p>
                                    <p>Now <b style={{color:'696969',fontSize:'20px'}}>&#8377;18.5</b></p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                            <p>Qty</p> 
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                            <div class="input-group home_search_bar_div" style={{float:'right',width:'100%'}}>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-minus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" aria-label="search" autocomplete="off" class="form-control home_search_bar_input"  name="search"/>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <btn className="btn-add" >Add to cart  </btn>
                                </div>
                            </div>
                            <div class="col-xs-2 col-half-offset" id="p4">
                            <div class="product-card text-left">
                                    <img src="/images/test_image1.png" alt="Avatar" style={{width:'100%'}}/>
                                    <p className="product-name">Coriander 200gm</p> 
                                    <p style={{fontSize:'13px'}}>Was <span style={{textDecoration:'line-through'}}>&#8377;28.8</span></p>
                                    <p>Now <b style={{color:'696969',fontSize:'20px'}}>&#8377;18.5</b></p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                            <p>Qty</p> 
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                            <div class="input-group home_search_bar_div" style={{float:'right',width:'100%'}}>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-minus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" aria-label="search" autocomplete="off" class="form-control home_search_bar_input"  name="search"/>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <btn className="btn-add" >Add to cart  </btn>
                                </div>
                            </div>
                            <div class="col-xs-2 col-half-offset" id="p5">
                            <div class="product-card text-left">
                                    <img src="/images/test_image1.png" alt="Avatar" style={{width:'100%'}}/>
                                    <p className="product-name">Coriander 200gm</p> 
                                    <p style={{fontSize:'13px'}}>Was <span style={{textDecoration:'line-through'}}>&#8377;28.8</span></p>
                                    <p>Now <b style={{color:'696969',fontSize:'20px'}}>&#8377;18.5</b></p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                            <p>Qty</p> 
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                            <div class="input-group home_search_bar_div" style={{float:'right',width:'100%'}}>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-minus"></i>
                                                    </button>
                                                </div>
                                                <input type="text" aria-label="search" autocomplete="off" class="form-control home_search_bar_input"  name="search"/>
                                                <div class="input-group-btn home_search_icon">
                                                    <button class="btn btn-default home_search_icon_btn" type="submit">
                                                        <i class="glyphicon glyphicon-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <btn className="btn-add" >Add to cart  </btn>
                                </div>
                            </div> */}


                        </div>
                        <ul class="page-numbers pagination">
                            {renderPageNumbers}
                        </ul>
                    </div>
            </React.Fragment>

        )
    }
}
const ProductCard = (props) =>{
    return(
        <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6">
            <div class="product-card text-left">
                <div className="text-center prod_image">
                    <img src={"http://18.222.209.138:3000"+props.data.img_url} alt="Avatar" className="img-responsive"/>
                </div>
                <p className="product-name">{props.data.name} {props.data.quantity}</p> 
                <p style={{fontSize:'13px'}}>Was <span style={{textDecoration:'line-through'}}>&#8377;{props.data.price}</span></p>
                <p>Now <b style={{color:'696969',fontSize:'20px'}}>&#8377;{props.data.cost_price}</b></p>
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                        <p>Qty</p> 
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <div class="input-group home_search_bar_div" style={{float:'right',width:'100%'}}>
                            <div class="input-group-btn home_search_icon">
                                <button class="btn btn-default home_search_icon_btn" type="submit">
                                    <i class="glyphicon glyphicon-minus"></i>
                                </button>
                            </div>
                            <input type="text" aria-label="search" autocomplete="off" class="form-control home_search_bar_input"  name="search"/>
                            <div class="input-group-btn home_search_icon">
                                <button class="btn btn-default home_search_icon_btn" type="submit">
                                    <i class="glyphicon glyphicon-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <btn className="btn-add" >Add to cart  </btn>
            </div>
        </div>

    );
}

export default Product_Home;