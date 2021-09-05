import React from 'react';
import Cookies from 'js-cookie';
import './Login.css';
import Snackbar from '../Common/Snackbar';
import {Link} from 'react-router-dom';
import CircularLoader from '../Loader/CircularLoader';
import Loader from '../Loader/Loader';
import GooeyLoader from '../Loader/GooeyLoader';

class Login extends React.Component{
    state={
        status:'',
        message:'',
        msg_state:false,
        fetching: false
    }
    componentDidMount(){
        document.title= "Gavya | Admin Panel";
        if(this.CheckAuth()){
            this.props.history.push('/Dashboard');
        }
        if(this.CheckDeliveryAuth()){
            this.props.history.push('/Delivery');
        }
    }
    CheckDeliveryAuth(){
        var token = Cookies.get("_token_admin_delivery");
        var session = Cookies.get("sessionID_admin_delivery");
        if(token !== undefined&&session !== undefined){
            return true;
        }else{
            return false;
        }
      }
    CheckAuth(){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        if(token !== undefined&&session !== undefined){
            return true;
        }else{
            return false;
        }
      }
    handleLogin(e){
        e.preventDefault();
        this.setState({fetching:true});
        var email = e.target.email.value;
        var password = e.target.password.value;
        fetch('/api/admin/login',{
            method:'POST',
            body : JSON.stringify({email:email,password:password}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.status === 200){
                return res.json()
            }
        })
        .then(result => {                       
            if(result.message !== undefined){
                this.onResultChange(result);
            }else{
                this.setState({fetching:false}); 
                Cookies.set("_token_admin", result.token, {expires:1});
                Cookies.set("sessionID_admin", result.csrf_token, {expires:1});
                this.props.history.push('/Dashboard');
            }
        })
        .catch(e => {
            alert(e);
        })
    }
    onResultChange(e){
        this.setState({
            status: e.status,
            description: e.message,
            msg_state: true,
            fetching:false
        });
        setTimeout(()=>{    
            this.setState({
               msg_state:false
           });
        }, 3000);
    }
    render(){
        return(
            <div className="container-fluid login-main" >
            <div className="container login-inner text-left" >
                <img src="/images/gavya_logo.png" width='150' style={{margin:'auto'}} className="img-responsive"/>
                <h2 className="login-head">ADMIN LOGIN</h2>
                {this.state.fetching ?
                <GooeyLoader/>:
                <form className="login-form" onSubmit={this.handleLogin.bind(this)}>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                             <input id="email" type="text" maxLength="30" className="login-input form-control" name="email" placeholder="Email" required/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div><br></br>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <input id="password" type="password" maxLength="15" className="login-input form-control" name="password" placeholder="Password" required/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div><br></br>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <button type="submit" data-loading-text="Sending..." className="btn btn-success btn-block login-btn">LOGIN</button>
                                <div style={{marginTop:'20px'}}>
                                    <Link to="/delivery-login">Delivery Login >> </Link>
                                </div>
                            
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div>
                </form>
            }
            </div>
            <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
        </div>
        );
    }
}
export default Login;