import React from 'react';
import './PrintRow.css';

class PrintByProduct extends React.Component{

    componentDidMount(){
        if(this.props.data !== ""){
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
        pri.print();
        this.props.reset();
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
    render(){
        var child = [];
        (this.props.data).map((item,index) => {
            child.push(<OrderRow data={item}/>);
            
    })
    var total = 0;
    (this.props.data).map((item,index) => {
        total +=  (item.quan.split(' ')[0] / item.unit_quantity.split(' ')[0]) * item.cost_price
    });
        return(
            <React.Fragment>
                <iframe title="Product PFrame" id="printered" style={{height:'0px',width:'0px',position: 'absolute'}}></iframe>
                <div class="panel print panel-default card" id="divcontents">
                    <span style={{margin:'auto',textAlign:'center',fontSize:'25px',marginTop:'40px'}}>Product acquisition list from {this.formatDateReadeable(this.props.startDate)} to {this.formatDateReadeable(this.props.endDate)}</span>
                    <div className="container-fluid table-responsive"  style={{margin:'auto',width:'100%'}}>
                        <table className="table table-hover table-bordered table-responsive" style={{margin:'auto',marginTop:'30px',width:'100%',borderCollapse:'collapse'}}>
                            <tbody>
                                <tr className="active" style={{color:'#000'}}>
                                    <th  style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Product Id</th>
                                    <th  style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Product Name</th>
                                    <th  style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Quantity</th>
                                    <th  style={{border:'1px solid #ccc',padding: "15px",textAlign:'left'}}>Cost</th>
                                </tr>
                                {child}
                            </tbody>
                        </table> 
                        <h3 style={{float:'right'}}>Total: {total} Rs</h3>
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
    var total_cost = (props.data.quan.split(' ')[0] / props.data.unit_quantity.split(' ')[0]) * props.data.cost_price;
    total_cost = Math.round(total_cost * 100) / 100;
    return(
          <tr>
                <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{props.data.productid}</td>
                <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{props.data.name}</td>
                <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{quantity+" "+unit}</td>
                <td style={{border:'1px solid #ccc',padding: "15px",borderCollapse:'collapse',textAlign:'left'}}>{total_cost} Rs</td>
            </tr>
    );
}

export default PrintByProduct; 