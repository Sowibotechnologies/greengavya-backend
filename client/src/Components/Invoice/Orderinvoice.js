import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class Orderinvoice extends React.Component{

    state = {
      InvoiceData:[],
      orderedDate:'',
      scheduledDate:''
    }

    constructor(props){
      super();
      if(props.location.data !== undefined){
        // data found
      }else{
        // data not found
        window.location.href = "/myorders"
      }
    }

    componentDidMount(){

        setTimeout(() => {
          this.setState({
            InvoiceData:this.props.location.data.products,
            orderedDate:this.props.location.data.orderedDate,
            scheduledDate:this.props.location.data.scheduledDate
          })
        }, 200);
    }

    printPage(){
      window.print();
    }

    downloadPage(orderid){
      var htmlSource = document.getElementById("invoice"+orderid);
      
      var margins = {
          top: 20,
          bottom: 60,
          left: 10,
          width: 522
      };
      html2canvas(htmlSource)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'pt', 'letter');
        pdf.addImage(imgData,'PNG',
          margins.left, // x coord
          margins.top, // y coord
        );
        pdf.save(orderid + ".pdf");
      })
    }

    render() {
        const { InvoiceData,orderedDate,scheduledDate } = this.state;
        var totalPrice =  0;
        Object.keys(InvoiceData).map(i => {
            totalPrice = (parseFloat(totalPrice) + (parseFloat(InvoiceData[i].price) * (InvoiceData[i].order_quantity))).toFixed(2);
        })
        return (
          <div className="container" style={{marginTop:'100px'}}>
              <div style={{margin:'auto',padding:'0px 10px', width:'780px'}} id={"invoice"+this.props.location.data.products[0].orderid}>
                <button onClick={this.printPage.bind(this)}>Print</button><button onClick={this.downloadPage.bind(this,this.props.location.data.products[0].orderid)} style={{marginLeft:'10px'}}>Download</button>
                <div style={{paddingBottom:'40px',paddingTop:'60px'}}>
                  <span><img src={ window.location.origin + "/logo/ic_logo_horizontal.png"} width="150"/></span><span style={{float:'right',fontWeight:600,marginTop:"20px"}}>Invoice/Bill of supply</span>
                </div>
                <div style={{display:'flex'}}>
                  <div style={{width:'390px'}}>
                    <b>Billing Address</b>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressname}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addresshouse}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressstreet}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addresscity}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressdistrict}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addresspin}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressphone}</p>
                  </div>
                  <div style={{width:'390px',textAlign:'right'}}>
                    <b>Shipping Address</b>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressname}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addresshouse}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressstreet}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addresscity}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressdistrict}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addresspin}</p>
                    <p style={{marginBlockStart:'4px',marginBlockEnd:'2px'}}>{this.props.location.data.products[0].addressphone}</p>
                  </div>
                </div>
                <div style={{display:'flex',marginTop:'30px'}}>
                  <div style={{width:'390px'}}>
                    <b>Order Number : {this.props.location.data.products[0].orderid}</b>
                    <p style={{marginBlockStart:'8px',marginBlockEnd:'0px'}}>Purchase Date : {orderedDate}</p>
                    <p style={{marginBlockStart:'8px',marginBlockEnd:'8px'}}>Delivery Date : {scheduledDate}</p>
                  </div>
                  <div style={{width:'390px',textAlign:'right'}}>
                    <b>Invoice Number : {this.props.location.data.products[0].orderid}</b>
                  </div>
                </div>
                <table style={{border:'1px solid #333',width:'100%'}}>
                  <thead style={{backgroundColor:'#9e9e9e'}}>
                    <tr style={{fontWeight:'bold'}}>
                      <td>Sl.no</td>
                      <td>Description</td>
                      <td>Unit price</td>
                      <td>Qty</td>
                      <td style={{textAlign:'right'}}>Amount</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        Object.keys(InvoiceData).map((i) => {
                          
                          var itemTotal = (InvoiceData[i].order_quantity * InvoiceData[i].price).toFixed(2);
                          return(
                              <tr key={i}>
                                  <td>{Number(i) + 1}</td>
                                  <td>{InvoiceData[i].name} <small>{InvoiceData[i].quantity}</small></td>
                                  <td>{InvoiceData[i].price}</td>
                                  <td>{InvoiceData[i].order_quantity}</td>
                                  <td style={{textAlign:'right'}}>{itemTotal}</td>
                              </tr>
                          )
                        })
                    }
                  </tbody>
                </table>
                <div style={{display:'flex'}}>
                  <div style={{width:'580px'}}>
                    {/* <h6 style={{marginBlockEnd:'10px'}}>Amount in Words</h6> */}
                    {/* <h4>Fifty only</h4> */}
                  </div>
                  <div style={{width:'200px'}}>
                    <p style={{marginBlockStart:'8px',marginBlockEnd:'4px'}}>Subtotal : <span style={{float:'right'}}>{totalPrice}</span></p>
                    <p style={{marginBlockStart:'8px',marginBlockEnd:'4px'}}>Shipping : <span style={{float:'right'}}>0.00</span></p>
                    <p style={{marginBlockStart:'8px',marginBlockEnd:'4px'}}>Tax : <span style={{float:'right'}}>0.00</span></p>
                    <p style={{marginBlockStart:'8px',marginBlockEnd:'4px'}}>Total : <span style={{float:'right'}}>{totalPrice}</span></p>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <h4>For Greengavya.com</h4>
                  <h4>Authorized signature</h4>
                </div>
              </div>
          </div>
        )
    }
}

export default Orderinvoice;