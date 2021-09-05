import React from 'react';
import Cookies from 'js-cookie';

class Logout extends React.Component{
    componentDidMount(){
        Cookies.remove('_token', { path: '' });
        Cookies.remove('sessionID', { path: '' });
        window.location="/";
    }
    render(){
        return(
            <React.Fragment>
                <div style={{marginTop:'150px',textAlign:'center'}}>
                    <img src={ window.location.origin +"/images/loggingout.png"} alt="logout image"/>
                </div>
                <h3 style={{textAlign:'center'}}>Logging out</h3>
                <h5 style={{textAlign:'center'}}>Please Wait...</h5> 
            </React.Fragment>
        )
    }
}

export default Logout;