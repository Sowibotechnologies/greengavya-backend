import React from 'react';
import './slider.css';

class Imageslider extends React.Component{
    render(){
        return(
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                <li data-target="#myCarousel" data-slide-to="1"></li>
				<li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="item active">
                        <img src="/images/banner1.jpg" alt="Banner" style={{width:'100%'}}/>
                    </div>
					<div className="item">
                        <img src="/images/banner3_2.jpg" alt="Banner" style={{width:'100%'}}/>
                    </div>
                    <div className="item">
                        <img src="/images/banner2.jpg" alt="Banner" style={{width:'100%'}}/>
                    </div>
					
                </div>
            </div>
        )
        
    }
}

export default Imageslider;