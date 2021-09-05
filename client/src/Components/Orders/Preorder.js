import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { Link,withRouter } from 'react-router-dom';

const REJECTED = "Rejected";
const PENDING = "Pending";
const CONFIRMED = "Confirmed";
const PICKDUP = "Picked up";
const DELIVERED = "Delivered";
const CANCELLED = "Cancelled";

class Preorder extends React.Component{

    state = {
        orderdata:[],
        loading:true,

        showTrack:false,
        TrackorderId:'',
        TrackScheduleDate:'',
        TrackOrderStatus:''
    }
    componentDidMount(){
        
        setTimeout(() => {
            // this.setState({
            //     orderdata:this.props.data
            // })
            this.setState({
                loading:false
            })
        }, 400);
    }
    componentWillReceiveProps(){
        
        setTimeout(() => {
            this.setState({
                orderdata:this.props.data,
                loading:false
            })
        }, 100);
    }
    CancelOrder(order_id){
        var c = window.confirm("Are you sure?");
        if(c){
            if(order_id !== ""){
                var token = Cookies.get("_token");
                var session = Cookies.get("sessionID");
                
                fetch("/api/order/cancelorder",{
                    method:"POST",
                    body:JSON.stringify({orderid:order_id}),
                    headers:{
                        "Content-Type": "application/json",
                        "token":token,
                        "sessionid":session
                    }
                })
                .then(res => res.json())
                .then(result => {
                    //this.ShowOrderDetails();
                    alert(result.message);
                    if(this.state.orderdata != ""){
                        var orderdata = [...this.state.orderdata];
                        var index = orderdata.findIndex(e => e[0].orderid === order_id );
                        
                        if(index != -1){
                            orderdata[index].map(item => {
                                item.status = "Cancelled";
                            })
                            this.setState({
                                orderdata
                            })
                        }
                    }
                })
            }
        }
    }
    nextOrders(pageLoad){
        this.props.showNextOrders(pageLoad);
    }

    BacktoTop(){
        const orderNode = ReactDOM.findDOMNode(this.refs.orderList);
        orderNode.scrollIntoView({behavior:"smooth"})
    }

    reorder(orderId, addressId){
        this.props.reorder(orderId, addressId);
    }
    
    Faq(){
        this.props.history.push('/faq')
    }
    Trackorder(orderid,scheduledDate,status){
        this.setState({
            showTrack:true,
            TrackorderId:orderid,
            TrackScheduleDate:scheduledDate,
            TrackOrderStatus:status
        })
    }
    closebtn(){
        this.setState({
            showTrack:false,
            TrackorderId:'',
            TrackScheduleDate:'',
            TrackOrderStatus:''
        })
    }
    render(){
        
        const { orderdata,loading,showTrack,TrackorderId,TrackScheduleDate,TrackOrderStatus } = this.state;
        return(
            <React.Fragment>
                {
                    showTrack ? <Showmodal closebtn={this.closebtn.bind(this)} TrackorderId={TrackorderId} TrackScheduleDate={TrackScheduleDate} TrackOrderStatus={TrackOrderStatus}/> : null
                }
                {
                    loading ?
                        <p>Please wait</p>
                    :
                        orderdata.length > 0 ?
                        <div ref="orderList">
                            {
                                Object.keys(orderdata).map((item, i) => {
                                    return <OrderItem Faq={this.Faq.bind(this)} Trackorder={this.Trackorder.bind(this)} key={i} data={orderdata[item]} cancelOrder={this.CancelOrder.bind(this)} reorder={this.reorder.bind(this)}/>
                                })
                            }
                            {
                                this.props.LoadedOrders === this.props.TotalOrders ? 
                                <div className="order-backtotop" onClick={this.BacktoTop.bind(this)}>
                                    <p><img src="./icons/ic_uparrow.png"/></p>
                                    <p>Back to top</p>
                                </div>
                                :
                                <p className="order-viewmore-btn" onClick={this.nextOrders.bind(this,this.props.orderLoad)}>VIEW MORE ORDERS</p>
                            }
                            
                        </div>
                        
                        :
                        <div style={{paddingBottom:'100px'}}>
                            <p>You don't have any orders yet.</p>
                        </div>
                    
                }
            </React.Fragment>
        )
    }
}


const OrderItem = (data) => {
    var item = data.data;
    var d = new Date();
    var scheduledDate = new Date();
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    d.setTime(item[0].date);
    scheduledDate.setTime(item[0].scheduled_date);
    var month = months[d.getMonth()];
    var sMonth = months[scheduledDate.getMonth()];
    var sDay = days[scheduledDate.getDay()];
    var scheduledDateString = sDay +", "+scheduledDate.getDate() +" " +sMonth+ " " +scheduledDate.getFullYear();
    var orderedDate = d.getDate() +" "+ month +" "+d.getFullYear();
    var totalPrice=0;
    item.map(i => {
        totalPrice = (parseFloat(totalPrice) + (parseFloat(i.price) * (i.order_quantity))).toFixed(2);
    })
    return(
        <div className="preorder-table-div">
            <p style={{textAlign:'right',color:'#0066c0',cursor:'pointer',fontSize: '14px',fontWeight: 400}} onClick={() => {}}><Link style={{textDecoration:'none'}} to={{ pathname : '/invoice/' + item[0].orderid, data : {products:item, scheduledDate :scheduledDateString, orderedDate:orderedDate}}} title="Print Invoice">Invoice</Link></p>
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12">
                    <h4>Order no : {item[0].orderid}</h4>
                    <p>Purchased on: <b style={{fontWeight:'500'}}>{d.getDate()+" "+month+" "+d.getFullYear()}</b></p>
                    <p>Order status : 
                        {
                            item[0].status === CANCELLED || item[0].status === REJECTED ?
                            <span style={{fontWeight:500,color:'#d41b1b'}}>{item[0].status}</span>
                            :
                            <span style={{fontWeight:500,color:'green'}}>{item[0].status}</span>
                        }
                    </p>
                    <p>Delivery speed: <span style={{textTransform:'capitalize',fontWeight:400}}>{item[0].delivery_speed} Delivery</span></p>
                    <p>Payment method: {item[0].payment}</p>
                    
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <h4 className="preorder-purchasedate">Scheduled date: {scheduledDate.getDate()+" "+sMonth+" "+scheduledDate.getFullYear()}</h4>
                    <div className="preorder-address-div">
                        <p style={{fontWeight:'600'}}>Shipping Address </p>
                        <p>{item[0].addressname}</p>
                        <p>{item[0].addresshouse}</p>
                        <p>{item[0].addressstreet}</p>
                        <p>{item[0].addresscity}</p>
                        <p>{item[0].addressdistrict}, {item[0].addresspin}</p>
                        <p>Ph: {item[0].addressphone}</p>
                    </div>
                </div>
            </div>
            <table className="table table-responsive table-bordered order-items-table" id="order-items-table">
                <thead>
                <tr className="preorder-table-row">
                    <th style={{paddingLeft: '8px',width:'20%'}}>Name</th>
                    <th style={{textAlign:'center',width:'14%'}}>Price</th>
                    <th style={{textAlign:'center',width:'5%'}}>Quantity</th>
                    <th style={{textAlign:'right',paddingRight: '8px',width:'8%'}}>Total</th>
                </tr>
                </thead>
                <tbody>
                {
                    item.map((products,i) => {
                        return <Orderrow key={i} itemrow={products}/>
                    })
                }
                </tbody>
            </table>
            <h3 style={{textAlign:'right'}}>Total : &#8377;{totalPrice}</h3>
                <p>
                    {
                        item[0].status !== CANCELLED ? <button className="order-help-btn" onClick={data.Trackorder.bind(this,item[0].orderid,scheduledDateString,item[0].status)}><img src="./icons/ic_help_round.png" />&nbsp;Track order</button> : <span>&nbsp;</span>
                    }
                    <span style={{float:'right'}}>
                    {
                        item[0].status === PENDING ? <button className="preorder-btn" onClick={data.cancelOrder.bind(this, item[0].orderid)}>Cancel</button> : null
                    }
                    {
                        item[0].status === DELIVERED || item[0].status === CANCELLED || item[0].status == REJECTED ? <button className="preorder-btn" onClick={data.reorder.bind(this,item[0].orderid, item[0].addressid)}>Reorder</button> : null
                    }
                    </span>
                </p>
                <div>
                    <p style={{color:'#07C',cursor:'pointer'}} onClick={data.Faq.bind(this)}>Need help?</p>
                </div>
            <p style={{textAlign:'right'}}>
            
            </p>
        </div>
    )
}
const Orderrow = (Item) => {
    var itemrow = Item.itemrow;
    var itemTotal = (itemrow.order_quantity * itemrow.price).toFixed(2);
    return(
        <tr>
            <td style={{padding: '8px 2px',letterSpacing:'0.5px'}}><img src={itemrow.img_url} height="35" width="35"/>{itemrow.name}, <span style={{fontSize:'12px'}}>{itemrow.quantity}</span></td>
            <td style={{textAlign:'center'}}>&#8377; {itemrow.price}</td>
            <td style={{textAlign:'center'}}>{itemrow.order_quantity}</td>
            <td style={{textAlign:'right',paddingRight: '8px'}}>&#8377; {itemTotal}</td>
        </tr>
    )
}
const Showmodal = (modal) => {
    var data = modal.data;
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'80%',backgroundColor:'#fff',textAlign:'center',borderRadius:'4px',top:'40%',height:'auto'}}>
                <div className="progressbar-header">
                    <span className="progressbar-close" onClick={modal.closebtn.bind(this)}>&times;</span>
                    <h3>Delivery tracking</h3>
                </div>
                <div style={{textAlign:'initial',padding:'15px 30px 15px'}}>
                    {
                        modal.TrackOrderStatus === REJECTED ?
                        <div className="progressbar-reject-div">
                            <div>
                                <img src={window.location.origin + "/icons/ic_danger.png"} style={{marginTop:'14px'}}/>
                            </div>
                            <div style={{marginLeft:'10px'}}>
                                <h4>Order rejected</h4>
                                <h5 style={{fontWeight:200,fontSize:'16px'}}>We're sorry for the inconvenience.</h5>
                                <p style={{margin:'0px'}}>If you pay using a card or netbanking, your bank may take 6-8 businness days to credit the refund amount to your account.</p>
                            </div>
                        </div>
                        :
                        <React.Fragment>
                            <h4>{modal.TrackOrderStatus}</h4>
                            {
                                modal.TrackOrderStatus === DELIVERED ?
                                <p  style={{color:'green',fontWeight:500}}>Your order is successfully delivered.</p>
                                :
                                <p>Expected delivery: <span style={{color:'green',fontWeight:500}}>{modal.TrackScheduleDate}</span></p>
                            }
                        </React.Fragment>
                    }
                </div>
                <div className="progressbar-container">
                    {
                        modal.TrackOrderStatus === REJECTED ?
                        null
                        :
                        <ul className="progressbar">
                            <li className="active">Pending</li>
                            <li className={modal.TrackOrderStatus === "Confirmed"||modal.TrackOrderStatus === "Picked up"||modal.TrackOrderStatus === "Delivered" ? 'active' : null}>Confirmed</li>
                            <li className={modal.TrackOrderStatus === "Picked up"||modal.TrackOrderStatus === "Delivered" ? 'active' : null}>Picked up</li>
                            <li className={modal.TrackOrderStatus === "Delivered" ? 'active' : null}>Delivered</li>
                        </ul>
                    }
                    
                    <div className={modal.TrackOrderStatus === REJECTED ? 'progressbar-contact-div-rejected' : 'progressbar-contact-div'}>
                        <p><span style={{fontWeight:400}}>Need Help?</span></p>
                        <p>Talk to our customer support on <span style={{fontWeight:400}}>+91 8870 345 698</span></p>
                        <p>or</p>
                        <p>Mail to <span style={{fontWeight:400}}>help@greengavya.com</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Preorder);