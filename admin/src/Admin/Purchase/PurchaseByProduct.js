import React from 'react';
import './PurchaseByProduct.css';
import Loader from '../Loader/Loader';
import Empty from '../Common/Empty';
import PrintByProduct from './PrintByProduct';
import Snackbar from '../Common/Snackbar';

class PurchaseByProduct extends React.Component{
    state={
        isFetching: true,
        printActive:false,
        orders : [],
        startDate:this.prevSaturday(new Date().getTime()).getTime(),
        endDate: new Date().getTime()
    }
    componentDidMount(){
        this.fetchOrders();
        this.render();
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
        this.setState({
            isFetching: true,
            orders: []
        });
        fetch("/api/order/getByProduct", {
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
            this.setState({isFetching:false});
            
        }).catch((err) => console.log(err));
    }
    onStartDateChange(e){
        var date = new Date(e.target.valueAsDate);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        this.setState({
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
        // this.setState({startDate:d.getTime()});
        return d;
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
    formatDateReadeable(date){
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
    }
    exportTableToCSV() {
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
    printOrder(){
        this.setState({printActive:true});
    }
    mailOrder(e){
        e.preventDefault();
        fetch("/api/order/mailByProduct", {
            method: 'POST',
            body:JSON.stringify({start: this.state.startDate, end: this.state.endDate, email: this.refs.email.value}),
            headers: {
                'Content-Type': 'application/json',
            }
          })
        .then(res => res.json())
        .then(result => {
            this.onResultChange(result);
        }).catch((err) => console.log(err));
    }
    resetPrintData(){
        this.setState({printActive:false});
    }
    render(){
        
        return(      
        <div class="container card text-left" style={{marginTop:'20px',minHeight:'750px'}}>
            <div className="text-center">
                <img alt="Orders icon" className="card-head-img" src="/images/orders.png"/>
                <span className="card-head-title">Order list by Product</span>
            </div>
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
            {!this.state.isFetching && this.state.orders.length === 0 ? <Empty/>: ""}
            {this.state.isFetching ? <Loader/>: this.renderHome() }
            {this.state.printActive && <PrintByProduct data={this.state.orders} startDate={this.state.startDate} endDate={this.state.endDate} reset={this.resetPrintData.bind(this)}></PrintByProduct>} 
            <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
            <div class="delete-modal modal fade" id="adminModalEmail" role="dialog">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                    <div className="text-left">
                        <div class="text-center modal-body">
                            <img alt="Email icon" src="/images/email.png" width='75'></img>
                            <h2 style={{color:'#a9a2a2',fontWeight:'100'}}>Email</h2>
                            <h5 style={{marginTop:'50px',color:'#a9a2a2',textAlign:'left',fontWeight:'100'}}>Email reciepents:</h5>
                            <form id="deletecategory" style={{marginTop:'20px'}}>
                                <input type="email" className="form-control" ref="email" placeholder="Email reciepients"></input>
                                <div class="row text-center" style={{marginTop:'20px'}}>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <button type="submit" className="modal-btn success"  data-dismiss="modal" onClick={this.mailOrder.bind(this)}>Email</button>
                                    </div>
                                </div>
                            </form>  
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
    renderHome(){
        var content = [],child = [];
        if(this.state.orders.length !==0){
            var total = 0;
            (this.state.orders).map((item,index) => {
                total +=  (item.quan.split(' ')[0] / item.unit_quantity.split(' ')[0]) * item.cost_price
            });
            content.push(
                <React.Fragment>
                    <div className="container-fluid">
                    <div>
                        <span style={{fontSize:'25px'}}>Product acquisition list</span>
                        <span className="text-center" style={{float:'right'}}>
                        <img alt="CSV icon" src="/images/csv.png" className="purchaseByProduct-Btn" onClick={this.exportTableToCSV.bind(this)}/>
                        <p>Download</p>
                        </span>
                        <span className="text-center" style={{float:'right'}}>
                        <img alt="Print icon" src="/images/print.png" className="purchaseByProduct-Btn" onClick={this.printOrder.bind(this)}/>
                        <p>Print</p>
                        </span>
                        <span className="text-center" style={{float:'right'}}>
                        <img alt="Email icon" src="/images/email.png" className="purchaseByProduct-Btn" data-toggle="modal" data-target="#adminModalEmail"/>
                        <p>Email</p>
                        </span>
                    </div>
                    <div className="container-fluid table-responsive" style={{overflowX:'initial'}}>
                        <table className="table table-hover table-bordered table-responsive" style={{marginTop:'30px'}}>
                            <tbody>
                                <tr className="active" style={{color:'#000'}}>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Cost price</th>
                                </tr>
                               {child}
                            </tbody>
                        </table> 
                        <h3 style={{float:'right'}}>Total: {total} Rs</h3>
                    </div>
                    </div>    
                </React.Fragment>
            );
        }


        (this.state.orders).map((item,index) => {
                child.push(<OrderRow data={item}/>);
                
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
    var total_cost = (props.data.quan.split(' ')[0] / props.data.unit_quantity.split(' ')[0]) * props.data.cost_price;
    total_cost = Math.round(total_cost * 100) / 100;
    return(
          <tr>
                <td className="text-left">
                    <span className="order-id-xs">#{props.data.productid}</span> <br></br>
                    <span><img alt="Product preview" src={props.data.img_url} width="40" height="40"/></span>
                    {props.data.name}
                </td>
                <td style={{verticalAlign:'middle'}}>{quantity+" "+unit}</td>
                <td style={{verticalAlign:'middle'}}>{total_cost} Rs</td>
            </tr>
    );
}
export default PurchaseByProduct;