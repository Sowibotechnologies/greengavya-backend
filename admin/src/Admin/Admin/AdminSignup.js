import React from 'react';
import Cookies from 'js-cookie';
import Snackbar from '../Common/Snackbar';

class AdminSignup extends React.Component{

    state = {
        password:"",
        confirmpassword:"",
        v_code:'',
        email:'',
        errorMessage:false
    }

    componentDidMount(){
        this.setState({
            v_code:this.props.match.params.verif_code,
            email:this.props.match.params.email
        })
        this.verifySignup();
        var signupForm = document.getElementById("signupForm");
        signupForm.reset();
    }
    verifySignup(){
        fetch('/api/admin/verifysignup',{
            method:'GET',
            headers: {
                "Content-Type": "application/json",
                "email": this.props.match.params.email
            }
        })
        .then(res => {
            if(res.status === 200){
                return res.json();
            }else{
                this.props.history.push('/404');
            }
        })
        .then(result => {
            if(result[0] == undefined){
                this.props.history.push('/404');
            }
            else{
                if(result[0].verified === "true"){
                    this.props.history.push('/404');
                }
            }
        })
        .catch(e => {alert(e);})
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
    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
    }
    handleSubmit(e){
        e.preventDefault();
        var name = e.target.Usrname.value;
        var password = e.target.Usrpassword.value;
        var cnfmpassword = e.target.cnfmpassword.value;
        if(password !== cnfmpassword){
            this.onResultChange({status:"Failed",message:"Password fields do not match"});
        }else{

            fetch('/api/admin/signup',{
                method:'POST',
                body : JSON.stringify({verify_code:this.state.v_code,email:this.state.email,password:password,name:name}),
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }else{
                    this.onResultChange({status:"Failed",message:"Technical issue"}); 
                }
            })
            .then(result => {
                this.onResultChange(result);
                this.Logout();
                setTimeout(()=>{
                    this.props.history.push('/');
                },1000);
            })
            .catch(e => {alert(e);})
        }
    }

    render(){
        return(
            <React.Fragment>
        <div className="container-fluid login-main" >
            <div className="container login-inner text-left" >
                <img src="/images/logo.png" width='70' style={{margin:'auto'}} className="img-responsive"/>
                <h2 className="login-head">SIGNUP</h2>
                <form className="login-form" onSubmit={this.handleSubmit.bind(this)} id="signupForm">
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                             <input id="Usrname" style={{textTransform:'capitalize'}} type="text" class="login-input form-control" autoComplete="new-password" name="Usrname" placeholder="Username" required/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div><br></br>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <input id="Usrpassword" type="password" class="login-input form-control" autoComplete="new-password" name="Usrpassword" placeholder="Password" required/><br></br>
                            <input id="cnfmpassword" type="password" class="login-input form-control" autoComplete="new-password" name="cnfmpassword" placeholder="Confirm Password" required/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div><br></br>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <button type="submit" className="btn btn-success btn-block login-btn">GET STARTED</button>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div>
                </form>
            </div>
            <h6 className="text-center">&copy; 2019 GreenGavya.com. All Rights Reserved</h6>
        </div>
        <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
            </React.Fragment>
        )
    }
}

export default AdminSignup;