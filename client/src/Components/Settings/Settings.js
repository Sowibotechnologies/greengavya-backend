import React from 'react';
import Header from '../Header/Header';
import HeaderSmall from '../Header/HeaderSmall';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './settings.css';

const ACCOUNT_ROUTE = "account";
const FORGOT_PWD_ROUTE = "forgot";
const ADDRESS_ROUTE = "address";

class Settings extends React.Component{

    state = {
        cartCount:0,
        option:ACCOUNT_ROUTE,
        password:'',
        confirmpassword:'',
        oldpassword:'',
        f_name:'',
        l_name:'',
        email:'',
        phone:'',
        Capslock:false
    }

    componentDidMount(){
        document.title = "Settings";
        window.scrollTo(0, 0);
        this.getCart();
        var logged = this.CheckAuth();
        if(logged){
            this.setState({
                loggedIn:true,
                option:FORGOT_PWD_ROUTE
            })
        }else{
            alert("You need to login to visit this page!!");
            this.props.history.push('/');
        }
        this.getUserInfo();
    }

    componentWillReceiveProps(){
        window.scrollTo(0, 0);
        this.getCart();
        var logged = this.CheckAuth();
        if(logged){
            this.setState({
                loggedIn:true
            })
        }else{
            alert("You need to login to visit this page!!");
            this.props.history.push('/');
        }
    }

    CheckAuth(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        if(token !== undefined&&session !== undefined){
            return true;
        }else{
            return false;
        }
    }

    getCart(){
        var key = Cookies.get('_cid');
        if(key != null){
            fetch('/api/cart/showCart',{
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                    "_cid":key
                }
                })
            .then(res => res.json())
            .then(result => {
                if(result.result != null){
                    this.setState({
                        cartCount:result.result.length
                    })
                }
            })
        }
    }
    changeOption(opt){
        console.log(opt);
        this.setState({
            option:opt
        })
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleUserInfo(e){
        //console.log(e.target.value);
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    CheckCAPS(e){
        let capslock = e.getModifierState("CapsLock");
        this.setState({
            Capslock:capslock
        })
    }

    getUserInfo(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        fetch('/api/user/getuserinfo',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "token":token,
                "sessionid":session
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result != null){
                console.log(result);
                
                //var names = result[0].username.split(" ");
                this.setState({
                    f_name:result[0].username,
                    l_name:result[0].lastname,
                    email:result[0].email,
                    phone:result[0].phoneno
                })
            }else{
                this.props.history.push("/logout");
            }
        })
    }

    handleSubmit(e){
        e.preventDefault();
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        var oldpwd = e.target.oldpassword.value;
        var newpwd = e.target.password.value;
        var confirmpwd = e.target.confirmpassword.value;
        if(oldpwd !== ""){
            if(newpwd !== ""){
                if(confirmpwd !== ""){
                    if(newpwd === confirmpwd){
                        fetch("/api/user/resetpasswordbyloggeduser",{
                            headers:{
                                "Content-Type": "application/json",
                                // "Content-Type": "application/x-www-form-urlencoded",
                                "token":token,
                                "sessionid":session
                            },
                            method:'POST',
                            body:JSON.stringify({oldpassword:oldpwd, newpassword:newpwd})
                        })
                        .then(res => {
                            if(res.status == 200){
                                return res.json();
                            }else if(res.status == 401){
                                alert("Unauthorized User!!");
                                Cookies.remove('_token', { path: '' });
                                Cookies.remove('sessionID', { path: '' });
                                this.props.history.push('/');
                            }else{
                                alert("Something went Wrong!!")
                            }
                        })
                        .then(result => {
                            if(result.status == 406){
                                alert(result.message);
                            }else if(result.status == 200){
                                alert(result.message);
                                this.props.history.push('/');
                            }
                        })
                    }else{
                        alert("Confirm password Incorrect!!");
                    }
                }else{
                    alert("Please enter confirm password");
                }
            }else{
                alert("Please enter new password");
            }
        }else{
            alert("Please enter old password");
        }
    }
    
    Updateinfo(e){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        e.preventDefault();
        var data = e.target;
        fetch('/api/user/updateuserinfo',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "token":token,
                "sessionid":session
            },
            body:JSON.stringify({fname:data.f_name.value, lname:data.l_name.value, phone:data.phone.value})
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            if(result != null){
                alert(result.message);
                this.props.history.push('/');
            }else{
                alert("Something went wrong!");
            }
        })
    }

    render(){
        const { option, password, confirmpassword, f_name, l_name, email, phone, oldpassword, Capslock } = this.state;
        let component = null;
        switch(option){
            case ACCOUNT_ROUTE :
                component = <AccountInfo f_name={f_name} l_name={l_name} email={email} phone={phone} handleUserInfo={this.handleUserInfo.bind(this)} Updateinfo={this.Updateinfo.bind(this)}/>
                break;
            case FORGOT_PWD_ROUTE :
                component = <ForgotPassword CheckCAPS={this.CheckCAPS.bind(this)} Capslock={Capslock} oldpassword={oldpassword} password={password} confirmpassword={confirmpassword} handleSubmit={this.handleSubmit.bind(this)} handleChange={this.handleChange.bind(this)}/>
                break;
            default:
                component = <AccountInfo f_name={f_name} l_name={l_name} email={email} phone={phone} handleUserInfo={this.handleUserInfo.bind(this)}  Updateinfo={this.Updateinfo.bind(this)}/> 
        }
        return(
            <React.Fragment>
                <div className="container-fluid shop">
                    <div className="c_respo_nav-large">
                        <Header cartCount={this.state.cartCount}/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall cartCount={this.state.cartCount}/>
                    </div>
                    <Navigation />
                    <div className="container product-container">
                        <div className="row">
                            <div className="col-lg-2 col-md-2">
                                <div>
                                    <ul className="settings-list">
                                        <li><p onClick={this.changeOption.bind(this, FORGOT_PWD_ROUTE)}>Change password</p></li>
                                        <li><p onClick={this.changeOption.bind(this, ACCOUNT_ROUTE)}>Accounts</p></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-10 col-md-10 ">
                                <h3 className="product-head">Account Settings</h3>
                                {
                                    component
                                }
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

const ForgotPassword = (props) => {
    return(
        <React.Fragment>
            <h5>Reset Password</h5>
            <form onSubmit={props.handleSubmit.bind(this)}>
            <p className="reg-label">Enter your current Password *</p>
            <input type="password" name="oldpassword" id="oldpassword" onKeyUp={props.CheckCAPS.bind(this)} value={props.oldpassword} onChange={props.handleChange.bind(this)} minLength="8" maxLength="25" required className="login-textfield"/>
            <p className="reg-label">Enter your new Password *</p>
            <input type="password" name="password" id="password" onKeyUp={props.CheckCAPS.bind(this)} value={props.password} onChange={props.handleChange.bind(this)} minLength="8" maxLength="25" required className="login-textfield"/>
            <p className="reg-label">Confirm Password *</p>
            <input type="password" name="confirmpassword" id="confirmpassword" onKeyUp={props.CheckCAPS.bind(this)} value={props.confirmpassword} onChange={props.handleChange.bind(this)} minLength="8" maxLength="25" required className="login-textfield"/>
            {
                props.errorMessage ? <p style={{textAlign:'right',color:'#a94442',marginTop:'10px'}}>Password mismatch!</p> : null
            }
            <button className="login-btn" type="submit" style={{marginTop:'10px'}}>Save Changes</button>
            </form>
            {
                props.Capslock ?
                <p style={{color:'red'}}>Warning: CAPS lock enabled</p>
                :
                null
            }
            
        </React.Fragment>
    )
}

const AccountInfo = (props) => {
    return(
        <React.Fragment>
            <h5>Account Info</h5>
            <p className="reg-label">Email Address</p>
            <p style={{fontWeight:'400'}}>{props.email}</p>
            <form onSubmit={props.Updateinfo.bind(this)}>
                <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <p className="reg-label">First Name</p>
                            <input type="text" name="f_name" id="fname" value={props.f_name} onChange={props.handleUserInfo.bind(this)} style={{textTransform: "capitalize"}} minLength="2" maxLength="40" required className="login-textfield"/>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <p className="reg-label">Last Name</p>
                            <input type="text" name="l_name" id="lname" value={props.l_name}  onChange={props.handleUserInfo.bind(this)} style={{textTransform: "capitalize"}} minLength="2" maxLength="40" required className="login-textfield"/>
                        </div>
                </div>
                <p className="reg-label">Phone number *</p>
                <input type="number" name="phone" id="phone" value={props.phone} min="999999"  onChange={props.handleUserInfo.bind(this)} max="99999999999" required className="login-textfield"/>
                <p><button className="login-btn" type="submit" style={{marginTop:'10px'}}>Update Info</button></p>
            </form>
            
        </React.Fragment>
    )
}

export default Settings;