import React from 'react';
import './PurchaseDetails.css';
import Cookies from 'js-cookie';
import Snackbar from '../../Delivery/Common/Snackbar';
import PrintRow from './PrintRow';
import Loader from '../Loader/Loader';
import Empty from '../Common/Empty';

class ProductsByOrder extends React.Component{
    state={
        isFetching: true,
        orders : [],
        printData:"",
        orderList : new Set(),
        currentPage: 1,
        itemsPerPage: 3,
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
    updateOrderList(){
        Object.keys(this.state.orders).map((item) => {
            this.setState(({ orderList }) => ({
                orderList: new Set(orderList.add(this.state.orders[item].orderid))
            }));
        })
        this.setState({isFetching:false});
    }
    fetchOrders(){
        this.setState({
            isFetching: true,
            orders: [],
            orderList: new Set()
        });
        fetch("/api/order/getallbyorder", {
            method: 'POST',
            body:JSON.stringify({start: this.state.startDate, end: this.state.endDate}),
            headers: {
                'Content-Type': 'application/json',
            }
          })
        .then(res => res.json())
        .then(result => {
            this.setState({
                orders: result
            });
            setTimeout(()=>{this.updateOrderList();},200);
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
    handleStatusChange(e,id,email,name,o_date,s_date,total){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        var status = e.target.value;
        fetch("/api/order/status/"+id,{
            method:'PUT',
            body:JSON.stringify({
                status:status,
                email: email,
                name: name,
                o_date: o_date,
                s_date: s_date,
                total: total
            }),
            headers:{
              "Content-Type": "application/json",
              token: token,
              sessionid: session
            }
        })
        .then(res =>{
            if(res.status == 200){
                return res.json()
            }
            if(res.status == 404){
                alert("Unauthorized user: Token Invalid");
                this.Logout();
                this.props.history.push('/');
            }
        })
        .then(result => {
            this.onResultChange(result);
            setTimeout(()=>{this.fetchOrders()},2000);
            setTimeout(()=>{this.updateOrderList()},3000);
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
            if(res.status == 200){
                return res.json()
            }
            if(res.status == 404){
                alert("Unauthorized user: Token Invalid");
                this.Logout();
                this.props.history.push('/login');
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
            this.render();
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
    formatDateReadeable(date){
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
    }
    exportCSVforDownload() {
        var filename = this.formatDateReadeable(this.state.startDate) +" to "+ this.formatDateReadeable(this.state.endDate)+".csv"
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(","));        
        }
    
        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    }
    downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob([csv], {type: "text/csv"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
    exportTableToCSV(e) {
        e.preventDefault();
        var emails =  this.refs.email.value;
        var filename = this.formatDateReadeable(this.state.startDate) +" to "+ this.formatDateReadeable(this.state.endDate)+".csv"
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(","));        
        }
        // Email CSV file
        this.emailCSV(csv.join("\n"), filename,emails);
    }
    emailCSV(csv, filename,emails) {
        console.log(emails);
        var csvFile;
        csvFile = new Blob([csv], {type: "text/csv"});
        let form = new FormData();
        form.append('csv', csvFile);
        fetch("/api/order/mailbyorder",{
        method:'POST',
        headers:{
            name: filename,
            email: emails
        },
        body:form
            })
        .then(res => res.json())
        .then(result => {
            this.onResultChange(result);
        }).catch((err) => console.log(err));
    }
    render(){
        return(  
        <React.Fragment>
            <div class="container card text-left" style={{marginTop:'20px',minHeight:'750px'}}>
                <div className="text-center">
                    <img alt="Orders icon" className="card-head-img" src="/images/orders.png"/>
                    <span className="card-head-title">Order list by Order</span>
                </div>
                <span className="text-center" style={{float:'right'}}>
                    <img alt="CSV icon" src="/images/csv.png" className="purchaseByProduct-Btn" onClick={this.exportCSVforDownload.bind(this)}/>
                    <p>Download</p>
                </span>
                <span className="text-center" style={{float:'right'}}>
                    <img alt="Email icon" src="/images/email.png" className="purchaseByProduct-Btn" data-toggle="modal" data-target="#orderListModalEmail"/>
                    <p>Email</p>
                </span>
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
                <div class="panel-group" id="accordion">
                    {this.state.isFetching ? <Loader/>: this.renderHome() }
                    {!this.state.isFetching && this.state.orders.length == 0 ? <Empty/>: ""}
                </div> 
                <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
            </div>

                    <div class="delete-modal modal fade" id="orderListModalEmail" role="dialog"  data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                    <div className="text-left">
                        <div class="text-center modal-body">
                            <img alt="Email icon" src="/images/email.png" width='75'></img>
                            <h2 style={{color:'#a9a2a2',fontWeight:'100'}}>Email</h2>
                            <h5 style={{marginTop:'50px',color:'#a9a2a2',textAlign:'left',fontWeight:'100'}}>Email reciepents:</h5>
                            <form id="deletecategory" style={{marginTop:'20px'}} onSubmit={(e)=>{this.exportTableToCSV(e)}}>
                                <input type="email" required className="form-control" ref="email" placeholder="Email reciepients"></input>
                                <div class="row text-center" style={{marginTop:'20px'}}>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <button type="submit" className="modal-btn success">Email</button>
                                    </div>
                                </div>
                            </form>  
                        </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    }
            <div class="delete-modal modal fade" id="UserModalBlock" role="dialog">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                    <div className="text-left">
                        <div class="text-center modal-body">
                            <img src="/images/block.png" width='75'></img>
                            <h1 style={{color:'#a9a2a2',fontWeight:'100'}}>Are you sure?</h1>
                            <form id="deletecategory" style={{marginTop:'20px'}}>
                                <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>This user account will be blocked.<br></br>You cannot revert this process !</i>
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
            {this.state.printData !== "" && <PrintRow data={this.state.printData} order_data={this.state.orders} reset={this.resetPrintData.bind(this)} ></PrintRow>}
            {/* <iframe id="ifmcontentstoprint" style={{height:'0px',width:'0px',position: 'absolute'}}></iframe> */}
        </React.Fragment>
    );
    }
    renderHome(){
        var content = [];
        const {orderList,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;

        ([...orderList]).map((item,index) => {
            var child = [];
            var total = 0;
            var order = this.state.orders.filter(function(i) { return i.orderid === item; });
            var date = new Date();
            var scheduled_date = new Date();
            scheduled_date.setTime(order[0].scheduled_date)
            date.setTime(order[0].date);
            // var formattedDate = date.toJSON().slice(0,10).split('-').reverse().join('/');
            var formattedDate = date.toDateString();
            var formattedScheduleDate = scheduled_date.toDateString();
            order.forEach(function(i){
                total += i.quantity.split(' ')[0]*i.price;
                child.push(
                    <OrderRow data={i} context={this}/>
                );
            })
            content.push(
                <React.Fragment>
                            <div class="panel print panel-default card">
                                <div class="panel-heading purchaseDetails-panelHead">
                                    <h4>OrderNo: #{item}</h4>
                                </div>
                                <div id={order[0].id}>
                                <div className="container-fluid table-responsive">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th colSpan="2" style={{display:'none'}}>OrderNo: #{item}</th>
                                            </tr>
                                            <tr className="active" style={{color:'#000'}}>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                            {child}
                                            <tr></tr>
                                            <tr></tr>
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                                <div>
                                </div>
                        </div>
                    
                </React.Fragment>
            );
        })
        return content;
    }
}

const OrderRow = (props) =>{
    var quantity = props.data.quan.split(" ")[0];
    var unit = props.data.quan.split(" ")[1];
    if(quantity >= 1000){
        if(unit === 'gm'){
            quantity = quantity/1000;
            unit = 'kg';
        }
        if(unit === 'ml'){
            quantity = quantity/1000;
            unit = 'L';
        }
    }
    return(
          <tr>
                <td>{props.data.name}</td>
                <td>{quantity+ " " + unit}</td>
            </tr>
    );
}

export default ProductsByOrder;