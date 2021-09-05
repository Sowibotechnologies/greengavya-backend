import React from 'react';
import './products.css';
import { Link } from 'react-router-dom';
import Productcard from './Productcard';
import Imageslider from '../Imageslider/Imageslider';

class Products extends React.Component{
    state = {
        isFetched : false,
        products:[],
        currentPage: 1,
        itemsPerPage: 15
    }
    componentDidMount(){
        this.fetchProducts();
    }
    fetchProducts(){
        fetch("http://18.222.209.138:4000/api/product/getall")
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetched:true,
                products: result
            });
            console.log(result);
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
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Object.entries(products).slice(firstIndex,lastIndex);
        for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
            pageNumbers.push(i);
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
                <Imageslider />
                <div className="container product-container">
                    <h3 className="product-head">Monthly Specials <Link to={'shopping'} className="product-viewmore-btn"><img src='./icons/ic_plus.png' style={{marginTop:"-4px"}}/>View more</Link></h3>
                    <div className="row">
                        {
                            Object.keys(currentItemList).map((item,id) => {
                                return(
                                    <Productcard item={currentItemList[item][1]} keys={id}/>
                                )
                            })
                        }
                    </div>
                    <ul class="page-numbers pagination">
                        {renderPageNumbers}
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}

export default Products;