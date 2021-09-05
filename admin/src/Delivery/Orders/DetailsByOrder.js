import React from 'react';
import Loader from '../Loader/Loader';
import Empty from '../Common/Empty';
import { log } from 'util';

class DetailsByOrder extends React.Component{
    state={
        order:[],
        orderId:"",
        isFetching: true
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.orderId !== this.state.orderId) {
            if(nextProps.orderId !== ""){
                this.setState(() => 
                ({ 
                    orderId: nextProps.orderId,
                    isFetching: true
                }), 
                ()=>{
                    this.fetchOrderDetails(nextProps.orderId);
                  });
                
            }
        }
      }
    fetchOrderDetails(orderId){
        this.setState({order:[]});
        fetch("/api/order/testorderbyorderid",{
            method:'Post',
            body: JSON.stringify({orderId:orderId}),
            headers: { 'Content-type': 'application/json' }
        })
        .then(res => res.json())
        .then(result => {
            this.setState({
                order: result,
                isFetching: false
            })
        }).catch((err) => console.log(err));
    }
    renderOrderDetails(){
        var total = 0;
        var formatted_date = new Date();
        formatted_date.setTime(this.state.order[0].date);
        var scheduled_date = new Date();
        scheduled_date.setTime(this.state.order[0].scheduled_date);
        return(
            
            <React.Fragment>
                <img src="/images/remove.png"  class="close" data-dismiss="modal"/> 
            <div className="text-left container-fluid">
                <h4>OrderNo: #{this.state.order[0].orderid}</h4>
                <h5 style={{textTransform:'capitalize'}}>Ordered by: {this.state.order[0].username}</h5>
                <h5>Ordered on: {formatted_date.toDateString()}</h5>
                <h5>Deliver By: {scheduled_date.toDateString()}</h5>
                {
                   this.state.order[0].payment_method ==='Cash On Delivery'?
                    <h5 style={{textTransform:'capitalize'}}>Payment method: <span style={{color:'red',fontWeight:'bold'}}>COD</span></h5>
                   :
                    <h5 style={{textTransform:'capitalize'}}>Payment method: {this.state.order[0].payment_method}</h5>
                }
                
                <h5 style={{textTransform:'capitalize'}}>Delivery Speed:&nbsp;
                {this.state.order[0].delivery_speed ==="fast" ? 
                <span style={{textTransform:'capitalize',color:'#FF9800'}}>
                    <img src="/images/fast.png" alt="ico" width="20"></img>
                    {this.state.order[0].delivery_speed} Delivery
                </span>
                :
                <span style={{textTransform:'capitalize',color:'#2196F3'}}>
                    {this.state.order[0].delivery_speed} Delivery
                </span>
                }
                </h5>
            </div>
            <div className="container-fluid table-responsive">
                <table className="table table-hover table-bordered table-responsive" style={{marginTop:'30px',marginBottom:'30px'}}>
                    <tbody>
                        <tr className="active" style={{color:'#000'}}>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                        {
                                Object.keys(this.state.order).map((item) => {
                                total += this.state.order[item].quantity.split(' ')[0]*this.state.order[item].price;
                                return(
                                    <ProductRow data={this.state.order[item]} id ={item} context={this} key ={item}/>
                                )
                                })
                        }
                    </tbody>
                </table>
            </div>
            <div className="container-fluid">
                <h3 style={{float:'right'}}>Total: &#8377;{total.toFixed(2)}</h3>
            </div>
            <hr style={{borderTop:'4px dotted #9c9e9c'}}></hr>
            <div className="modal-header">
                <img alt="Delivery icon" src="/images/delivery.png" width='45'></img>
                <h2>Delivery Details</h2>
            </div>
            <div className="text-left container-fluid">
                <p className="card-adrress">{this.state.order[0].addressname},</p>
                <p className="card-adrress">{this.state.order[0].house}, {this.state.order[0].street}, {this.state.order[0].city}</p>
                <p className="card-adrress">{this.state.order[0].district}, {this.state.order[0].pin}</p>
                <p className="card-adrress">Landmark: {this.state.order[0].landmark}</p>
                <h5>Contact:&nbsp;
                    <a href={"tel:"+this.state.order[0].phone}>{this.state.order[0].phone}</a>
                </h5>
            </div>
            </React.Fragment>
        )
    }
    render(){
        return(
            <div className="text-left">
                <div class="text-center modal-body">
                    <div className="modal-header">
                        <img alt="Order icon" src="/images/orders.png" width='45'></img>
                        <h2>Order Details</h2>
                    </div>
                    {this.state.isFetching ? <Loader/>: this.renderOrderDetails() }
                </div>
            </div>
        )
    }
}
const ProductRow = (props) =>{
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
    var total = (props.data.quantity.split(' ')[0] * props.data.price).toFixed(2);
    return(
        <tr>
            <td className="text-left">
                <span className="order-id-xs">#{props.data.productid}</span> <br></br>
                <span><img alt="Product preview" src={props.data.img_url} width="40" height="40"/></span>
                {props.data.name}
            </td>
            <td style={{verticalAlign:'middle'}}>{quantity+ " " + unit}</td>
            <td style={{verticalAlign:'middle'}}>{props.data.price} Rs</td>
            <td style={{verticalAlign:'middle'}}>{total} Rs</td>
        </tr>
    );
}
export default DetailsByOrder;