import React from 'react';
import Cookies from 'js-cookie';
import Loader from '../Loader/Loader';
import Empty from '../Common/Empty';
import Snackbar from '../Common/Snackbar';
import DetailsByOrder from './DetailsByOrder';

class AllOrders extends React.Component{
    state={
        isFetching: true,
        orders : [],
        statusTotal : "",
        orderId:"",
        printData:"",
        currentPage: 1,
        itemsPerPage: 25,
        order_count: 0,
        tempStatus: "",
        statusFilterArray: ["Pending","Confirmed","Cancelled","Rejected","Picked up","Delivered"],
        startDate:this.prevSaturday(new Date().getTime()).getTime(),
        endDate: new Date().getTime()
    }
    componentDidMount(){
        this.fetchOrders();
    }

    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
    }
    onResultChange(e){
        this.setState({
            status: e.status,
            description: e.message,
            msg_state: true
        });
        setTimeout(()=>{    
            this.setState({
               msg_state:false
           });
        }, 3000);
    }

    fetchOrders(){
        var {startDate,endDate,currentPage,itemsPerPage,statusFilterArray} = this.state;
        this.setState({
            isFetching: true,
            orders: []
        });
        var firstItemIndex = (currentPage - 1) * itemsPerPage;
        fetch("/api/order/getall", {
            method: 'POST',
            body:JSON.stringify(
                    {
                        start: startDate,
                        end: endDate,
                        currentPage: currentPage,
                        itemsPerPage: itemsPerPage,
                        firstItemIndex: firstItemIndex,
                        statusFilterArray: statusFilterArray
                    }
                ),
            headers: {
                'Content-Type': 'application/json',
            }
          })
        .then(res => res.json())
        .then(result => {
            this.setState({
                orders: result.orders,
                order_count: result.order_count,
                isFetching: false
            });
            setTimeout(()=>{this.render();},400);
        }).catch((err) => console.log(err));
    }
    onStartDateChange(e){
        var date = new Date(e.target.valueAsDate);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        this.setState({
            currentPage:1,
            isFetching:true,
            startDate:date.getTime()
        });
        setTimeout(()=>{this.fetchOrders()},1000);
    }
    onEndDateChange(e){
        var date = new Date(e.target.valueAsDate);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        this.setState({
            currentPage:1,
            isFetching:true,
            endDate:date.getTime()
        });
        setTimeout(()=>{this.fetchOrders()},1000);
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
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
    handleStatusChange(status){
        var token = Cookies.get("_token_admin_delivery");
        var session = Cookies.get("sessionID_admin_delivery");
        fetch("/api/delivery/status/"+this.state.statusOrder,{
            method:'PUT',
            body:JSON.stringify({
                status:status,
                total: this.state.statusTotal
            }),
            headers:{
              "Content-Type": "application/json",
              token: token,
              sessionid: session
            }
        })
        .then(res =>{
            if(res.status === 200){
                return res.json()
            }
            if(res.status === 404){
                alert("Unauthorized user: Token Invalid");
                this.Logout();
                this.props.history.push('/');
            }
        })
        .then(result => {
            this.onResultChange(result);
            setTimeout(()=>{this.fetchOrders()},2000);
        })
        .catch(e => console.log(e));
    }
    sendEmail(id,status){
        fetch("/api/email/sendStatusEmail/"+id,{
            method:'POST',
            body:JSON.stringify({status:status}),
            headers:{
              "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
        })
        .catch(e => console.log(e));
    }
    blockUser(){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/user/block",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify(
                {
                    user_id: this.state.blockID
                }
            )
        })
        .then(res =>{
            if(res.status === 200){
                return res.json()
            }
            if(res.status === 404){
                alert("Unauthorized user: Token Invalid");
                this.Logout();
                this.props.history.push('/');
            }
        })
        .then(result => {
            this.onResultChange(result);
        })
        .catch(e => console.log(e))
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
        setTimeout(()=>{
            this.fetchOrders();
        },300);
    }
    printOrder(e,printData){
        this.setState({
            printData: printData
        })
    }
    resetPrintData(){
        this.setState({printData:""});
    }
    onStatusFilterChange(e,status){
        const {statusFilterArray} = this.state;
        if(e.target.checked){
            // statusFilterArray.concat(status);
            // var temp = new Set(statusFilterArray);
            // var tempArray = [...temp];
            this.setState({statusFilterArray: statusFilterArray.concat(status)});
        }
        else{
            if(statusFilterArray.length === 1)
                this.onResultChange({status:"Warning",message:"Cannot remove all filters"})
            else
                this.setState({statusFilterArray: statusFilterArray.filter(e => e !== status)});
        }
        setTimeout(()=>{
            this.fetchOrders();
        },500);
    }
    render(){
        return(  
        <React.Fragment>
            <div class="container-fluid text-left" style={{marginTop:'20px',minHeight:'300px',position:'relative',paddingBottom:'40px'}}>
                <h2 className="orders-heading">All Orders</h2>
                <div class="container card text-left" style={{marginTop:'20px',minHeight:'750px',position:'relative'}}>
                <form className="form-inline">
                    <div className="form-group purchaseDetail-formGroup">
                    <div><label>Start Date</label></div> 
                        <input type="date" name="date" onChange={this.onStartDateChange.bind(this)} defaultValue={this.formatDate(this.prevSaturday(this.state.endDate))}></input>
                    </div>
                    
                    <div className="form-group purchaseDetail-formGroup">
                    <div><label>End Date</label></div>
                        <input type="date" name="date" onChange={this.onEndDateChange.bind(this)} defaultValue={this.formatDate(this.state.endDate)}></input>
                    </div>
                </form>
                <div className="container-fluid">
                        <div className="text-left">
                            <button type="button" className="btn btn-default" data-toggle="collapse" data-target="#filter">
                            <span class="glyphicon glyphicon-filter"></span> Filter </button>
                            <div id="filter" className="collapse">
                                <hr></hr>
                                <div className="row">
                                    <CheckboxFilter status="Pending" context={this}/>
                                    <CheckboxFilter status="Confirmed" context={this}/>
                                    <CheckboxFilter status="Cancelled" context={this}/>
                                    <CheckboxFilter status="Rejected" context={this}/>
                                    <CheckboxFilter status="Picked up" context={this}/>
                                    <CheckboxFilter status="Delivered" context={this}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-group row" id="accordion">
                        {this.state.isFetching ? <Loader/>:  (this.state.orders.length === 0 ?  <Empty/>: this.renderHome() ) }
                    </div> 
                    <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
                </div>
            </div>

            <div class="delete-modal modal fade" id="UserModalBlock" role="dialog">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                    <div className="text-left">
                        <div class="text-center modal-body">
                            <img alt="Block icon" src="/images/block.png" width='75'></img>
                            <h1 style={{color:'red',fontWeight:'100'}}>Are you sure?</h1>
                            <form id="deletecategory" style={{marginTop:'20px'}}>
                                <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>This user will be blacklisted !</i>
                                <div class="row text-center" style={{marginTop:'20px'}}>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <button type="button" className="modal-btn danger" data-dismiss="modal" onClick={this.blockUser.bind(this)}>Block</button>
                                    </div>
                                </div>
                            </form>  
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div class="delete-modal modal fade" id="OrderDetailModalBlock" role="dialog">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <DetailsByOrder orderId={this.state.orderId} context={this}/>
                    </div>
                </div>
            </div>
            <div class="delete-modal modal fade" id="OrderStatusModal" role="dialog">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div className="modal-header">
                            <img alt="Order icon" src="/images/orders.png" width='45'></img>
                            <h2>Order Status</h2>
                        </div>
                        <div className="modal-body">
                            {/* {this.state.tempStatus === "Confirmed" || this.state.tempStatus === "Picked up" ? "" : <span onClick={()=>{this.handleStatusChange("Confirmed")}} className={"btn-pill-select confirmed-status"} data-dismiss="modal">Confirm Order</span>} */}
                            {this.state.tempStatus === "Pending"  ? 
                            <React.Fragment>
                             <span onClick={()=>{this.handleStatusChange("Rejected")}} className={"btn-pill-select rejected-status"} data-dismiss="modal">Reject Order</span>
                             <span onClick={()=>{this.handleStatusChange("Confirmed")}} className={"btn-pill-select confirmed-status"} data-dismiss="modal">Confirm Order</span> 
                            </React.Fragment>
                            : ""}
                            {/* {this.state.tempStatus === "Confirmed" ? <span onClick={()=>{this.handleStatusChange("Picked up")}} className={"btn-pill-select pickedup-status"} data-dismiss="modal">Picked up</span> : ""}
                            {this.state.tempStatus === "Picked up" ? <span onClick={()=>{this.handleStatusChange("Delivered")}} className={"btn-pill-select delivered-status"} data-dismiss="modal">Delivered</span> : ""}
                            {this.state.tempStatus === "Picked up"  ? <span onClick={()=>{this.handleStatusChange("Cancelled")}} className={"btn-pill-select cancelled-status"} data-dismiss="modal">Cancelled</span> : ""} */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <iframe id="ifmcontentstoprint" style={{height:'0px',width:'0px',position: 'absolute'}}></iframe> */}
        </React.Fragment>
    );
    }
    renderHome(){
        var content = [], child = [],currentItemList;
        const {currentPage,itemsPerPage,orders,order_count} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        currentItemList = Object.entries(orders).slice(firstIndex,lastIndex);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(order_count / itemsPerPage); i++) {
          pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className={(this.state.currentPage === number ? 'active ' : '') + 'controls'}>
              <button className="pagination-button"
                key={number}
                id={number} onClick={this.onPageChange.bind(this)}>
                {number}
              </button>
              </li>
            );
          });
        content.push(
            <React.Fragment>
                <div className="container-fluid table-responsive">
                    <table className="table table-hover table-bordered table-responsive" style={{marginTop:'30px',marginBottom:'30px'}}>
                        <tbody>
                            <tr className="active" style={{color:'#000'}}>
                                <th>Order</th>
                                <th style={{textAlign:'center'}}>Actions</th>
                            </tr>
                            {
                                Object.keys(this.state.orders).map((item) => {
                                return(
                                    <OrdersRow data={this.state.orders[item]} id ={item} context={this} key ={item}/>
                                )
                                })
                            }
                        </tbody>
                    </table> 
                </div>
            </React.Fragment>
        );
        content.push(
            <ul class="fixed-pagination page-numbers pagination">
              {renderPageNumbers}
            </ul>);
        return content;
        
    }
}

const OrdersRow = (props) =>{
    var scheduled_date = new Date();
    scheduled_date.setTime(props.data.scheduled_date);
    var formattedScheduleDate = scheduled_date.toDateString();
    return(
          <tr>
                <td style={{cursor:'pointer'}} data-toggle="modal" data-target="#OrderDetailModalBlock" onClick={()=>{
                        props.context.setState((state, propss) => ({
                            orderId: props.data.orderid
                        }), ()=>{
                        });
                    }}>
                    <span className="order-id-xs">#{props.data.orderid}</span>
                    <br></br>
                    
                        {props.data.delivery_speed ==="fast" ? 
                        <span style={{textTransform:'capitalize',color:'#FF9800'}}>
                            <img src="/images/fast.png" alt="ico" width="20"></img>
                            {props.data.delivery_speed} Delivery
                        </span>
                        :
                        <span style={{textTransform:'capitalize',color:'#2196F3'}}>
                            {props.data.delivery_speed} Delivery
                        </span>
                        }

                    <br></br><span style={{fontWeight:'bold',textTransform:'capitalize',fontSize:'15px'}}>{props.data.addressname}</span><br></br>
                    {props.data.house},<br></br> {props.data.street},<br></br> {props.data.district},<br></br> {props.data.pin}
                </td>
                {props.data.status !== "Pending"  ?
                    <td style={{cursor:'not-allowed'}} className="orders-td text-center"><StatusPill status = {props.data.status}/></td>
                :
                    <td style={{cursor:'pointer'}} className="orders-td text-center" data-toggle="modal" data-target="#OrderStatusModal" onClick={()=>{
                            props.context.setState((state, propss) => ({
                                statusOrder: props.data.orderid,
                                statusTotal: props.data.total.toFixed(2),
                                tempStatus: props.data.status
                            }), ()=>{
                            });
                    }}><StatusPill status = {props.data.status}/></td>
                }
            </tr>
    );
}
const CheckboxFilter = (props) =>{
    
    return(
        <React.Fragment>
            <div className="checkbox-container text-center col-lg-2 col-md-2 col-sm-4 col-xs-4">
                <div class="checkbox">
                <label>
                    <input type="checkbox" value="" checked={props.context.state.statusFilterArray.includes(props.status)}  onChange={(e)=>{props.context.onStatusFilterChange(e,props.status)}}/>
                    <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                    {props.status}
                </label>
                </div>
            </div>
        </React.Fragment>
    );
}
const StatusPill = (props) =>{
    var statusClass = "";
    switch (props.status) {
        case "Pending":
            statusClass="pending-status"
            break;
        case "Confirmed":
            statusClass="confirmed-status"
            break;
        case "Cancelled":
            statusClass="cancelled-status"
            break;
        case "Rejected":
            statusClass="rejected-status"
            break;
        case "Delivered":
            statusClass="delivered-status"
            break;
        case "Picked up":
            statusClass="pickedup-status"
            break;
    
        default:
            break;
    }
    return(
        <React.Fragment>
            <span className={"btn-pill "+statusClass}>{props.status}</span>
        </React.Fragment>
    );
}

export default AllOrders;

var statusFilterArray = [];
var fetchQuery = "";
var temp = "";
statusFilterArray.forEach((item,index)=>{
    if(statusFilterArray.length === 1){
        temp = item;
    }
    else{
        temp = item + "AND" + temp;
    }
});
console.log()
{
    fetchQuery = "SELECT orders.orderid,address.name as username,(SELECT SUM((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) *order_details.quantity) FROM order_details WHERE order_details.orderid = orders.orderid) AS total,courier.username as courier_name,delivery_log.courierid,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,orders.payment_method FROM orders INNER JOIN address ON orders.address = address.addressid LEFT JOIN delivery_log ON orders.orderid = delivery_log.orderid LEFT JOIN courier ON delivery_log.courierid = courier.user_id WHERE orders.date BETWEEN ? AND ? ORDER BY IF((orders.status = 'Delivered' || orders.status = 'Cancelled'|| orders.status = 'Picked up') , TRUE,FALSE),CAST(orders.date as SIGNED) DESC LIMIT ?,?";
}