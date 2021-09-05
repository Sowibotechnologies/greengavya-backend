import React from 'react';
import Cookies from 'js-cookie';
import Snackbar from '../Common/Snackbar';

class Account extends React.Component{
    state= {
        msg_state: false
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
    onHandlePasswordChange(e){
        e.preventDefault();
        var pwdForm = document.getElementById("updatePwdForm");
        var curr_pwd = e.target.curr_pwd.value;
        var new_pwd = e.target.new_pwd.value;
        var cnfm_pwd = e.target.cnfm_pwd.value;
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        if(new_pwd === cnfm_pwd){
            fetch('/api/admin/changepassword',{
                method:'POST',
                body : JSON.stringify({
                    curr_pwd: curr_pwd,
                    new_pwd : new_pwd
                }),
                headers: {
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
                    this.Logout();
                    this.props.history.push('/login');
                }
            })
            .then(result => {
                this.onResultChange(result);
                pwdForm.reset();
            })
            .catch(e => {
                alert(e);
            })
        }
        else{
            this.onResultChange({status:"Failed",message:"Password Fields do not match !"})
        }
    }
    render(){
        return(
            <React.Fragment>
                <div className="text-left">
                    <div className="container card" style={{maxWidth:'600px'}}>
                        <div className="text-center">
                            <img alt="Settings icon" className="card-head-img" src="/images/settings.png"/>
                            <span className="card-head-title">&nbsp;Settings</span>
                        </div> 
                        <h2 style={{paddingBottom:'20px'}}>Change Password</h2>
                        <form id="updatePwdForm" onSubmit={this.onHandlePasswordChange.bind(this)} ref="myForm">
                                <div className="form-group">
                                    <label for="usr">Current Password:</label>
                                    <input type="password" className="form-control"  required name="curr_pwd" id="usr" placeholder="Name"/>
                                </div>
                                <div className="form-group">
                                    <label for="usr">New Password:</label>
                                    <input type="password" className="form-control"  required name="new_pwd" id="usr" placeholder="Name"/>
                                </div>
                                <div className="form-group">
                                    <label for="usr">Confirm new Password:</label>
                                    <input type="password" className="form-control"  required name="cnfm_pwd" id="usr" placeholder="Name"/>
                                </div>
                                <div className="modal-footer addProduct-btnPanel">
                                    <button type="submit" className="btn btn-primary" data-dismiss="modal">Submit</button>
                                    <button type="reset" className="btn btn-danger" style={{float:"right"}}>Clear</button>
                                </div>
                        </form>
                    </div>
                </div>
                <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
            </React.Fragment>
        );
    }
}
export default Account;