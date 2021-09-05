import React from 'react';
import { Link } from 'react-router-dom';

class Locked extends React.Component{
    render(){
        return(
            <div className="container" style={{textAlign:'center',fontWeight:'200',marginTop:'100px'}}>
                <h2 style={{fontWeight:'200'}}>Your account has been temporarily blocked</h2>
                <img src="./images/locked.png"/>
                <h3 style={{fontWeight:'200'}}>Please contact <a href="mailto:someone@example.com" target="_top">support</a> for further queries.</h3>
                <h3 style={{fontWeight:'200'}}><Link to={'/'} >Back to shopping</Link></h3>
            </div>
        )
    }
}

export default Locked;