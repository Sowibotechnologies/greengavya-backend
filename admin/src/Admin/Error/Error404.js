import React from 'react';
import './Error404.css';
class Error404 extends React.Component{
    render(){
        return(
            <div className="Error404-main">
                <img className="img-responsive" style={{margin:'auto',height:'100vh'}} src="images/404.jpg" alt="404 Not Found" />
            </div>
        );
    }
}
export default Error404;
