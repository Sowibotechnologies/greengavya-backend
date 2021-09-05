import React from 'react';
import './Home.css';
import Product_Home from '../Product/Product_Home';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Products from '../Products/Products';

class Home extends React.Component{
    state={

    }
    componentDidMount(){

    }
    render(){
        return(
            <React.Fragment>
                <div className="container-fluid">
                    <Header />
                    <Navigation />
                    {/* <Product_Home/> */}
                    <Products />
                    <Footer />
                </div>
            </React.Fragment>

        )
    }
}

export default Home;