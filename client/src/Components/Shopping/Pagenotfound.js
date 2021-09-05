import React from 'react';
import './Pagenotfound.css';
import { Link } from 'react-router-dom';

class Filenotfound extends React.Component{
    render(){
        return(
            <div class="container" style={{paddingTop: '100px',textAlign:'center'}}>
                <p class="notfound">404</p>
                <p class="oops_page">Oops! page not found</p>
                <p class="text">Sorry, but the page you are looking for is not found please make sure you have typed the current URL</p>
                <Link to={'/'}>Back</Link>
            </div>
        )
    }
}

export default Filenotfound;