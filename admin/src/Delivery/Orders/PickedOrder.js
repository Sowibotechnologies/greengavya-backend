import React from 'react';
import './Orders.css';
import Cookies from 'js-cookie';
import Loader from '../Loader/Loader';
import Empty from '../Common/Empty';
import Snackbar from '../Common/Snackbar';
import DetailsByOrder from './DetailsByOrder';

class PickedOrder extends React.Component{
    state={
        isFetching: true,
        orders : [],
        orderList : new Set(),
        currentPage: 1,
        itemsPerPage: 25,
        orderId:'',
        orderTotal:'',
        courierid: this.props.courier,
        endDate: new Date().getTime()
    }
    componentDidMount(){
        window.scrollTo(0,0);
        this.fetchOrdersByCourierId(this.state.courierid);
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
    updateOrderList(){
        Object.keys(this.state.orders).map((item) => {
            this.setState(({ orderList }) => ({
                orderList: new Set(orderList.add(this.state.orders[item].orderid))
            }));
        })
        this.setState({isFetching:false});
        setTimeout(()=>{this.render();},1000);
    }
    fetchOrdersByCourierId(courierid){
        this.setState({
            isFetching: true,
            orders: []
        });
        fetch("/api/delivery/fetchordersbycourierid", {
            method: 'POST',
            body:JSON.stringify({courierid: courierid}),
            headers: {
                'Content-Type': 'application/json',
            }
          })
        .then(res => res.json())
        .then(result => {
            this.setState({
                orderList : new Set(),
                orders: result
            });
            if(result.length === 0){
                this.setState({
                    isFetching: false
                });
            }
            else{
                setTimeout(()=>{this.updateOrderList();},200);
            }
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
    deliveredOrder(){
        var token = Cookies.get("_token_admin_delivery");
        var session = Cookies.get("sessionID_admin_delivery");
        fetch("/api/delivery/delivered",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify(
                {
                    status:"Delivered",
                    date: new Date().getTime(),
                    orderid: this.state.orderId,
                    courierid: this.state.courierid,
                    total: this.state.orderTotal
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
            setTimeout(()=>{this.fetchOrdersByCourierId(this.state.courierid)},2000);
            
        })
        .catch(e => console.log(e))
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
        setTimeout(()=>{
            this.render();
        },300);
    }
    render(){
        return(  
        <React.Fragment>
            <h2 className="orders-heading">Picked Orders</h2>
            <div class="container text-left" style={{marginTop:'20px',minHeight:'300px',position:'relative',paddingBottom:'40px'}}>
                <div class="card panel-group" id="accordion"  style={{padding:'0px'}}>
                    {this.state.isFetching ? 
                    <Loader/>
                    :  
                    (this.state.orders.length === 0 ? <Empty/>: this.renderHome())}
                </div> 
            </div>
            <div class="delete-modal modal fade" id="OrderDetailModalBlock" role="dialog">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <DetailsByOrder orderId={this.state.orderId} context={this}/>
                    </div>
                </div>
            </div>
            <div class="delete-modal modal fade" id="DeliveryConfirmationModal" role="dialog">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                        <div className="text-left">
                            <div class="text-center modal-body">
                                <img alt="Block icon" src="/images/delivery.png" width='75'></img>
                                <h1 style={{color:'#fa503c',fontWeight:'100'}}>Are you sure?</h1>
                                <form id="deletecategory" style={{marginTop:'20px'}}>
                                    <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>This order will be marked as delivered !</i>
                                    <div class="row text-center" style={{marginTop:'20px'}}>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="button" className="modal-btn success" data-dismiss="modal" onClick={this.deliveredOrder.bind(this)}>Delivered</button>
                                        </div>
                                    </div>
                                </form>  
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
        </React.Fragment>
    );
    }
    renderHome(){
        var content = [], child = [];
        const {orderList,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Array.from(orderList).slice(firstIndex,lastIndex);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(orderList.size / itemsPerPage); i++) {
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

        ([...currentItemList]).map((item,index) => {

            child = [];
            var total = 0;
            var order = this.state.orders.filter(function(i) { return i.orderid === item; });
            var date = new Date();
            var scheduled_date = new Date();
            scheduled_date.setTime(order[0].scheduled_date)
            date.setTime(order[0].date);
            // var formattedDate = date.toJSON().slice(0,10).split('-').reverse().join('/');
            var formattedDate = date.toDateString();
            var formattedScheduleDate = scheduled_date.toDateString();
            child.push(
                <OrdersRow data={order[0]} id ={item} context={this} key ={item}/>
            );

        })
        content.push(
            <React.Fragment>
                <div className="container-fluid table-responsive">
                    <table className="table table-hover table-bordered table-responsive" style={{marginTop:'30px',marginBottom:'30px'}}>
                        <tbody>
                            <tr className="active" style={{color:'#000'}}>
                                <th>Order</th>
                                {/* <th>Deliver to</th>
                                <th>Deliver by</th>
                                <th>Total</th> */}
                                <th style={{textAlign:'center'}}>Actions</th>
                            </tr>
                            {
                                Object.keys(currentItemList).map((item) => {
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
            <ul class="fixed-pagination page-numbers pagination" style={{left:'45%'}}>
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
          <tr onClick={()=>{
            props.context.setState((state, propss) => ({
                orderId: props.data.orderid,
                orderTotal: props.data.total.toFixed(2)
            }), ()=>{
            });
        }}>
                <td style={{cursor:'pointer'}} data-toggle="modal" data-target="#OrderDetailModalBlock">
                    <span className="order-id-xs">#{props.data.orderid}</span> <br></br><span style={{fontWeight:'bold',textTransform:'capitalize',fontSize:'15px'}}>{props.data.addressname}</span><br></br>
                    {props.data.house},<br></br> {props.data.street},<br></br> {props.data.district},<br></br> {props.data.pin}
                </td>
                {/* <td style={{cursor:'pointer'}} className="orders-td" data-toggle="modal" data-target="#OrderDetailModalBlock"  onClick={()=>{
                    props.context.setState((state, propss) => ({
                        orderId: props.data.orderid
                    }), ()=>{
                    });
                }}>{props.data.house}, {props.data.street}, {props.data.district}, {props.data.pin}</td>
                <td style={{cursor:'pointer'}} className="orders-td" data-toggle="modal" data-target="#OrderDetailModalBlock" onClick={()=>{
                    props.context.setState((state, propss) => ({
                        orderId: props.data.orderid
                    }), ()=>{
                    });
                }}>{formattedScheduleDate}</td>
                <td style={{cursor:'pointer'}} className="orders-td text-left" data-toggle="modal" data-target="#OrderDetailModalBlock" onClick={()=>{
                    props.context.setState((state, propss) => ({
                        orderId: props.data.orderid
                    }), ()=>{
                    });
                    }}>&#8377; {props.data.total.toFixed(2)}<p style={{fontSize:'11px'}}>Via {props.data.payment_method}</p>
                </td> */}
                <td className="orders-td" style={{textAlign:'center'}}>
                    <img alt="Accept icon" src="/images/success.png" style={{marginLeft:'20px'}}  data-toggle="modal" className="showProduct-imgBtn" data-target="#DeliveryConfirmationModal" ></img>
                </td>
            </tr>
    );
}

export default PickedOrder;