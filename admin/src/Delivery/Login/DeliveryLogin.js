import React from 'react';
import Cookies from 'js-cookie';
import './Login.css';
import Snackbar from '../../Admin/Common/Snackbar';
import {Link} from 'react-router-dom';

class DeliveryLogin extends React.Component{
    state={
        status:'',
        message:'',
        msg_state:false
    }
    componentDidMount(){
        document.title= "Gavya | Delivery Panel";
    }
    handleLogin(e){
        e.preventDefault();
        var email = e.target.email.value;
        var password = e.target.password.value;
        fetch('/api/delivery/login',{
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
                Cookies.set("_token_admin_delivery", result.token, {expires:1});
                Cookies.set("sessionID_admin_delivery", result.csrf_token, {expires:1});
                this.props.history.push('/delivery');
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
            msg_state: true
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
                <img src="/images/delivery.png" width='150' alt="orders" style={{margin:'auto'}} className="img-responsive"/>
                <h2 className="login-head">DELIVERY LOGIN</h2>
                <form className="login-form" onSubmit={this.handleLogin.bind(this)}>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                             <input id="email" type="text" maxLength="30" class="login-input form-control" name="email" placeholder="Email" required/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div><br></br>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <input id="password" type="password" maxLength="15" class="login-input form-control" name="password" placeholder="Password" required/>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div><br></br>
                    <div className="form-group-lg row">
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <button type="submit" data-loading-text="Sending..." className="btn btn-success btn-block login-btn">LOGIN</button>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-xs-12"></div>
                    </div>
                    <div style={{marginTop:'20px'}}>
                        <Link to="/">Admin Login >> </Link>
                    </div>
                </form>
            </div>
            <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
        </div>
        );
    }
}
export default DeliveryLogin;