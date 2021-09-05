import React from 'react';
import './offer.css';

class Navbaroffer extends React.Component{
    render(){
        return(
            <div class="content">
                
                <div class="line"><img src={window.location.origin + "/icons/freedelivery.png"} height="50"/></div><p>FREE DELIVERY</p>
            </div>
        )
    }
}

export default Navbaroffer;