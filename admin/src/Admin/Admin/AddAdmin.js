import React from 'react';
import Cookies from 'js-cookie';

class AddAdmin extends React.Component{

    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
    }
    addAdmin(){
        var adminForm = document.getElementById("addadmin");
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/admin/send",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify(
                {
                    email: this.refs.email.value,
                    p_create: this.refs.p_create.checked.toString(),
                    p_alter: this.refs.p_alter.checked.toString(),
                    p_delete: this.refs.p_delete.checked.toString(),
                    c_create: this.refs.c_create.checked.toString(),
                    c_alter: this.refs.c_alter.checked.toString(),
                    c_delete: this.refs.c_delete.checked.toString(),
                    o_alter: this.refs.o_alter.checked.toString(),
                    u_alter: this.refs.u_alter.checked.toString(),
                    courier_create: this.refs.courier_create.checked.toString(),
                    courier_delete: this.refs.courier_delete.checked.toString(),
                    a_create: this.refs.a_create.checked.toString(),
                    a_alter: this.refs.a_alter.checked.toString(),
                    a_delete: this.refs.a_delete.checked.toString()
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
                this.props.isAuthorized(false);
            }
        })
        .then(result => {
            this.props.result(result);
            if(result.status === "Success"){
                setTimeout(()=>{this.props.context.fetchAllAdmin();},200);
            }
            adminForm.reset();
        })
        .catch(e => console.log(e))
    }
    render(){
        return(
        <React.Fragment>
            <div className="text-left">
             <div class="modal-header text-center">
                     <h2 class="modal-title">Add Admin</h2>
                 </div>
                 <div class="modal-body">
                     <form  ref="myForm" id="addadmin" onSubmit={(e)=>{e.preventDefault();}}>
                         <div className="form-group">
                             <label for="usr">Email:</label>
                             <input type="email" className="form-control" required ref="email" id="usr" placeholder="Email"/>
                         </div>
                         <h3 >Permissions</h3>
                         <div className="form-group">
                            <div>
                                <label>Product</label>
                            </div>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="p_create" value=""/>Write
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="p_alter" value=""/>Edit
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="p_delete" value=""/>Delete
                            </label>
                         </div>  
                         <div className="form-group">
                            <div>
                                <label>Category</label>
                            </div>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="c_create" value=""/>Write
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="c_alter" value=""/>Edit
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="c_delete" value=""/>Delete
                            </label>
                         </div> 
                         <div className="form-group">
                            <div>
                                <label>Order</label>
                            </div>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="o_alter" value=""/>Edit
                            </label>
                         </div> 
                         <div className="form-group">
                            <div>
                                <label>User</label>
                            </div>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="u_alter" value=""/>Edit
                            </label>
                         </div> 
                         <div className="form-group">
                            <div>
                                <label>Courier</label>
                            </div>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="courier_create" value=""/>Write
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="courier_delete" value=""/>Delete
                            </label>
                         </div> 
                         <div className="form-group">
                            <div>
                                <label>Admin</label>
                            </div>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="a_create" value=""/>Write
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="a_alter" value=""/>Edit
                            </label>
                            <label class="checkbox-inline">
                            <input type="checkbox" ref="a_delete" value=""/>Delete
                            </label>
                         </div> 
                         <div className="modal-footer addProduct-btnPanel">
                             <button type="button" onClick={(e)=>{this.addAdmin(this)}} className="btn btn-primary" data-dismiss="modal">Submit</button>
                             <button type="reset" className="btn btn-danger" style={{float:"right"}}>Clear</button>
                         </div>
                     </form>
                 </div>
            </div>
 
        </React.Fragment>
        );
    }
}
export default AddAdmin;