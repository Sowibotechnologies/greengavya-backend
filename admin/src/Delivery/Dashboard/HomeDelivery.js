import React from 'react';
import './Home.css';
import {Link} from 'react-router-dom';

class HomeDelivery extends React.Component{
    state={
        o_count: 0,
        f_count: 0,
        p_count: 0,
        pending_count:0,
        browser_data : "",
        path_data : "",
        source_data : "",
        city_data : "",
        startDate: "",
        endDate: ""
    }
    componentDidMount(){
        window.scrollTo(0,0);
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        var end = new Date();
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        this.setState({
            startDate: date.getTime(),
            endDate: end.getTime()
        })
        setTimeout(()=>{this.fetchCount(date.getTime(),end.getTime())},1000);
    }
    prevSaturday(curr_date){
        var d = new Date();
        d.setTime(curr_date);
        if(d.getDay === 6){
        }
        else{
            d.setDate(d.getDate()-(d.getDay()+1));
        }
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
    }
    fetchCount(start,end){
        fetch("/api/delivery/getopenordercount", {
            method: 'POST',
            body:JSON.stringify({courierid: this.props.courier, start: start, end: end}),
            headers: {
                'Content-Type': 'application/json',
            }
          })
        .then(res => res.json())
        .then(result => {
            setInterval(()=>{
                this.tick(result[0].order_count,result[0].fulfilled_count,result[0].picked_count,result[0].pending_count);
             },20);
        }).catch((err) => console.log(err));

    }
 
    tick(o_end,f_end,p_end,pending_end){
        var {o_count,f_count,p_count,pending_count} = this.state; 
        if(o_count !== o_end){
            this.setState({
                o_count: o_count+1
            });
        } 
        if(f_count !== f_end){
            this.setState({
                f_count: f_count+1
            });
        } 
        if(p_count !== p_end){
            this.setState({
                p_count: p_count+1
            });
        } 
        if(pending_count !== pending_end){
            this.setState({
                pending_count: pending_count+1
            });
        } 
    }
    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        var hDisplay = h > 0 ? h + (h === 1 ? "h " : "h ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? "m " : "m ") : "";
        var sDisplay = s >= 0 ? s + (s === 1 ? "s" : "s") : "";
        return hDisplay + mDisplay + sDisplay; 
    }
    render(){
        return(
            <React.Fragment>
                <div className="row">
                    <div>
                        <h1>Welcome {this.props.userdata}</h1>
                    </div>
                    <Link to="/Delivery/allorders">
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div class="text-center card">
                                    <img alt="Orders icon" className="img-responsive" width="128" style={{margin:'auto',height:'128px'}} src="/images/GG_Basket.png"/>
                                    <h5 class="dash-counter-head">Pending Orders</h5>
                                    <h1 class="dash-counter-num" style={{color:'red'}}>{this.state.pending_count}</h1>
                            </div>
                        </div>
                    </Link>
                    <Link to="/Delivery/orders">
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div class="text-center card">
                                    <img alt="Orders icon" className="img-responsive" style={{margin:'auto'}} src="/images/open_orders.png"/>
                                    <h5 class="dash-counter-head">Confirmed Orders</h5>
                                    <h1 class="dash-counter-num">{this.state.o_count}</h1>
                            </div>
                        </div>
                    </Link>
                    <Link to="/Delivery/pickedorder">
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div class="text-center card">
                                    <img alt="Orders icon" className="img-responsive" style={{margin:'auto'}} src="/images/orders.png"/>
                                    <h5 class="dash-counter-head">Picked Orders</h5>
                                    <h1 class="dash-counter-num">{this.state.p_count}</h1>
                            </div>
                        </div>
                    </Link>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                        <div class="text-center card">
                                <img alt="Fulfilled icon" className="img-responsive" style={{margin:'auto',width:'128px'}} src="/images/success2.png"/>
                                <h5 class="dash-counter-head">Orders fulfilled</h5>
                                <h1 class="dash-counter-num">{this.state.f_count}</h1>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default HomeDelivery;