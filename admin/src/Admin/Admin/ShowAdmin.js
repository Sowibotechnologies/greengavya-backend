import React from 'react';
import Cookies from 'js-cookie';
import AddAdmin from './AddAdmin';
import Snackbar from '../Common/Snackbar';
import CircularLoader from '../Loader/CircularLoader';
import Loader from '../Loader/Loader';
import Empty from '../Common/Empty';
import './ShowAdmin.css';


class ShowAdmin extends React.Component{
    state = {
        users: [],
        isFetching: true,
        clickedID:'',
        clickedName:'',
        currentPage: 1,
        itemsPerPage: 7
    }
    componentDidMount(){
        this.fetchAllAdmin();
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
    fetchAllAdmin(){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/admin/getall",{
            method:'GET',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            }
        })
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                users: result
            });
            this.render();
        }).catch((err) => console.log(err));
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
    deleteAdminByID(){
        var id = this.state.deleteID;
        var permission_id = this.state.permissionID;
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
            fetch("/api/admin/"+id,{
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
                    this.props.history.push('/login');
                }
                if(res.status === 500){
                    this.onResultChange({status:"Success",message : "Account terminated!"});
                    this.Logout();
                    this.props.history.push('/login');
                }
            })
            .then(result => {
                this.onResultChange(result);
                if(result.status === "Success"){
                    setTimeout(()=>{this.fetchAllAdmin();},200);
                }
            })
            .catch(e => console.log(e))

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
            <div class="container-fluid card" style={{marginTop:'20px'}}>
                <div className="text-center">
                    <img alt="Admin icon" className="card-head-img" src="/images/admin.png"/>
                    <span className="card-head-title">&nbsp;Admin</span>
                </div>   
                <div className="container-fluid text-left showProduct-topPanel">    
                    <button type="button" data-toggle="modal" data-target="#adminModal" class="btn btn-primary btn-lg">Invite an admin</button>
                </div>
                <div className="table-responsive" style={{marginTop:'15px',height:'718px',overflowX:'auto'}}>
                    {this.state.isFetching ? <Loader/>:(this.state.users.length === 0 ? <Empty/>:
                     (
                        <table className="table table-bordered" style={{marginTop:'30px'}}>
                            <thead>
                            <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                <th className="cissa-table-header" rowSpan="2">Name</th>
                                <th className="cissa-table-header" rowSpan="2">Email</th>
                                <th className="cissa-table-header" colSpan="3">Product Permissions</th>
                                <th className="cissa-table-header" colSpan="3">Category Permissions</th>
                                <th className="cissa-table-header" colSpan="1">Order Permissions</th>
                                <th className="cissa-table-header" colSpan="1">User Permissions</th>
                                <th className="cissa-table-header" colSpan="2">Courier Permissions</th>
                                <th className="cissa-table-header" colSpan="3">Admin Permissions</th>
                                <th className="cissa-table-header" rowSpan="2">Actions</th>
                            </tr>
                            <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                <th className="cissa-table-header" scope="col">Write</th>
                                <th className="cissa-table-header" scope="col">Edit</th>
                                <th className="cissa-table-header" scope="col">Delete</th>
                                <th className="cissa-table-header" scope="col">Write</th>
                                <th className="cissa-table-header" scope="col">Edit</th>
                                <th className="cissa-table-header" scope="col">Delete</th>
                                {/* <th className="cissa-table-header" scope="col">Write</th> */}
                                <th className="cissa-table-header" scope="col">Edit</th>
                                {/* <th className="cissa-table-header" scope="col">Delete</th> */}
                                {/* <th className="cissa-table-header" scope="col">Write</th> */}
                                <th className="cissa-table-header" scope="col">Edit</th>
                                <th className="cissa-table-header" scope="col">Write</th>
                                <th className="cissa-table-header" scope="col">Delete</th>
                                {/* <th className="cissa-table-header" scope="col">Delete</th> */}
                                <th className="cissa-table-header" scope="col">Write</th>
                                <th className="cissa-table-header" scope="col">Edit</th>
                                <th className="cissa-table-header" scope="col">Delete</th>
                            </tr>
                            </thead>
                                <tbody>
                                {
                                    Object.keys(currentItemList).map((item) => {
                                        return(
                                            <AdminRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].product_id}/>
                                        )
                                    })
                                }
                                </tbody>
                        </table>
                    )) }

                </div>

                <div class="modal fade" id="adminModal" role="dialog">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <AddAdmin context={this} isAuthorized={this.onAuthChange.bind(this)} result={this.onResultChange.bind(this)}/>
                        </div>
                    </div>
                </div>
                <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
                        
            </div>
            <div>
                <ul class="page-numbers pagination">
                        {renderPageNumbers}
                </ul>
            </div>
            <div class="delete-modal modal fade" id="adminModalDelete" role="dialog">
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
                                                <button type="button" className="modal-btn danger" data-dismiss="modal" onClick={this.deleteAdminByID.bind(this)}>Delete</button>
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
const AdminRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td style={{fontSize:'20px'}}>{props.data.username}</td>
            <td style={{fontSize:'14px'}}>{props.data.email}</td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "p_create") ?
                <CircularLoader/>:
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="p_create" checked={Boolean(props.data.p_create==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to add products.</span>
                </label>
                }
            </td>
            <td>                
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "p_alter") ?
                <CircularLoader/>:
                <label class="switch cissa-tooltip">
                        <input type="checkbox" name="p_alter" checked={Boolean(props.data.p_alter==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to edit product information.</span>
                </label>
                }
            </td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "p_dalete") ?
                <CircularLoader/>:
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="p_delete" checked={Boolean(props.data.p_delete==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to delete products.</span>
                </label>
                }
            </td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "c_create") ?
                <CircularLoader/>:
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="c_create" checked={Boolean(props.data.c_create==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to add categories.</span>
                </label>
                }
            </td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "c_alter") ?
                    <CircularLoader/>:
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="c_alter" checked={Boolean(props.data.c_alter==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to edit category information.</span>
                </label>
                }
            </td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "c_delete") ?
                <CircularLoader/>:
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="c_delete" checked={Boolean(props.data.c_delete==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to delete categories.</span>
                </label>
                }
            </td>
            {/* <td style={{fontSize:'22px'}}>---</td> */}
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "o_alter") ?
                <CircularLoader/>:    
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="o_alter" checked={Boolean(props.data.o_alter==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to change order status.</span>
                </label>
                }
            </td>
            {/* <td style={{fontSize:'22px'}}>---</td> */}
            {/* <td style={{fontSize:'22px'}}>---</td> */}
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "u_alter") ?
                    <CircularLoader/>:    
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="u_alter" checked={Boolean(props.data.u_alter==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to block/unblock users.</span>
                </label>}
            </td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "courier_create") ?
                    <CircularLoader/>:    
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="courier_create" checked={Boolean(props.data.courier_create==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to create couriers.</span>
                </label>}
            </td>
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "courier_delete") ?
                    <CircularLoader/>:    
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="courier_delete" checked={Boolean(props.data.courier_delete==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to remove couriers.</span>
                </label>}
            </td>
            {/* <td style={{fontSize:'22px'}}>---</td> */}
            <td>
                {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "a_create") ?
                <CircularLoader/>:    
                <label class="switch cissa-tooltip" >
                        <input type="checkbox" name="a_create" checked={Boolean(props.data.a_create==="true"?1:0)} onChange={(e)=>{
                            changePermission(e,props.data.permission_id,props.context)
                            }}/>
                        <span class="slider round"></span>
                        <span class="tooltiptext">Grant/Revoke permission to add new admin accounts.
                        <p style={{color:'red'}}>(Super Admin)</p></span>
                </label>
                }
            </td>
            <td>
            {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "a_alter") ?
            <CircularLoader/>:    
            <label class="switch cissa-tooltip" >
                    <input type="checkbox" name="a_alter" checked={Boolean(props.data.a_alter==="true"?1:0)} onChange={(e)=>{
                        changePermission(e,props.data.permission_id,props.context)
                        }}/>
                    <span class="slider round"></span>
                    <span class="tooltiptext">Grant/Revoke permission to edit all admin permissions.
                    <p style={{color:'red'}}>(Super Admin)</p></span>
            </label>
            }
            </td>
            <td>
            {(props.context.state.clickedID === props.data.permission_id && props.context.state.clickedName === "a_delete") ?
            <CircularLoader/>:    
            <label class="switch cissa-tooltip" >
                    <input type="checkbox" name="a_delete" checked={Boolean(props.data.a_delete==="true"?1:0)} onChange={(e)=>{
                        changePermission(e,props.data.permission_id,props.context)
                        }}/>
                    <span class="slider round"></span>
                    <span class="tooltiptext">Grant/Revoke permission to delete admin accounts.
                    <p style={{color:'red'}}>(Super Admin)</p></span>
            </label>
            }
            </td>
            <td>
                    <button type="button" class="btn btn-danger btn-md"  data-toggle="modal" data-target="#adminModalDelete"  onClick={()=>{
                                    props.context.setState({
                                        deleteID: props.data.user_id,
                                        permissionID: props.data.permission_id
                                    })
                            }}>
                        <span class="glyphicon glyphicon-remove-circle"></span> Remove
                    </button>
            </td>

        </tr>
);
function changePermission(e,id,context){
    context.setState({clickedID:id,clickedName:e.target.name});
    var token = Cookies.get("_token_admin");
    var session = Cookies.get("sessionID_admin");
    fetch("/api/admin/permission/"+id,{
        method:'PUT',
        body:JSON.stringify(
            {
                status:e.target.checked,
                permission: e.target.name
            }
        ),
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
            context.Logout();
            context.props.history.push('/login');
        }
    })
    .then(result => {
        context.onResultChange(result);
        setTimeout(()=>{
            context.setState({clickedID:''});
            context.fetchAllAdmin();
            context.render();
        },500);
        
    })
    .catch(e => console.log(e));
}
}
export default ShowAdmin;