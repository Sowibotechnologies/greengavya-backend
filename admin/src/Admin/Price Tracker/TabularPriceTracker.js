import React from 'react';
import Cookies from 'js-cookie';
import Empty from '../Common/Empty';
import Snackbar from '../Common/Snackbar';
import Loader from '../Loader/Loader';
import './TabularPriceTracker.css';


class TabularPriceTracker extends React.Component{
    state = {
        products: [],
        filteredView:'',
        isFetching: true,
        currentPage: 1,
        itemsPerPage: 10,
        clickedId:'',
        nameToggle:'',
        priceToggle:'',    
        categories:"",
        categoryRow: [],
        startDate: new Date().getTime()
    }
    componentDidMount(){
        this.loadCategories();
        this.fetchProducts();
    }
    
    fetchProducts(){
        fetch("/api/product/getbydate/"+ this.state.startDate)
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                products: result
            });
            if(this.state.filteredView !== ''){
                this.setState({
                    filteredView: result.filter(item => item.category_name === this.refs.category_filter.value)
                });
            }
        }).catch((err) => console.log(err));
    }

    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    onAuthChange(e){
        this.props.history.push('/');
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
    deleteProduct(e){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
            fetch("/api/product/"+this.state.deleteID,{
                method:'DELETE',
                headers:{
                    "Content-Type": "application/json",
                    token: token,
                    sessionid: session,
                    old_img: this.state.deleteImg,
                    name: this.state.deleteName
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
                if(result.status === "Success"){
                    setTimeout(()=>{this.fetchProducts();},200);
                }
            })
            .catch(e => console.log(e))
    }
    sortArrayByName(){
        var {products} = this.state;
        switch(this.state.nameToggle){
            case '':{
                this.setState({
                    products: products.sort(function(a, b){
                        if(capitalize(a.name) < capitalize(b.name)) { return -1; }
                        if(capitalize(a.name) > capitalize(b.name)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down',
                    priceToggle:''
                });
                break;
            }
            case 'down':{
                this.setState({
                    products: products.sort(function(a, b){
                        if(capitalize(a.name) > capitalize(b.name)) { return -1; }
                        if(capitalize(a.name) < capitalize(b.name)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'up',
                    priceToggle:''
                });
                break;
            }
            case 'up':{
                this.setState({
                    products: products.sort(function(a, b){
                        if(capitalize(a.name) < capitalize(b.name)) { return -1; }
                        if(capitalize(a.name) > capitalize(b.name)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down',
                    priceToggle:''
                });
                break;
            }
        }
        setTimeout(()=>{
            var {products} = this.state;
            if(this.state.filteredView !== ''){
                this.setState({
                    filteredView: products.filter(item => item.category_name === this.refs.category_filter.value)
                });
            }
        },200);
    }
    sortArrayByPrice(){
        var {products} = this.state;
        switch(this.state.priceToggle){
            case '':{
                this.setState({
                    products: products.sort(function(a, b){
                        return(a.price - b.price)
                    }),
                    priceToggle:'down',
                    nameToggle:''
                });
                break;
            }
            case 'down':{
                this.setState({
                    products: products.sort(function(a, b){
                        return(b.price - a.price)
                    }),
                    priceToggle:'up',
                    nameToggle:''
                });
                break;
            }
            case 'up':{
                this.setState({
                    products: products.sort(function(a, b){
                        return(a.price - b.price)
                    }),
                    priceToggle:'down',
                    nameToggle:''
                });
                break;
            }
        }
        setTimeout(()=>{
            var {products} = this.state;
            if(this.state.filteredView !== ''){
                this.setState({
                    filteredView: products.filter(item => item.category_name === this.refs.category_filter.value)
                });
            }
        },200);
    }
    loadCategories(){
        fetch("/api/category/getcategory")
        .then(res => res.json())
        .then(result => {
            var temp = [];
            Object.keys(result).map((item) => {
                temp.push(
                    <option key={result[item].category_id}>{result[item].name}</option>
                );
            })
            this.setState({
                categoryRow: temp,
                categories: result
            });
        });
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

    onCategoryFilterChange(e){
        var {products} = this.state;
        this.setState({
            filteredView: products.filter(item => item.category_name === e.target.value),
            currentPage:1
        });
    }
    clearFilters(e){
        this.setState({filteredView:'',currentPage:1});
        this.refs.category_filter.selectedIndex = "0";
    }
    onTrackDateChange(e){
        var date = new Date(e.target.valueAsDate);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        this.setState({
            isFetching:true,
            startDate:date.getTime()
        });
        console.log('====================================');
        console.log(date.getTime());
        console.log('====================================');
        setTimeout(()=>{this.fetchProducts()},1000);
    }
    render(){
        const {products,currentPage,itemsPerPage,filteredView} = this.state;
        const pageNumbers = [];
        var currentItemList;
        if(filteredView === '')
        {
            const lastIndex = currentPage*itemsPerPage;
            const firstIndex = lastIndex - itemsPerPage;
            currentItemList = Object.entries(products).slice(firstIndex,lastIndex);
            for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
              pageNumbers.push(i);
            }
        }
        else{
            const lastIndex = currentPage*itemsPerPage;
            const firstIndex = lastIndex - itemsPerPage;
            currentItemList = Object.entries(filteredView).slice(firstIndex,lastIndex);
            for (let i = 1; i <= Math.ceil(filteredView.length / itemsPerPage); i++) {
              pageNumbers.push(i);
            }
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className={(this.state.currentPage === number ? 'active ' : '') + 'controls'}>
                <button className="pagination-button"
                key={number}
                id={number}
                onClick={this.onPageChange.bind(this)}>
                {number}
              </button>
              </li>
            );
          });
        return(
            <React.Fragment>
                <div class="container card table-responsive" style={{marginTop:'20px',height:'1240px'}}>
                    <div className="text-center">
                        <img alt="Price track icon" className="card-head-img" src="/images/price-tracker.png"/>
                        <span className="card-head-title">&nbsp;Price Tracker</span>
                    </div>
                    {/* <div class="row" style={{marginTop:'30px'}}>
                        <div class="text-left col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <input className="search-input" type="date" name="date" onChange={this.onTrackDateChange.bind(this)} defaultValue={this.formatDate(this.state.startDate)}></input>

                        </div>
                        <div class="text-right col-lg-9 col-md-9 col-sm-12 col-xs-12">

                        </div>
                    </div> */}
                    <input style={{float:'left'}} className="search-input" type="date" name="date" onChange={this.onTrackDateChange.bind(this)} defaultValue={this.formatDate(this.state.startDate)}></input>
                    <span style={{marginTop:'20px',float:'right'}}>
                        <button type="button" className="btn btn-default" data-toggle="collapse" data-target="#demo">
                        <span class="glyphicon glyphicon-filter"></span> Filter </button>
                        <div id="demo" className="collapse">
                            <hr></hr>
                            <select ref="category_filter" className="purchaseDetails-select" style={{marginRight:'10px'}} onChange={this.onCategoryFilterChange.bind(this)}>
                                <option disabled selected value>-- Filter by Category --</option>
                                {this.state.categoryRow}
                            </select>
                            <button type="button" className="btn btn-default" data-toggle="collapse" data-target="#demo" onClick={this.clearFilters.bind(this)}>
                            <span class="glyphicon glyphicon-remove-circle"></span> Clear</button>
                        </div>
                    </span>
                    {this.state.isFetching ? <Loader/>: (this.state.products.length === 0 ? <Empty/>:
                                    (<table className="table" style={{marginTop:'90px'}}>
                                    <tbody>
                                    <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                        <th className="cissa-table-header">Product Id</th>
                                        <th className="cissa-table-header">Image</th>
                                        <th className="cissa-table-header">Name&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.nameToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.nameToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByName.bind(this)}></span></th>
                                        <th className="cissa-table-header">Translated</th>
                                        <th className="cissa-table-header">Category</th>
                                        <th className="cissa-table-header">Price&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.priceToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.priceToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByPrice.bind(this)}></span></th>
                                        <th className="cissa-table-header">Cost</th>
                                        <th className="cissa-table-header">Quantity</th>
                                    </tr>
                                    {
                                        Object.keys(currentItemList).map((item) => {
                                            return(
                                                <ProductRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].product_id}/>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>))
                    }
                </div>
                <div>
                    <ul class="page-numbers pagination">
                        {renderPageNumbers}
                    </ul>
                </div>
                <div class="modal fade" id="myModal" role="dialog" style={{paddingLeft:'0px'}}>
                        <div class="modal-dialog modal-sm">
                            {/* <div class="modal-content">
                                <AddProduct context={this} isAuthorized={this.onAuthChange.bind(this)} result={this.onResultChange.bind(this)}/>
                            </div> */}
                        </div>
                </div>
                <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
                <div class="delete-modal modal fade" id="productModalDelete" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                            <div className="text-left">
                                <div class="text-center modal-body">
                                    <img alt="Remove icon" src="/images/remove.png" width='75'></img>
                                    <h1 style={{color:'#a9a2a2',fontWeight:'100'}}>Are you sure?</h1>
                                    <form id="deletecategory" style={{marginTop:'20px'}}>
                                        <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>You cannot revert this process !</i>
                                        <div class="row text-center" style={{marginTop:'20px'}}>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <button type="button" className="modal-btn danger" data-dismiss="modal" onClick={this.deleteProduct.bind(this)}>Delete</button>
                                            </div>
                                        </div>
                                    </form>  
                                </div>
                            </div>
                            </div>
                        </div>
                </div>
            </React.Fragment>
        );
    }
}
const ProductRow = (props) =>{
    return(
        <React.Fragment>
       {
           props.data.price === null ? ""
            :
            <tr className="showProduct-tableBody">
                <td className="showProduct-tableBody-td">{props.data.product_id}</td>
                <td className="showProduct-tableBody-imgRow">
                    <img alt="Product preview" src={props.data.img_url} width="70" height="70"/>
                </td>
                <td className="showProduct-tableBody-td">{props.data.name}</td>
                <td className="showProduct-tableBody-td">{props.data.translated}</td>
                <td className="showProduct-tableBody-td">{props.data.category_name}</td>
                <td className="showProduct-tableBody-td">{props.data.price}</td>
                <td className="showProduct-tableBody-td">{props.data.cost_price}</td>
                <td className="showProduct-tableBody-td">{props.data.quantity}</td>
            </tr>
        }
        </React.Fragment>
    );
}
function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
export default TabularPriceTracker;
