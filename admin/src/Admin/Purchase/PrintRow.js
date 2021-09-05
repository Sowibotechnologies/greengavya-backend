import React from 'react';
import './PrintRow.css';


class PrintRow extends React.Component{
    allLoaded(parentNode) {
        const imgElements = parentNode.querySelectorAll("img");
        for (const img of imgElements) {
          if (!img.complete) {
            return false;
          }
        }
        return true;
      }

    componentDidMount(){
        if(this.props.data !== ""){
            this.render();
            this.printData();
        }
    }

    printData(){
        var content = document.getElementById("divcontents");
        var pri = document.getElementById("printered").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        this.render();
        const refreshId = setInterval(()=>{
            console.log('====================================');
            console.log(this.allLoaded(content));
            console.log('====================================');
            if(this.allLoaded(content)){
                pri.print();
                clearInterval(refreshId);
                setTimeout(()=>{this.props.reset()},5000);
            }
        },500);
    }
    clearProps(){
        this.props.reset();
    }

    render(){
        var child = [];
        var date = new Date();
        var scheduled_date = new Date();
        scheduled_date.setTime(this.props.data[0].scheduled_date)
        date.setTime(this.props.data[0].date);
        var formattedDate = date.toDateString();
        var formattedScheduleDate = scheduled_date.toDateString();
        var total = 0;
        if(this.props.data.length !== 0){
            var context = this;
            this.props.data.forEach(function(i){
                total += i.quantity.split(' ')[0]*i.price;
                child.push(
                    <OrderRow data={i} context={this}/>
                );
            })
        }

        return(
            <React.Fragment>
                <iframe title="Print Frame" id="printered" onAfterPrint={this.printDone} style={{height:'0px',width:'0px',position: 'absolute'}}></iframe>
                <div class="panel print panel-default card" id="divcontents" ref={element => {this.galleryElement = element;
        }}>
                    <div style={{marginTop:'40px'}}>
                        <h3><img alt="Logo" src="/logo.png" width="150" onLoad={this.handleImageChange} onError={this.handleImageChange}/><span style={{float:'right',color:'#ccc'}}>RECEIPT</span></h3>
                    </div>
                    <div class="panel-heading purchaseDetails-panelHead"  style={{cursor:'pointer',marginTop:'100px'}} href={"#"+this.props.data.id}> 
                    <h4>OrderNo: #{this.props.data[0].orderid}<span style={{float:'right'}}>Scheduled for: {formattedScheduleDate}</span></h4>
                    <h5 style={{textTransform:'capitalize'}}>Ordered by: {this.props.data[0].username}<span style={{float:'right'}}>Ordered on: {formattedDate}</span></h5>
                    <h5>Payment Method: {this.props.data[0].payment_method}</h5>
                    <h5>Contact: {this.props.data[0].phone}</h5>
                        <div className="container-fluid text-center" style={{color:'#565656',fontWeight:'600'}}><p>Order details</p></div>
                    </div>
                    <div className="container-fluid table-responsive" style={{margin:'auto',width:'100%'}}>
                        <table className="table" style={{margin:'auto',marginTop:'30px',width:'100%',borderCollapse:'collapse'}}>
                            <tbody>
                                <tr className="active" style={{color:'#000'}}>
                                    <th style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Product</th>
                                    <th style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Quantity</th>
                                    <th style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Unit Price</th>
                                    <th style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Amount</th>
                                </tr>
                                {child}
                            </tbody>
                        </table>
                    </div>
                    <span style={{marginTop:'40px',float:'right',fontSize:'28px',fontWeight:'600'}}>Total:&nbsp; &#8377;{total.toFixed(2)}</span>
                    <div style={{position:'absolute',textAlign:'center',bottom:'0',width:'100%'}}>
                        <p style={{margin:'auto',textAlign:'center',width:'100%',color:'#565656',fontSize:'10px'}}>Please note that this invoice is not a demand for payment</p>
                    </div>
                </div>
            </React.Fragment>
        )
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
    var total = props.data.quantity.split(' ')[0] * props.data.price;
     return(
          <tr>
            {/* <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{props.data.name}</td>
            <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{quantity+ " " + unit}</td>
            <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{props.data.price}</td>
            <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{total.toFixed(2)}</td> */}
            <td className="text-left" style={{border:'1px solid #ccc',padding: "1px",borderCollapse:'collapse',textAlign:'left',verticalAlign:'middle'}}>
                <span><img alt="Product preview"  style={{verticalAlign:'middle'}}  src={props.data.img_url} width="40" height="40"/></span>
                <span>&nbsp;{props.data.name}</span>
            </td>
            <td style={{border:'1px solid #ccc',borderCollapse:'collapse',padding: "1px",textAlign:'left',verticalAlign:'middle'}}>{quantity+ " " + unit}</td>
            <td style={{border:'1px solid #ccc',borderCollapse:'collapse',padding: "1px",textAlign:'left',verticalAlign:'middle'}}>{props.data.price} Rs</td>
            <td style={{border:'1px solid #ccc',borderCollapse:'collapse',padding: "1px",textAlign:'left',verticalAlign:'middle'}}>{total} Rs</td>
         </tr>
    );
}
export default PrintRow; 