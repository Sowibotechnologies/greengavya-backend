import React from 'react';
import Cookies from 'js-cookie';
import Empty from '../Common/Empty';
import Snackbar from '../Common/Snackbar';
import './ShowCouriers.css';
import Loader from '../Loader/Loader';

class ShowCouriers extends React.Component{
    state={
        isFetching: true,
        users:{},
        currentPage: 1,
        itemsPerPage: 8,
        nameToggle:'',
        emailToggle:'',
        orderToggle:''
    }
    componentDidMount(){
        this.fetchCouriers();
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
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
    fetchCouriers(){
        this.setState({
            isFetching: true,
            users:{}
        });
        fetch("/api/delivery/getallcouriers")
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                users: result
            });
        }).catch((err) => console.log(err));
    }
    deleteCourier(){
        var id = this.state.deleteID;
        var permission_id = this.state.permissionID;
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
            fetch("/api/delivery/"+id,{
                method:'DELETE',
                headers:{
                    "Content-Type": "application/json",
                    token: token,
                    sessionid: session
                },
                body:JSON.stringify({
                    permission_id: permission_id
                })
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
                if(res.status === 500){
                    this.onResultChange({status:"Success",message : "Account terminated!"});
                    this.Logout();
                    this.props.history.push('/');
                }
            })
            .then(result => {
                this.onResultChange(result);
                if(result.status === "Success"){
                    setTimeout(()=>{this.fetchCouriers();},200);
                }
            })
            .catch(e => console.log(e))
    }
    sortArrayByName(){
        var {users} = this.state;
        switch(this.state.nameToggle){
            case '':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.username) < capitalize(b.username)) { return -1; }
                        if(capitalize(a.username) > capitalize(b.username)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down',
                    emailToggle:'',
                    orderToggle:''
                });
                break;
            }
            case 'down':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.username) > capitalize(b.username)) { return -1; }
                        if(capitalize(a.username) < capitalize(b.username)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'up',
                    emailToggle:'',
                    orderToggle:''
                });
                break;
            }
            case 'up':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.username) < capitalize(b.username)) { return -1; }
                        if(capitalize(a.username) > capitalize(b.username)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down',
                    emailToggle:'',
                    orderToggle:''
                });
                break;
            }
        }
    }
    sortArrayByEmail(){
        var {users} = this.state;
        switch(this.state.emailToggle){
            case '':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.email) < capitalize(b.email)) { return -1; }
                        if(capitalize(a.email) > capitalize(b.email)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'',
                    emailToggle:'down',
                    orderToggle:''
                });
                break;
            }
            case 'down':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.email) > capitalize(b.email)) { return -1; }
                        if(capitalize(a.email) < capitalize(b.email)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'',
                    emailToggle:'up',
                    orderToggle:''
                });
                break;
            }
            case 'up':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.email) < capitalize(b.email)) { return -1; }
                        if(capitalize(a.email) > capitalize(b.email)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'',
                    emailToggle:'down',
                    orderToggle:''
                });
                break;
            }
        }
    }
    sortArrayByOrder(){
        var {users} = this.state;
        switch(this.state.orderToggle){
            case '':{
                this.setState({
                    users: users.sort(function(a, b){
                        return(a.order_count - b.order_count)
                    }),
                    nameToggle:'',
                    emailToggle:'',
                    orderToggle:'down'
                });
                break;
            }
            case 'down':{
                this.setState({
                    users: users.sort(function(a, b){
                        return(b.order_count - a.order_count)
                    }),
                    nameToggle:'',
                    emailToggle:'',
                    orderToggle:'up'
                });
                break;
            }
            case 'up':{
                this.setState({
                    users: users.sort(function(a, b){
                        return(a.order_count - b.order_count)
                    }),
                    nameToggle:'',
                    emailToggle:'',
                    orderToggle:'down'
                });
                break;
            }
        }
    }
    addCourier(){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/delivery/send",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify({email: this.refs.email.value})
        })
        .then(res =>{
            if(res.status === 200){
                return res.json()
            }
            if(res.status === 404){
                alert("Unauthorized user: Token Invalid");
                this.Logout();
                this.props.isAuthorized(false);
            }
        })
        .then(result => {
            this.onResultChange(result);
            if(result.status === "Success"){
                setTimeout(()=>{this.fetchCouriers();},200);
            }
            this.clearCourierForm();
        })
        .catch(e => console.log(e))

    }
    clearCourierForm(){
        var courierForm = document.getElementById("addcourier");
        courierForm.reset();
    }
    render(){
        const {users,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Object.entries(users).slice(firstIndex,lastIndex);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(users.length / itemsPerPage); i++) {
          pageNumbers.push(i);
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
                <div class="container card table-responsive" style={{marginTop:'20px',height:'865px'}}>
                <div className="text-center">
                    <img alt="Delivery icon" className="card-head-img" src="/images/delivery.png"/>
                    <span className="card-head-title">Couriers</span>
                </div> 
                <div className="text-left">
                    <button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#courierAddModal" style={{marginTop:'10px'}}>
                        <span style={{paddingRight:'15px'}} class="glyphicon glyphicon-shopping-cart"></span> Add Couriers 
                    </button>
                </div>
                {this.state.isFetching ? <Loader/>: (this.state.users.length === 0 ? <Empty/>: 
                (<table className="table" style={{marginTop:'30px'}}>
                        <tbody>
                        <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                            <th className="cissa-table-header left-head">Name&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.nameToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.nameToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByName.bind(this)}></span></th>
                            <th className="cissa-table-header left-head">Email&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.emailToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.emailToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByEmail.bind(this)}></span></th>
                            <th className="cissa-table-header">Orders fulfilled&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.orderToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.orderToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByOrder.bind(this)}></span></th>
                            <th className="cissa-table-header">Action</th>
                        </tr>
                        {
                            Object.keys(currentItemList).map((item) => {
                                return(
                                    <UserRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].user_id}/>
                                )
                            })
                        }
                        </tbody>
                </table>))
                }

                </div>
                <div class="delete-modal modal fade" id="CourierDeleteModalBlock" role="dialog">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                        <div className="text-left">
                            <div class="text-center modal-body">
                                <img alt="Remove icon" src="/images/remove.png" width='75'></img>
                                <h1 style={{color:'#a9a2a2',fontWeight:'100'}}>Are you sure?</h1>
                                <form id="deletecategory" style={{marginTop:'20px'}}>
                                    <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>This courier will be removed.<br></br>You cannot revert this process !</i>
                                    <div class="row text-center" style={{marginTop:'20px'}}>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="button" className="modal-btn danger" data-dismiss="modal" onClick={this.deleteCourier.bind(this)}>Remove</button>
                                        </div>
                                    </div>
                                </form>  
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div>
                    <ul className="page-numbers pagination">
                        {renderPageNumbers}
                    </ul>
                </div>
                <div className="modal fade" id="courierAddModal" role="dialog">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Add couriers</h2>
                            </div>
                            <div className="modal-body">
                                <form  ref="myForm" id="addcourier" onSubmit={(e)=>{e.preventDefault();}}>
                                    <div className="form-group text-left">
                                        <label for="usr">Email:</label>
                                        <input type="email" className="form-control" required ref="email" id="usr" placeholder="Email"/>
                                    </div>
                                </form>
                            </div>
                            <div class="row text-center">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <button type="button" className="modal-btn success" onClick={(e)=>{this.addCourier(this)}} data-dismiss="modal">Submit</button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <button type="reset" className="modal-btn danger" data-dismiss="modal" onClick={this.clearCourierForm.bind(this)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
            </React.Fragment>            
        );
    }
}
const UserRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td className="left-cell" style={{textTransform:'capitalize'}}>{props.data.username}</td>
            <td className="left-cell">{props.data.email}</td>
            <td style={{fontSize:'22px'}}>{props.data.order_count}</td>
            <td>
                <div className="row text-center">
                    <label class="switch cissa-tooltip" >
                        <img alt="Delete icon" src="/images/bin.png" className="showProduct-imgBtn" data-toggle="modal" data-target="#CourierDeleteModalBlock"  onClick={()=>{
                                    props.context.setState({
                                        deleteID: props.data.user_id
                                    })
                                }}></img>
                        <span class="tooltiptext">Suspend account</span>
                    </label>
                </div>
            </td>

        </tr>
    );
}

function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export default ShowCouriers;